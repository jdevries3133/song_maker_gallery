from time import sleep
import io

from django.test import TestCase

from PIL import Image
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, JavascriptException
from selenium.webdriver.chrome.options import Options

# Create your tests here.

CHROME_DRIVER_PATH = '/home/jack/main/screenshot_bot/bot/chromedriver' 

chrome_options = Options()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--window-size=1440x789')
driver = webdriver.Chrome(options=chrome_options, executable_path=CHROME_DRIVER_PATH)
driver.get('https://musiclab.chromeexperiments.com/Song-Maker/song/5240752520036352')

wait = WebDriverWait(driver, 10).until(
EC.visibility_of_element_located((By.XPATH, '//*[@id="instrument-canvas"]'))
)

try:
    loading_remover = "return document.getElementsByClassName('modal open-loading visible')[0].remove()"
    driver.execute_script(loading_remover)
except Exception as e:
    print(f'js exception {e}')

screenshot = driver.get_screenshot_as_png()
image = Image.open(io.BytesIO(screenshot))
image = image.convert('RGB')
image = image.crop((0, 80, 1440, 680))
image.save('result.jpg')

driver.close()
