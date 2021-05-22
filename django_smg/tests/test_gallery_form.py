from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support.wait import WebDriverWait

from .base_case import BaseCase


class TestGalleryForm(BaseCase):

    def setUp(self):
        self.login()
        self.gallery = self.create_sample_gallery()
        self.goTo(f'/teacher/{self.gallery.slug}/edit/')

    def test_update_title_and_description(self):
        # Input new title
        el = self.first_el(self.await_id('gallery title'))
        el.clear()
        el.send_keys('New Title')

        # Input new description
        el = self.first_el(self.await_id('gallery description'))
        el.clear()
        el.send_keys('New description is here')

        # submit form
        self.first_el(self.await_xpath('//input[@type="submit"]')).click()

        # loading spinner appears
        self.await_data_testid('loading spinner')

        # button no longer appears
        self.assertEqual(
            self.driver.find_elements_by_xpath('//input[@type="submit"]'),
            []
        )

        retries = 0
        while self.gallery.title != 'New Title':
            self.gallery.refresh_from_db()
            retries += 1
            if retries > 100:
                self.fail('Title did not change to "New Title" after 100 tries')

        # assert on gallery in db
        self.gallery.refresh_from_db()
        self.assertEqual(
            self.gallery.title,
            'New Title'
        )
        self.assertEqual(
            self.gallery.description,
            'New description is here'
        )
