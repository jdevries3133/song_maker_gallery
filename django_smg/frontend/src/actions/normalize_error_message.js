/**
 * For 400 errors, the backend sends helpful messages that the user should
 * see, and there are components for handlingn them.
 *
 * For other types of errors, though, we need to adjust the error message to
 * a data structure that can be rendered by those same components that render
 * the 400 error messages.
 *
 * Namely, {Header: ['messages']}
 */
export const normalizeErrorMessage = (msg, status) => {
  switch (status) {
    case 400:
      return msg;
    case 404:
      return { "404 Error": ["Item not found."] };
    case 500:
      return { "Server Error": ["Please try again."] };
    default:
      return { Error: ["An unknown error occured. Please try again."] };
  }
};
