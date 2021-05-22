from time import sleep
from typing import Iterable

from django.db import transaction
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from .base_case import BaseCase


class TestTeacherHome(BaseCase):

    NUM_GALLERIES = 5

    def setUp(self):
        self.login()
        with transaction.atomic():
            self.galleries = [
                self.create_sample_gallery() for _ in range(self.NUM_GALLERIES)
            ]
        self.goTo('/login')

    def test_all_galleries_listed(self):
        els = self.all_el(self.await_text('Test Title', many=True))
        (self.assertEqual(i.text, 'Test Title') for i in els)
        self.assertEqual(len(els), self.NUM_GALLERIES)

    def test_delete_button(self):
        self.first_el(self.await_data_testid('deleteGalleryBtn')).click()
        self.first_el(self.await_data_testid('confirmDeleteBtn')).click()

        # frontent indicates delete was successful
        self.await_text('Your gallery has been deleted.')
        el = self.await_data_testid('dismissBlanketButton')
        if isinstance(el, WebElement):
            el.click()
        else:
            self.fail('The page appears to contain overlapping blankets')

        # gallery has been removed from the database
        self.assertEqual(
            self.user.galleries.all().count(),
            self.NUM_GALLERIES - 1
        )
