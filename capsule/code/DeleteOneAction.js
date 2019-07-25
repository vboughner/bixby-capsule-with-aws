'use strict'

/**
 * Deletes one memory, returns a simple speech string describing the effort.
 *
 * @param $vivContext
 * @param {object} memory
 * @returns {string}
 */
module.exports.function =  function($vivContext, memory) {
  const console = require('console')
  const rest = require("rest.js")
  if ($vivContext !== null && memory && memory.whenStored !== null) {
    const params = {
      actionType: rest.ACTION_TYPE_DELETE_ONE,
      whenStored: memory.whenStored,
    }
    const body = rest.postQuery($vivContext, params)
    if (body['success']) {
      return body['speech']
    } else {
      console.error('rest.deleteOne received an error: ', body['errorCode'], body['errorMessage'])
      return body['errorMessage'] || body['speech']
    }
  } else {
    console.error('rest.deleteOne received null $vivContext, memory, or memory.whenStored')
    return 'Unfortunately, I had a problem and do not know who is asking to delete a memory.'
  }
}
