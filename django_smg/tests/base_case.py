import json
from pathlib import Path
from types import SimpleNamespace
from typing import Union, List

from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.staticfiles.testing import StaticLiveServerTestCase

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import WebDriverException
# from selenium.webdriver.chrome.options import Options
from selenium.webdriver.firefox.options import Options

from gallery.serializers import GallerySerializer  # type: ignore


class BaseCase(StaticLiveServerTestCase):
    """
    Includes some adapter code for the cumbersome Selenium API.
    """

    headless = False

    @ classmethod
    def setUpClass(cls):
        super().setUpClass()

        if settings.INTEGRATION_TEST_BROWSER == 'CHROME':
            options = Options()
            if getattr(cls, 'headless', None):
                options.add_argument('--headless')
                options.add_argument('--disable-gpu')
                options.add_argument('--window-size=1280,1696')
            cls.driver = webdriver.Chrome(options=options)

        elif settings.INTEGRATION_TEST_BROWSER == 'FIREFOX':
            # firefox options
            options = Options()
            if getattr(cls, 'headless', None):
                options.headless = True
            if settings.INTEGRATION_TEST_OPEN_DEVTOOLS:
                options.add_argument('-devtools')
            cls.driver = webdriver.Firefox(options=options)

        else:
            raise ValueError('Value for INTEGRATION_TEST_BROWSER was not valid. '
                             'See settings/development.py')

    @ classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        cls.driver.quit()

    def goTo(self, route: str) -> None:
        """
        Navigate the driver to http://localhost:8000/[route]
        """
        self.driver.get(self.live_server_url + route)

    def login(self, username=None, password=None) -> User:
        """
        Create user and authenticate them in the frontend; leaving the browser
        at the /teacher route.
        """
        user = self.create_user()
        self.goTo('/login')
        self.submit_login_form(username or self.username, password or self.password)
        self.expect_path_to_become('/teacher')
        return user

    def submit_login_form(self, username: str, password: str) -> None:
        """
        Just the form interaction after the page is loaded and user created.
        """
        self.first_el(self.await_data_testid('usernameInput')).send_keys(
            username
        )
        self.first_el(self.await_data_testid('passwordInput')).send_keys(
            password
        )
        self.first_el(self.await_data_testid('loginSubmit')).click()

    def create_user(self, username: str = 'testuser', password: str = 'testpass') -> User:
        self.username = username
        self.password = password
        self.user = User.objects.create_user(  # type: ignore
            username=self.username,
            password=self.password
        )
        return self.user

    def create_sample_gallery(self):
        if not hasattr(self, 'user'):
            raise Exception(
                'You must call create_user before calling '
                'create_sample_gallery, because the created gallery is '
                'assigned to self.user'
            )
        with open(Path(Path(__file__).parent, 'mock_data', 'gallery.json'), 'r') as jsonf:
            data = json.load(jsonf)
            serializer = GallerySerializer(
                data=data,
                context={'request': SimpleNamespace(user=self.user)}
            )
            if serializer.is_valid():
                gallery = serializer.save()
                return gallery
            else:
                self.fail(
                    f'Serializer not valid due to errors: {serializer.errors}'
                )

    def expect_path_to_become(self, route: str, max_retries=200):
        retries = 0
        while not self.driver.current_url.endswith(route):
            retries += 1
            if retries > max_retries:
                self.fail(f'Browser did not redirect to {route} route')

    def await_xpath(self, xpath: str, timeout: int = 3, many: bool = False
                    ) -> Union[WebElement, List[WebElement]]:
        try:
            if many:
                return WebDriverWait(self.driver, timeout).until(
                    EC.presence_of_all_elements_located((By.XPATH, xpath))
                )
            else:
                return WebDriverWait(self.driver, timeout).until(
                    EC.presence_of_element_located((By.XPATH, xpath))
                )
        except WebDriverException:
            self.driver.quit()
            self.fail(
                f'Element with xpath of {xpath} did not appear within '
                f'{timeout} seconds'
            )

    def await_id(self, id_: str, timeout: int = 3, many: bool = False
                 ) -> Union[WebElement, List[WebElement]]:
        """
        Wraps await_xpath
        """
        return self.await_xpath(f'//*[@id="{id_}"]', timeout, many)

    def await_data_testid(self, test_id: str, timeout: int = 3, many: bool = False
                          ) -> Union[WebElement, List[WebElement]]:
        """
        Wraps await_xpath
        """
        xpath = f'//*[@data-testid="{test_id}"]'
        return self.await_xpath(xpath, timeout, many)

    def await_text(self, text: str, timeout: int = 3, many: bool = False
                   ) -> Union[WebElement, List[WebElement]]:
        return self.await_xpath(f'//*[text() = "{text}"]', timeout, many)

    def first_el(self, item: Union[WebElement, List[WebElement]]
                 ) -> WebElement:
        """
        Kind of cursed, but I always have to check what comes back from these
        await_* functions despite **knowing** what it is based on the `many`
        param..... *sigh*
        """
        if isinstance(item, WebElement):
            return item
        return item[0]

    def all_el(self, item: Union[WebElement, List[WebElement]]
               ) -> List[WebElement]:
        """
        Equally cursed; same as above.
        """
        if isinstance(item, WebElement):
            return [item]
        return item


class TestTestSetup(BaseCase):
    """
    Check that the base case itself works.
    """

    def test_simple_usage(self):
        self.goTo('/signup')
        value = self.await_data_testid('emailInput')
        self.assertIsInstance(value, WebElement)

        self.goTo('/login')
        value = self.await_data_testid('passwordInput')
        self.assertIsInstance(value, WebElement)
        self.assertEqual(value.tag_name, 'input')  # type: ignore
