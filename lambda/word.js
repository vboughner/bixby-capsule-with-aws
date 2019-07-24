'use strict';

// clean up the text in the response before it is used for anything, we no longer make it lower case here or
// cut out punctuation, because we want it stored as it appears (later when we are searching, we'll make some
// adjustments to the question search words, to make them all lower case and strip out punctuation)
function cleanUpResponseText(text) {
    return text.trim();
}

// will be used in order, to trim words from the beginning of questions, order matters, as they will be
// tried in the order they appear here
let beginningQuestionChatter = [
    'hello',
    'please',
    'can you',
    'will you',
    'would you',
    'say',
    'tell',
    'ask',
    'my brain',
    'to',
    'me',
    'us',
];

// phrases that should be trimmed from the end of a question, order matters, they will be tried in order
let endingQuestionChatter = [
    'thank you'
];

// cuts away text before a question that doesn't matter, such as "tell me" or "please tell me",
// assumes text that is passed in is already all lower case
function cutQuestionChatter(text) {
    let retval = text;
    for (let i = 0; i < beginningQuestionChatter.length; i++) {
        if (retval.startsWith(beginningQuestionChatter[i] + ' ')) {
            retval = retval.substring(beginningQuestionChatter[i].length);
            retval = retval.trim();
        }
    }
    for (let i = 0; i < endingQuestionChatter.length; i++) {
        if (retval.endsWith(' ' + endingQuestionChatter[i])) {
            retval = retval.substring(0, retval.length - endingQuestionChatter[i].length);
            retval = retval.trim();
        }
    }
    return retval;
}

// will be used in order, to trim words from the beginning of statements, order matters, as they will be
// tried in the order they appear here
let beginningStatementChatter = [
    'hello',
    'please',
    'tell my brain',
    'tell me a brain',
    'ask my brain',
    'that',
    'to',
    'remember'
];

// phrases that should be trimmed from the end of a statement, order matters, they will be tried in order
let endingStatementChatter = [
    'thank you',
    'very much'
];

// cuts away text before a statement that doesn't matter, such as "tell me" or "please tell me",
// assumes text that is passed in is already all lower case
function cutStatementChatter(text) {
    let retval = text;
    for (let i = 0; i < beginningStatementChatter.length; i++) {
        if (retval.startsWith(beginningStatementChatter[i] + ' ')) {
            retval = retval.substring(beginningStatementChatter[i].length);
            retval = retval.trim();
        }
    }
    for (let i = 0; i < endingStatementChatter.length; i++) {
        if (retval.endsWith(' ' + endingStatementChatter[i])) {
            retval = retval.substring(0, retval.length - endingStatementChatter[i].length);
            retval = retval.trim();
        }
    }
    return retval;
}

// noinspection JSUnresolvedVariable
module.exports = {
    cleanUpResponseText: cleanUpResponseText,
    cutQuestionChatter: cutQuestionChatter,
    cutStatementChatter: cutStatementChatter,
};
