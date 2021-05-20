from django.contrib.auth.models import User
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait

from .base_case import BaseCase


class TestAuth(BaseCase):

    def test_registration_process(self):
        self.goTo('/signup')

        # fill out and submit registration form
        el = self.await_data_testid('emailInput')
        isinstance(el, WebElement) and el.send_keys('usereml@website.com')

        el = self.await_data_testid('usernameInput')
        isinstance(el, WebElement) and el.send_keys('myusername')

        el = self.await_data_testid('passwordInput')
        isinstance(el, WebElement) and el.send_keys('passwordgoeshere')

        el = self.await_data_testid('passwordConfirmInput')
        isinstance(el, WebElement) and el.send_keys('passwordgoeshere')

        el = self.await_data_testid('tosCheckbox')
        isinstance(el, WebElement) and el.click()

        el = self.await_xpath('//input[@type="submit"]')
        isinstance(el, WebElement) and el.click()

        # check we have been redirected to teacher page
        WebDriverWait(self.driver, 3).until(EC.title_is, 'teacher')
        self.expect_path_to_become('/teacher')

        # ensure the account now exists
        user = User.objects.get(username='myusername')  # type: ignore
        self.assertEqual(user.email, 'usereml@website.com')

    def test_username_login(self):
        self.goTo('/login')
        User.objects.create_user(  # type: ignore
            username="myusername",
            password="passwordgoeshere"
        )
        self.login('myusername', 'passwordgoeshere')

        # check we have been redirected to teacher page
        WebDriverWait(self.driver, 3).until(EC.title_is, 'teacher')
        self.expect_path_to_become('/teacher')

    def test_email_login(self):
        self.goTo('/login')
        User.objects.create_user(  # type: ignore
            username="myusername",
            email="myemail@email.com",
            password="passwordgoeshere"
        )
        self.login(
            'myemail@email.com',
            'passwordgoeshere'
        )

        # check we have been redirected to teacher page
        WebDriverWait(self.driver, 3).until(EC.title_is, 'teacher')
        retries = 0
        while not self.driver.current_url.endswith('/teacher'):
            retries += 1
            if retries > 200:
                self.fail('Browser did not redirect to /teacher route')
