'use strict'

const rest = {}

const CLIENT_VERSION = '1.0.0'

rest.ACTION_TYPE_MEMORIZE = 'memorize'
rest.ACTION_TYPE_RECALL = 'recall'
rest.ACTION_TYPE_LIST = 'list'
rest.ACTION_TYPE_DELETE_ALL = 'delete-all'
rest.ACTION_TYPE_DELETE_ONE = 'delete-one'

/**
 * Looks up config and secret information stored in the Bixby Developer Center.
 *
 * @returns {{restApiUrl: *, secretClientApiKey: *}}
 */
const getConfigAndSecrets = function() {
  const config = require('config');
  const secret = require('secret');
  const restApiUrl = config.get('restApiUrl');
  const secretClientApiKey = secret.get('secretClientApiKey');
  return {
    restApiUrl: restApiUrl,
    secretClientApiKey: secretClientApiKey,
  }
}

/**
 * Makes a REST api call, given the urlSuffix (which describes which api method is called), as well
 * as additional parameters that help define the call. Returns the body of the response.
 *
 * @param $vivContext
 * @param {string} urlSuffix
 * @param {Object} additionalParams
 * @returns {Object}
 */
rest.postQuery = function($vivContext, additionalParams) {
  const console = require('console')
  console.log('$vivContext', $vivContext)
  console.log('additionalParams', additionalParams)
  if (params !== null) {
    const http = require('http')
    const configAndSecrets = getConfigAndSecrets()
    const secretClientApiKey = configAndSecrets['secretClientApiKey']
    const params = {
      secretClientApiKey: secretClientApiKey,
      clientVersion: CLIENT_VERSION,
      userId: $vivContext.userId,
    }
    const combinedParams = Object.assign(params, additionalParams)
    const options = {
      format: 'json',
      passAsJson: true,
      cacheTime: 0,
    }
    return http.postUrl(configAndSecrets['restApiUrl'], combinedParams, options)
  } else {
    console.error('rest.postQuery received null additionalParams')
    return {}
  }
}

/**
 * Makes a new array so that the elements contain only what is defined in Memory concept.
 *
 * @param {Array} answers
 * @returns {Array}
 */
rest.makeMemoriesFromAnswers = function(answers) {
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

module.exports = rest;
