'use strict'

/**
 * Gets response when user wishes to recall information from memory.
 */
module.exports.function = function recallAction($vivContext, recallInput) {
  const util = require("util.js")
  const rest = require("rest.js")
  const cleanedInput = util.cleanString(recallInput)
  const response = rest.recall($vivContext, cleanedInput)
  return response
}
