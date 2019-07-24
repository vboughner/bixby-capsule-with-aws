'use strict'

const rest = {}

const CLIENT_VERSION = '1.0.0'
const MEMORIZE_URL = '/statement'
const RECALL_URL = '/question'
const LIST_URL = '/list'
const DELETE_ALL_URL = '/delete-all'

/**
 * Makes a REST api call, given the urlSuffix (which describes which api method is called), as well
 * as additional parameters that help define the call. Returns the body of the response.
 *
 * @param $vivContext
 * @param {string} urlSuffix
 * @param {Object} additionalParams
 * @returns {Object}
 */
const postQuery = function($vivContext, urlSuffix, additionalParams) {
  const console = require('console')
  console.log('$vivContext', $vivContext)
  console.log('urlSuffix', urlSuffix)
  console.log('additionalParams', additionalParams)
  if (urlSuffix !== null && params !== null) {
    const http = require('http')
    const util = require('util')
    const configAndSecrets = util.getConfigAndSecrets()
    const secretClientApiKey = configAndSecrets['secretClientApiKey']
    const params = {
      secretClientApiKey: secretClientApiKey,
      clientVersion: CLIENT_VERSION,
      userId: $vivContext.userId,
      deviceModel: $vivContext.deviceModel,
      canTypeId: $vivContext.canTypeId,
      handsFree: $vivContext.handsFree,
      timezone: $vivContext.timezone,
      storeCountry: $vivContext.storeCountry,
    }
    const combinedParams = Object.assign(params, additionalParams)
    const options = {
      format: 'json',
      passAsJson: true,
      cacheTime: 0,
    }
    const combinedUrl = configAndSecrets['restApiUrl'] + urlSuffix
    const response = http.postUrl(combinedUrl, combinedParams, options)
    return response.body
  } else {
    console.error('rest.postQuery received null urlSuffix or null additionalParams')
    return {}
  }
}

/**
 * Makes a new array so that the elements contain only what is defined in Memory concept.
 *
 * @param {Array} answers
 * @returns {Array}
 */
const makeMemoriesFromAnswers = function(answers) {
  if (answers && answers.length > 0) {
    const memories = []
    for (let i = 0; i < answers.length; i++) {
      memories.push({
        text: answers[i].text,
        whenStored: answers[i].whenStored,
        howLongAgo: answers[i].howLongAgo,
      })
    }
    return memories
  }
  return answers
}

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
 * @param {string} statement
 * @returns {Object}
 */
rest.memorize = function($vivContext, statement) {
  const console = require('console')
  if ($vivContext !== null && statement !== null) {
    const params = {
      statement: statement,
    }
    const body = postQuery($vivContext, MEMORIZE_URL, params)
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
 *       deviceId,
 *       score,
 *     },
 *   ],
 * }
 *
 * @param $vivContext
 * @param {string} question
 * @returns {Object}
 */
rest.recall = function($vivContext, question) {
  const console = require('console')
  if ($vivContext !== null && question !== null) {
    const params = {
      question: question,
    }
    const body = postQuery($vivContext, RECALL_URL, params)
    if (body['success']) {
      const memories = makeMemoriesFromAnswers(body['answers'])
      return {
        success: body['success'],
        question: question,
        speech: body['speech'],
        memories: memories,
      }
    } else {
      console.error('rest.recall received an error: ', body['errorCode'], body['errorMessage'])
      return {
        success: body['success'],
        question: question,
        speech: body['errorMessage'] || body['speech'],
        memories: [],
      }
    }
  } else {
    console.error('rest.recall received null $vivContext or question')
    return {
      success: false,
      question: question,
      speech: 'Unfortunately, I had a problem and do not know who is asking this question.',
      memories: [],
    }
  }
}

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
rest.list = function($vivContext) {
  const console = require('console')
  if ($vivContext !== null) {
    const params = {
      list: true,
    }
    const body = postQuery($vivContext, LIST_URL, params)
    if (body['success'] && body['answers']) {
      const memories = makeMemoriesFromAnswers(body['answers'])
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

/**
 * Deletes all memories, returns a simple speech string describing the effort.
 *
 * @param $vivContext
 * @returns {string}
 */
rest.deleteAll = function($vivContext) {
  const console = require('console')
  if ($vivContext !== null) {
    const params = {
      deleteAll: true,
    }
    const body = postQuery($vivContext, DELETE_ALL_URL, params)
    if (body['success']) {
      return body['speech']
    } else {
      console.error('rest.deleteAll received an error: ', body['errorCode'], body['errorMessage'])
      return body['errorMessage'] || body['speech']
    }
  } else {
    console.error('rest.deleteAll received null $vivContext')
    return 'Unfortunately, I had a problem and do not know who is asking to delete memories.'
  }
}
