'use strict'

/**
 * Deletes all stored memories.
 */
module.exports.function = function deleteAllAction($vivContext) {
  const rest = require("rest.js")
  const response = rest.deleteAll($vivContext)
  return response
}
