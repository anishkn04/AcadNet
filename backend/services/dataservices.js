import throwWithCode from "../utils/errorthrow.js";

export const userData = (id) => {
  try {
    if (!id || typeof id != "String") {
      throwWithCode("Error Fetching Id", 200);
    }
    throwWithCode("hello",200)
  } catch (err) {
    throw err;
  }
};
