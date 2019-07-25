'use strict'

/**
 * Gets a statement memorized and returns an object that contains the response speech as
 * well as information about the item just memorized:
 *
 * {
 *   success,
 *   memories: [
 *     {
 *       text,
 *       whenStored,
 *       howLongAgo,
 *     },
 *   ],
 *   speech,
 * }
 *
 * @param $vivContext
 * @param {string} memorizeInput
 * @returns {Object}
 */
module.exports.function = function($vivContext, memorizeInput) {
  const console = require('console')
  const rest = require("rest.js")
  if ($vivContext !== null && memorizeInput !== null) {
    const params = {
      actionType: rest.ACTION_TYPE_MEMORIZE,
      statement: memorizeInput,
    }
    const body = rest.postQuery($vivContext, params)
    if (body['success']) {
      return {
        success: body['success'],
        memories: [
          {
            text: body['text'],
            whenStored: body['whenStored'],
            howLongAgo: body['howLongAgo'],
          },
        ],
        speech: body['speech'],
      }
    } else {
      console.error('rest.memorize received an error: ', body['errorCode'], body['errorMessage'])
      return {
        success: body['success'],
        memories: [],
        speech: body['errorMessage'] || body['speech']
      }
    }
  } else {
    console.error('rest.memorize received null $vivContext or statement')
    return {
      success: false,
      memories: [],
      speech: 'Unfortunately, I had a problem and could not store what you said. Please try again.',
    }
  }
}
