"""
Test for the old manual-add gallery form
"""
from pathlib import Path

from .base_case import BaseCase
from gallery.models import Gallery


class TestManualForm(BaseCase):
    def setUp(self):
        self.login()

    def test_create_gallery(self):
        self.goTo("/teacher/launch/manual")
        el = self.await_data_testid("csvFileInput")

        # attach csv to file input
        csv = str(
            Path(
                Path(__file__).parents[2], "ui_testing_data", "test_group.csv"
            ).resolve()
        )
        self.first_el(el).send_keys(csv)

        # click through buttons with these ids
        ids = ["addSpreadsheetButton", "verifyGroupButton"]
        for i in ids:
            self.first_el(self.await_data_testid(i)).click()

        # input gallery name
        self.first_el(self.await_data_testid("titleInput")).send_keys("galTitl")

        # submit
        self.first_el(self.await_data_testid("submit")).click()

        # check that the url has a proper title-derived slug
        el = self.first_el(self.await_data_testid("newGalUrl"))
        self.assertEqual(el.text[-8:], "galtitl/")

        # check that we can go to the gallery now
        self.goTo("/gallery/galtitl/")
        # sanity check; it's not a 404 page, and the content is there
        self.await_id("test_group", timeout=20)

        # for good measure check the database
        gal = Gallery.objects.all().first()
        self.assertEqual(gal.title, "galTitl")  # type: ignore
        self.assertEqual(gal.songs.count(), 21)  # type: ignore
        self.assertEqual(gal.song_groups.count(), 1)  # type: ignore
        self.assertEqual(gal.song_groups.first().group_name, "test_group")  # type: ignore
