'use strict'

/**
 * Gets a list of all memorized statements, returns an object that contains success information and an
 * array of memory objects, or an empty array when something went wrong:
 *
 * {
 *   success,
 *   speech,
 *   memories: [
 *     {
 *       text,
 *       whenStored,
 *       howLongAgo,
 *     },
 *   ],
 * }
 *
 * @param $vivContext
 * @returns {Object}
 */
module.exports.function = function($vivContext) {
  const console = require('console')
  const rest = require("rest.js")
  if ($vivContext !== null) {
    const params = {
      actionType: rest.ACTION_TYPE_LIST,
    }
    const body = rest.postQuery($vivContext, params)
    if (body['success'] && body['answers']) {
      const memories = rest.makeMemoriesFromAnswers(body['answers'])
      return {
        success: body['success'],
        memories: memories,
        speech: body['speech'],
      }
    } else {
      console.error('rest.list received an error: ', body['errorCode'], body['errorMessage'])
      return {
        success: false,
        memories: [],
        speech: body['errorMessage'] || body['speech'],
      }
    }
  } else {
    console.error('rest.list received null $vivContext')
    return {
      success: false,
      memories: [],
      speech: 'I could not understand who was asking.',
    }
  }
}
