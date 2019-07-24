'use strict'

/**
 * Gets response when saving information to memory.
 */
module.exports.function = function memorizeAction($vivContext, memorizeInput) {
  const util = require("util.js")
  const rest = require("rest.js")
  const cleanedInput = util.cleanString(memorizeInput)
  const response = rest.memorize($vivContext, cleanedInput)
  return response
}
