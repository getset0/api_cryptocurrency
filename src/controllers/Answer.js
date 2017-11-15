'use strict';

const Answer = {
  returnResponseSuccess(res, data, msg = "") {
    return res.json({
      success: true,
      data: data,
      msg: msg
    })
  },

  returnResponseError(res, err) {
    console.log(err);
    return res.json({
      success: false,
      error: `${err}`,
      msg: err.message
    })
  },

  returnResponseNotFound(res, next) {
    return res.json({
      success: false,
      msg: new errors.ResourceNotFoundError('The resource you requested could not be found.')
    })
  },
}

module.exports = Answer
