const mongoose = require("mongoose");

function parseError(err) {
  if (err instanceof Error) {
    if (!err.errors) {
      err.errors = [err.message];
    } else {
      //mongoose valid error
      const error = new Error("Input validation error");
      error.errors = Object.fromEntries(
        Object.values(err.errors).map((e) => [e.path, e.message])
      );
      return error;
    }
  } else if (Array.isArray(err)) {
    const error = new Error("input validation error");
    error.errors = Object.fromEntries(err.map((e) => [e.path, e.msg]));

    return error;
  }

  return err;
}

module.exports = { parseError };
