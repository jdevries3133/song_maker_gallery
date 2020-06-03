# built-ins
from concurrent.futures import ThreadPoolExecutor
import os
from uuid import uuid4
from pathlib import Path
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
from .models import ToDo, Done


CHROME_DRIVER_PATH = '/Users/JohnDeVries/repos/song_maker_gallery/screenshot_bot/bot/chromedriver' 
 
def take_screenshots(todo):
    """
    Launch webdriver, then iterate through array and take a screenshot for
    every songmaker link. Replace placeholder with public url. Make sure
    that the image is a heavily compressed jpeg.
    """
    array = todo.api_obj
    breakpoint()
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--window-size=1440x789')
    driver = webdriver.Chrome(options=chrome_options, executable_path=CHROME_DRIVER_PATH)
    for group in array:
        for st_row in group[:-1]:

            # define constants
            url = st_row[1]
            filename = '/Users/JohnDeVries/repos/song_maker_gallery/screenshot_bot/bot/screenshot_cache/' + str(hash(url)) + '.png'

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
                driver.save_screenshot(filename)
                image = Image.open(filename)
                image = image.crop((0, 155, 2850, 1370)).convert('RGB')
                image.save((filename[:-4] + '.jpg'), format="JPEG", quality=60, optimize=True)
                os.remove(filename)
            except TimeoutException:
                logging.warning('Timeout exception on screenshot wait')
                pass
            except JavascriptException:
                logging.warning('JS exception on screenshot wait')
                pass
            except Exception as e:
                logging.warning(f'Unexpected exception: {e}')


    driver.close()


if __name__ == "__main__":
    pass