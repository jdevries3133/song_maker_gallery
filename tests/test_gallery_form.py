import logging
from time import sleep

from .base_case import BaseCase


logger = logging.getLogger(__name__)


class TestGalleryForm(BaseCase):
    def setUp(self):
        self.login()
        self.gallery = self.create_sample_gallery()
        self.goTo(f"/teacher/{self.gallery.slug}/edit/")

    def test_update_title_and_description(self):
        # Input new title
        el = self.first_el(self.await_id("gallery title"))
        el.clear()
        el.send_keys("New Title")

        # Input new description
        el = self.first_el(self.await_id("gallery description"))
        el.clear()
        el.send_keys("New description is here")

        # scroll down 1/2 page to show the submit button
        self.driver.execute_script("window.scrollTo(0,window.innerHeight / 2)")
        sleep(0.5)

        # submit form
        self.first_el(self.await_xpath('//input[@type="submit"]')).click()

        # button no longer appears
        def the_button_is_still_there() -> bool:
            xp = '//input[@data-testid="submitHeaderForm"]'
            return bool(len(self.driver.find_elements_by_xpath(xp)))

        retries = 0
        while the_button_is_still_there():
            retries += 1
            if retries > 5:
                self.fail("Button did not disappear after form submission")

        retries = 0
        while self.gallery.title != "New Title":
            self.gallery.refresh_from_db()
            retries += 1
            if retries > 100:
                self.fail('Title did not change to "New Title" after 100 tries')

        # assert on gallery in db
        self.gallery.refresh_from_db()
        self.assertEqual(self.gallery.title, "New Title")
        self.assertEqual(self.gallery.description, "New description is here")
