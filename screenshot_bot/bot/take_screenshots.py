# built-ins
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
import os
import io
from uuid import uuid4
from pathlib import Path
import re
from time import sleep
import logging

# take_screenshots
from PIL import Image
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, JavascriptException
from selenium.webdriver.chrome.options import Options

# django
from .models import ToDo
from django.core.files.storage import default_storage

CHROME_DRIVER_PATH = '/home/jack/main/screenshot_bot/bot/chromedriver' 
FAILURE_PLACEHOLDER_URL = 'https://song-maker-gallery.s3.amazonaws.com/manually_added/4115654398734306300.jpg'
URL_VALIDATION_REGEX = re.compile(r'http(s)?://musiclab.chromeexperiments.com/Song-Maker/song/(\d){16}')
 
def take_screenshots(todo):
    """
    Launch webdriver, then iterate through array and take a screenshot for
    every songmaker link. Replace placeholder with public url. Make sure
    that the image is a heavily compressed jpeg.
    """
    array = todo.api_obj
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--window-size=1440x789')
    driver = webdriver.Chrome(options=chrome_options, executable_path=CHROME_DRIVER_PATH)

    for group in array:
        removals = []
        for st_row in group[:-1]:

            if not re.match(URL_VALIDATION_REGEX, st_row[1].strip()):
                removals.append(st_row)
                continue

            # define constants
            url = st_row[1]

            # try to get a good screenshot by waiting for...
            # try three times with 10sec timeout
            try:
                driver.get(url)
                wait = WebDriverWait(driver, 10).until(
                    EC.visibility_of_element_located((By.XPATH, '//*[@id="instrument-canvas"]'))
                )
                loading_remover = "return document.getElementsByClassName('modal open-loading visible')[0].remove()"
                driver.execute_script(loading_remover)

                # just need to let the transition animation pass
                # sleep(1)
                screenshot = driver.get_screenshot_as_png()
                image = Image.open(io.BytesIO(screenshot))
                image = image.crop((0, 80, 1440, 680)).convert('RGB')

                s3_path = (
                    'screenshots/'
                    + f'month-{datetime.now().month}-week-{datetime.now().date().day // 7}/'
                    + str(hash(url))
                    + '.jpg'
                )

                # upload to s3
                with default_storage.open(s3_path, 'w') as s3:
                    # with open(new_filename, 'rb') as jpeg:
                    with io.BytesIO() as bio:
                        image.save(bio, format="JPEG", quality=60, optimize=True)
                        s3.write(bio.getvalue())
                # put url into array
                st_row[2] = 'https://song-maker-gallery.s3.amazonaws.com/' + s3_path

            except TimeoutException:
                logging.warning('Timeout exception on screenshot wait')
                st_row[2] = FAILURE_PLACEHOLDER_URL
                continue
            except JavascriptException:
                logging.warning('JS exception on screenshot wait')
                st_row[2] = FAILURE_PLACEHOLDER_URL
                continue
            except Exception as e:
                logging.warning(f'Unexpected exception: {e}')
                st_row[2] = FAILURE_PLACEHOLDER_URL
                continue

        # perform all mutations after iteration
        for remove in removals:
            group.remove(remove)

    driver.close()

    return {'pk': todo.url_extension, 'api_obj': array, 'needs_screenshot': False}

