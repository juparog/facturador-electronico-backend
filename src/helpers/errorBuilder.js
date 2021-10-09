
const simpleError = (code, message, name, err) => {
  const msg = err.message || '' + err;
  return {
    code: code,
    detail: {
      success: false,
      message: message,
      errors: [
        {
          name: name,
          message: msg,
        },
      ],
    }
  };
}

const simpleErrorWithArray = (code, message, errors) => {
  return {
    code: code,
    detail: {
      success: false,
      message: message,
      errors: errors,
    }
  };
}

export default {
  simpleError,
  simpleErrorWithArray
}
