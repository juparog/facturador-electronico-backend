import { logger } from './logger';

const simpleResponse = (code, success, message, data = {}) => {
  logger.error(' ::: helpers.responseBuilder.simpleResponse.');
  
  return {
    code,
    detail: {
      success,
      message,
      data
    },
  };
};

export default {
  simpleResponse
};
