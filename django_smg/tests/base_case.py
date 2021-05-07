from django.contrib.staticfiles.testing import StaticLiveServerTestCase

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.chrome.options import Options


class BaseCase(StaticLiveServerTestCase):
    """
    Includes some adapter code for the cumbersome Selenium API.
    """

    @ classmethod
    def setUpClass(cls):
        super().setUpClass()
        options = Options()
        if getattr(cls, 'headless', None):
            options.add_argument('--headless')
            options.add_argument('--disable-gpu')
            options.add_argument('--window-size=1280,1696')
        cls.driver = webdriver.Chrome(options=options)

    @ classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        cls.driver.quit()

    def goTo(self, route: str) -> None:
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
        return self.awaitXpath(xpath, timeout)

    def awaitXpath(self, xpath: str, timeout: int=3) -> WebElement:
        try:
            return WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located((By.XPATH, xpath))
            )
        except WebDriverException:
            self.driver.quit()
            self.fail(
                f'Element with xpath of {xpath} did not appear within '
                f'{timeout} seconds'
            )


class TestTestSetup(BaseCase):

    def test_simple_usage(self):
        self.goTo('/signup')
        value = self.awaitDataTestId('emailInput')
        self.assertIsInstance(value, WebElement)

        self.goTo('/login')
        value = self.awaitDataTestId('passwordInput')
        self.assertEqual(value.tag_name, 'input')
