'use strict';

const semver = require('semver')
const wordModule = require('./word')
const searchModule = require('./search')
const dbModule = require('./db')
const timeModule = require('./time')
const error = require('./error.js')

const SECRET_CLIENT_API_KEY = process.env['secretClientApiKey']
const CLIENT_VERSION_SEMVER_SATISFIES = '1.x'
const SERVER_VERSION = '1.0.0'

// these should be the same as those in the capsule rest.js file
const ACTION_TYPE_MEMORIZE = 'memorize'
const ACTION_TYPE_RECALL = 'recall'
const ACTION_TYPE_LIST = 'list'
const ACTION_TYPE_DELETE_ALL = 'delete-all'
const ACTION_TYPE_DELETE_ONE = 'delete-one'

exports.handler = async (event) => {
    const body = event['body-json']
    if (!body) {
        return error.getResponse(error.MISSING_BODY)
    }
    const clientVersion = body['clientVersion']
    if (!clientVersion || !semver.satisfies(clientVersion, CLIENT_VERSION_SEMVER_SATISFIES)) {
        return error.getResponse(error.INCORRECT_CLIENT_VERSION)
    }
    if (!SECRET_CLIENT_API_KEY || SECRET_CLIENT_API_KEY !== body['secretClientApiKey']) {
        return error.getResponse(error.INCORRECT_CLIENT_AUTH)
    }
    const userId = body['userId']
    if (!userId) {
        return error.getResponse(error.MISSING_USER_ID)
    }
    const actionType = body['actionType']
    if (!actionType) {
        return error.getResponse(error.MISSING_ACTION_TYPE)
    }

    let response;
    if (actionType === ACTION_TYPE_MEMORIZE) {
        let cleanText = wordModule.cleanUpResponseText(body['statement'])
        response = await memorizeStatement(userId, cleanText)
    } else if (actionType === ACTION_TYPE_RECALL) {
        let cleanText = wordModule.cleanUpResponseText(body['question'])
        response = await recallForQuestion(userId, cleanText)
        if (!response) {
            response = error.getResponse(error.EMPTY_QUESTION)
        }
    } else if (actionType === ACTION_TYPE_LIST) {
        response = await getList(userId)
        if (!response) {
            response = error.getResponse(error.UNSPECIFIED, 'problem with list')
        }
    } else if (actionType === ACTION_TYPE_DELETE_ALL) {
        response = await deleteAll(userId)
        if (!response) {
            response = error.getResponse(error.DELETE_ALL_FAILED)
        }
    } else if (actionType === ACTION_TYPE_DELETE_ONE) {
        const whenStored = body['whenStored']
        if (whenStored) {
            response = await deleteOne(userId, whenStored)
            if (!response) {
                response = error.getResponse(error.DELETE_ONE_FAILED)
            }
        } else {
            return error.getResponse(error.MISSING_WHEN_STORED)
        }
    } else {
        response = error.getResponse(error.MISSING_API_COMMAND)
    }

    return response
};

