from selenium.webdriver.remote.webelement import WebElement

from .base_case import BaseCase


class TestSignup(BaseCase):

    def test_test_setup(self):
        self.goTo('/signup')
        value = self.awaitDataTestId('emailInput')
        self.assertIsInstance(value, WebElement)

        self.goTo('/login')
        value = self.awaitDataTestId('passwordInput')
        self.assertEqual(value.tag_name, 'input')
