from django.contrib.auth.models import User
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

    def login(self, username='testuser', password='testpass'):
        self.make_user()
        self.goTo('/login')
        self.submit_login_form(self.username, self.password)
        self.expect_path_to_become('/teacher')

    def make_user(self, username='testuser', password='testpass'):
        self.username = username
        self.password = password
        self.user = User.objects.create_user(  # type: ignore
            username=self.username,
            password=self.password
        )

    def submit_login_form(self, username, password):
        self.awaitDataTestId('usernameInput').send_keys(username)
        self.awaitDataTestId('passwordInput').send_keys(password)
        self.awaitDataTestId('loginSubmit').click()

    def expect_path_to_become(self, route: str, max_retries=200):
        retries = 0
        while not self.driver.current_url.endswith(route):
            retries += 1
            if retries > max_retries:
                self.fail(f'Browser did not redirect to {route} route')

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
