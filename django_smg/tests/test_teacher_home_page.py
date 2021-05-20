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
            self.galleries = [self.create_sample_gallery() for _ in range(self.NUM_GALLERIES)]
        self.goTo('/login')

    def test_all_galleries_listed(self):
        els = self.await_xpath('//*[text() = "Test Title"]')
        if isinstance(els, list):
            (self.assertEqual(i.text, 'Test Title') for i in els)
            self.assertEqual(len(els), self.NUM_GALLERIES)
        else:
            self.fail(
                'Only one element was returned. All galleries are not listed'
            )

    def test_delete_button(self):
        el = self.await_data_testid('deleteGalleryBtn')
        if isinstance(el, WebElement):
            el.click()
        el = self.await_data_testid('confirmDeleteBtn')
        if isinstance(el, WebElement):
            el.click()

        tries = 0
        while self.user.galleries.all().count() != 4:
            tries += 1
            sleep(0.01)
            if tries > 10:
                self.fail('Gallery was never deleted')

        # one gallery has been deleted
        self.assertEqual(
            self.user.galleries.all().count(),
            self.NUM_GALLERIES - 1
        )

        # modal should unmount
        try:
            tries = 0
            while self.driver.find_element_by_xpath(f'//*[@data-testid="blanket"]'):
                tries += 1
                sleep(0.01)
                if tries > 30:
                    self.fail('Delete gallery blanket did not unmount')
        except WebDriverException:
            # this is what we want. This means that the modal unmounted
            pass
