'use strict'

const util = {};

util.cleanString = function(utterance) {
  if (utterance !== null) {
    utterance = utterance.trim();
  }
  return utterance;
}

util.getConfigAndSecrets = function() {
  const config = require('config');
  const secret = require('secret');
  const restApiUrl = config.get('restApiUrl');
  const secretClientApiKey = secret.get('secretClientApiKey');
  return {
    restApiUrl: restApiUrl,
    secretClientApiKey: secretClientApiKey,
  }
}

module.exports = util;
