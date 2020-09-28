# built-ins
from datetime import datetime
import os
import io
import re
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
from django.core.files.storage import default_storage

CHROME_DRIVER_PATH = os.path.join(os.path.dirname(__file__), 'chromedriver')
FAILURE_PLACEHOLDER_URL = 'https://song-maker-gallery.s3.amazonaws.com/screenshots/month-7-week-0/-1792009803650056698.jpg'
URL_VALIDATION_REGEX = re.compile(
    r'http(s)?://musiclab.chromeexperiments.com/Song-Maker/song/(\d){16}'
)
logger = logging.getLogger('file_logger')


def take_screenshots(array):
    """
    Launch webdriver, then iterate through array and take a screenshot for
    every songmaker link. Replace placeholder with public url. Make sure
    that the image is a heavily compressed jpeg.
    """
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--window-size=1440x789')
    driver = webdriver.Chrome(
        options=chrome_options,
        executable_path=CHROME_DRIVER_PATH
    )

    for group in array:
        removals = []
        for st_row in group[:-1]:

            if not re.match(URL_VALIDATION_REGEX, st_row[1].strip()):
                removals.append(st_row)
                continue

            # define constants
            url = st_row[1]

            # try to get a good screenshot by waiting for...
            # try three times with 20sec timeout
            try:
                driver.get(url)
                WebDriverWait(driver, 20).until(
                    EC.visibility_of_element_located(
                        (By.XPATH, '//*[@id="instrument-canvas"]'))
                )
                loading_remover = "return document.getElementsByClassName('modal open-loading visible')[0].remove()"
                driver.execute_script(loading_remover)

                # just need to let the transition animation pass
                screenshot = driver.get_screenshot_as_png()
                image = Image.open(io.BytesIO(screenshot))
                image = image.crop((0, 80, 1440, 680)).convert('RGB')
                s3_path = (
                    'screenshots/'
                    + datetime.now().date().isoformat()
                    + '/'
                    + str(hash(url))
                    + '.jpg'
                )

                # upload to s3
                with default_storage.open(s3_path, 'w') as s3:
                    # with open(new_filename, 'rb') as jpeg:
                    with io.BytesIO() as bio:
                        image.save(
                            bio,
                            format="JPEG",
                            quality=60,
                            optimize=True
                        )
                        s3.write(bio.getvalue())
                # put url into array
                st_row[2] = f'https://{os.getenv("AWS_STORAGE_BUCKET_NAME")}.s3.amazonaws.com/' + s3_path

            except TimeoutException:
                logger.error('Timeout exception on screenshot wait')
                st_row[2] = FAILURE_PLACEHOLDER_URL
                continue
            except JavascriptException:
                logger.error('JS exception on screenshot wait')
                st_row[2] = FAILURE_PLACEHOLDER_URL
                continue
            except Exception as err:
                logger.error(f'Unexpected exception: {err}')
                st_row[2] = FAILURE_PLACEHOLDER_URL
                continue

        # perform all mutations after iteration
        for remove in removals:
            group.remove(remove)

    driver.close()

    # with shelve.open('/Users/JohnDeVries/repos/song_maker_gallery/cache') as db:
    #     array = db['data']

    return array
