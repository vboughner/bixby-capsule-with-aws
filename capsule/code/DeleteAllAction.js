'use strict'

/**
 * Deletes all memories, returns a simple speech string describing the effort.
 *
 * @param $vivContext
 * @returns {string}
 */
module.exports.function = function($vivContext) {
  const console = require('console')
  const rest = require("rest.js")
  if ($vivContext !== null) {
    const params = {
      actionType: rest.ACTION_TYPE_DELETE_ALL,
    }
    const body = rest.postQuery($vivContext, params)
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
