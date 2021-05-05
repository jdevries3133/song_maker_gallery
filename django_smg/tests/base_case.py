from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.remote.webelement import WebElement
from selenium.common.exceptions import WebDriverException



class BaseCase(StaticLiveServerTestCase):
    """
    Includes some adapter code for the cumbersome Selenium API.
    """

    def setUp(self):
        self.driver = webdriver.Chrome()

    def tearDown(self):
        self.driver.quit()

    def goTo(self, route):
        """
        Navigate the driver to http://localhost:8000/[route]
        """
        self.driver.get(self.live_server_url + route)

    def awaitId(self, id_: str, timeout: int=3) -> WebElement:
        try:
            return WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located((By.ID, id_))
            )
        except WebDriverException:
            self.driver.quit()
            self.fail(
                f'Element with id of {id_} did not appear within {timeout} '
                'seconds'
            )

    def awaitDataTestId(self, test_id: str, timeout: int=3) -> WebElement:
        xpath = f'//*[@data-testid="{test_id}"]'
        try:
            return WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located((By.XPATH, xpath))
            )
        except WebDriverException:
            self.driver.quit()
            self.fail(
                f'Element with data-testid of {test_id} did not appear within '
                f'{timeout} seconds'
            )