// select the memories that best match the question and returns an array of them,
// the best match is first in the returned array.
// returns null if there are no memories
function selectBestMemoriesForQuestion(memories, question) {
    if (memories && memories.length > 0) {
        // search for the right memory using words from the question
        let results = searchModule.searchThruDataForString(memories, question);
        // console.log('RESULTS\n', results);

        if (results && results.length > 0) {
            return results;
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
}

// assumes the input is a question and returns a complete response to the question, with
// an object that contains all the possible responses, in order from best to worst (or
// an empty array of answers if there are no matches)
async function recallForQuestion(userId, text) {
    let refinedText = wordModule.cutQuestionChatter(text);
    const recordedMemories = await dbModule.loadMemories(userId);
    if (recordedMemories) {
        let bestMemories = selectBestMemoriesForQuestion(recordedMemories, refinedText);
        let response = {};
        response.answers = [];
        if (bestMemories && bestMemories.length > 0) {
            for (let i = 0; i < bestMemories.length; i++) {
                const selectedMemory = bestMemories[i];
                response.answers[i] = {
                    text: selectedMemory.text,
                    whenStored: selectedMemory.whenStored,
                    userId: selectedMemory.userId,
                    score: selectedMemory.score,
                    howLongAgo: timeModule.getHowLongAgoText(Number(selectedMemory.whenStored)),
                };
            }
            response.success = true;
            response.speech = 'You told me ' + response.answers[0].howLongAgo + ': ' + response.answers[0].text + '.';
        } else {
            response.success = false;
            response.speech = 'I don\'t have a memory that makes sense as an answer for that.';
        }
        response.serverVersion = SERVER_VERSION;
        console.log('question response', response);
        return response;
    } else {
        return error.getResponse(error.UNSPECIFIED, 'could not find the database to search memories')
    }
}

// return a response object that contains everything about a statement, after storing information
async function memorizeStatement(userId, text) {
    let refinedText = wordModule.cutStatementChatter(text);
    let response = {};
    if (refinedText) {
        const item = await dbModule.storeMemory(userId, refinedText);
        if (item) {
            response.success = true;
            response.text = item.text;
            response.whenStored = item.whenStored;
            response.userId = item.userId;
            response.howLongAgo = timeModule.getHowLongAgoText(Number(item.whenStored));
            response.speech = 'I will remember that you said: ' + refinedText + '.';
        }
        else {
            response.success = false;
            response.speech = 'I am sorry, I had a connection problem and could not store what you said.';
        }
    }
    else {
        response.success = false;
        response.speech = 'Hmmm, I heard you say, ' + text + ', but that didn\'t sound like a memory I could store.';
    }
    response.serverVersion = SERVER_VERSION;
    console.log('statement response', response);
    return response;
}

async function getList(userId) {
    const recordedMemories = await dbModule.loadMemories(userId);
    if (recordedMemories) {
        let response = {};
        response.answers = [];
        if (recordedMemories && recordedMemories.length > 0) {
            for (let i = recordedMemories.length - 1; i >= 0; i--) {
                const selectedMemory = recordedMemories[i];
                response.answers.push({
                    text: selectedMemory.text,
                    whenStored: selectedMemory.whenStored,
                    userId: selectedMemory.userId,
                    score: selectedMemory.score,
                    howLongAgo: timeModule.getHowLongAgoText(Number(selectedMemory.whenStored)),
                });
            }
            response.success = true;
            response.speech = 'You have ' + response.answers.length + (response.answers.length > 1 ? ' memories.' : ' memory');
        } else {
            response.success = true;
            response.speech = 'There are no memories.';
        }
        response.serverVersion = SERVER_VERSION;
        console.log('list response', response);
        return response;
    } else {
        return error.getResponse(error.UNSPECIFIED, 'could not find the database to get memories')
    }
}

async function deleteOne(userId, whenStored) {
    const item = {
        userId: userId,
        whenStored: whenStored,
    }
    const success = await dbModule.eraseOneMemory(item);
    let response = {
        userId: userId,
        whenStored: whenStored,
    };
    if (success) {
        response.success = true;
        response.speech = 'I deleted that memory.';
    } else {
        response.success = false;
        response.speech = 'There was a problem and I could not delete that memory.';
    }
    response.serverVersion = SERVER_VERSION;
    console.log('delete one response', response);
    return response;
}

async function deleteAll(userId) {
    const success = await dbModule.eraseAllMemories(userId);
    let response = {
        userId: userId,
    };
    if (success) {
        response.success = true;
        response.speech = 'I deleted all memories.';
    } else {
        response.success = false;
        response.speech = 'There was a problem and I could not delete all memories.';
    }
    response.serverVersion = SERVER_VERSION;
    console.log('delete all response', response);
    return response;
}
