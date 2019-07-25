'use strict'

/**
 * Recalls a previously memorized statement, returns an object that contains the response text as
 * well an array of all the answers. The first answer in the array is the best answer.
 *
 * {
 *   success,
 *   question,
 *   speech,
 *   memories: [
 *     {
 *       text,
 *       whenStored,
 *       howLongAgo,
 *       userId,
 *       score,
 *     },
 *   ],
 * }
 *
 * @param $vivContext
 * @param {string} recallInput
 * @returns {Object}
 */
module.exports.function = function($vivContext, recallInput) {
  const console = require('console')
  const rest = require("rest.js")
  if ($vivContext !== null && recallInput !== null) {
    const params = {
      actionType: rest.ACTION_TYPE_RECALL,
      question: recallInput,
    }
    const body = rest.postQuery($vivContext, params)
    if (body['success']) {
      const memories = rest.makeMemoriesFromAnswers(body['answers'])
      return {
        success: body['success'],
        question: recallInput,
        speech: body['speech'],
        memories: memories,
      }
    } else {
      console.error('rest.recall received an error: ', body['errorCode'], body['errorMessage'])
      return {
        success: body['success'],
        question: recallInput,
        speech: body['errorMessage'] || body['speech'],
        memories: [],
      }
    }
  } else {
    console.error('rest.recall received null $vivContext or question')
    return {
      success: false,
      question: recallInput,
      speech: 'Unfortunately, I had a problem and do not know who is asking this question.',
      memories: [],
    }
  }
}
