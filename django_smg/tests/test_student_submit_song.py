from selenium.webdriver.support.select import Select

from gallery.models import Song
from .base_case import BaseCase


class TestStudentSubmitSong(BaseCase):

    def setUp(self):
        self.login()

        self.gallery = self.create_sample_gallery()
        self.gallery.is_editable = True
        self.gallery.save()

        self.goTo(f'/gallery/{self.gallery.slug}/submit-song')

    def test_form_flow(self):
        # --- first part
        self.first_el(self.await_id('name')).send_keys('Mikey')
        self.first_el(self.await_id('link')).send_keys(
            'https://musiclab.chromeexperiments.com'
            '/Song-Maker/song/5577825799634944'
        )
        self.first_el(self.await_data_testid('submit')).click()

        # --- second part
        el = self.first_el(self.await_id('selectGroup', timeout=5))
        # check that all groups are listed as choices
        all_options = [o.get_attribute('value')
                       for o in el.find_elements_by_tag_name('option')]
        self.assertEqual(all_options, ['A Group of Marks', 'A Group of Lillys'])

        # select the second option
        sel = Select(el)
        sel.select_by_value('A Group of Lillys')

        self.first_el(self.await_id('submit')).click()

        # --- success; form submitted
        self.first_el(self.await_data_testid('success'))
        self.first_el(self.await_data_testid('gotoGallery')).click()

        # ensure mikey is in A Group of Lillys
        self.gallery.refresh_from_db()
        group = self.gallery.song_groups.get(group_name='A Group of Lillys')
        try:
            new_song = group.songs.get(student_name='Mikey')
        except Song.DoesNotExist:
            self.fail('A new song was not created for Mikey')

        self.assertEqual(new_song.songId, '5577825799634944')

        # --- follow-through: user goes to the gallery
        retries = 0
        while self.driver.title != 'Test Title':
            retries += 1
            if retries > 100:
                self.fail('Did not successfully navigate to the gallery from '
                          'form success page')
