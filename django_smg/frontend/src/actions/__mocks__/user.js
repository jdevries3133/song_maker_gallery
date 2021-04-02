import { POST_GALLERY, GET_GALLERIES, DELETE_GALLERY } from "../types";

// POST GALLERY
export const postGallery = jest
  .fn()
  .mockImplementation((form) => (dispatch) => {
    dispatch({
      type: POST_GALLERY,
      payload: {
        status: 201,
        formPassthrough: null,
        gallery: {
          title: form.title,
          description: form.description,
          slug: form.title.toLowerCase().replace(" ", "-"),
          pk: 1,
        },
      },
    });
  });

// GET_GALLERIES
export const getUserGalleries = jest
  .fn()
  .mockImplementation(() => (dispatch) => {
    dispatch({
      type: GET_GALLERIES,
      payload: {
        galleries: [
          {
            title: "e",
            description:
              "We will always find a way to share music. In lieu of the concert hall, our musical performances today are expressed in ones and zeroes, but they are none the less as human and as meaningful as always.\n\nPlease enjoy this showcase of our school's music lab compositions. Our students' creativity truly knows no bounds!",
            slug: "e",
            pk: 1,
          },
          {
            title: "e",
            description:
              "We will always find a way to share music. In lieu of the concert hall, our musical performances today are expressed in ones and zeroes, but they are none the less as human and as meaningful as always.\n\nPlease enjoy this showcase of our school's music lab compositions. Our students' creativity truly knows no bounds!",
            slug: "e-1",
            pk: 2,
          },
          {
            title: "e",
            description:
              "We will always find a way to share music. In lieu of the concert hall, our musical performances today are expressed in ones and zeroes, but they are none the less as human and as meaningful as always.\n\nPlease enjoy this showcase of our school's music lab compositions. Our students' creativity truly knows no bounds!",
            slug: "e-2",
            pk: 3,
          },
        ],
      },
    });
  });

// DELETE_GALLERY
export const deleteGallery = jest.fn().mockImplementation(() => (dispatch) => {
  dispatch({
    type: DELETE_GALLERY,
    payload: { status: "deleted" },
  });
});

/* Must remove "deleted" status from redux state after user acknowledgement */
export const acknowledgeDelete = jest
  .fn()
  .mockImplementation(() => (dispatch) => {
    dispatch({
      type: DELETE_GALLERY,
      payload: { status: "delete_acknowledged" },
    });
  });
