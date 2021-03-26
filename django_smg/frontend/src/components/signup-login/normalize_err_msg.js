/**
 * Ensures that valid data is passed to <ErrorArray />, correcting for
 * inconsistent API responses.
 */
export const normalizeErrMsg = (data) => {
  switch (typeof data) {
    case "object":
      const response = { ...data };
      Object.keys(response).forEach((k) => {
        if (Array.isArray(response[k])) {
          response[k].forEach((m) => {
            if (typeof m !== "string") {
              delete object[k];
            }
          });
        } else {
          delete object[k];
        }
      });
      return response;
    case "string":
      return { Error: [data] };
    default:
      console.error(
        "The following api message could not be normalized and displayed:",
        data
      );
      return { Error: "An unknown error occured" };
  }
};
