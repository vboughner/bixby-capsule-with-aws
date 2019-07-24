'use strict';

const moment = require('moment');

// returns how long ago the given timestamp occurred, e.g. '4 minutes ago'
function getHowLongAgoText(timestamp) {
    let howLongAgoText = moment(timestamp).fromNow();
    if (!howLongAgoText || howLongAgoText === 'Invalid date') {
        howLongAgoText = 'earlier';
    }
    return howLongAgoText;
}

// noinspection JSUnresolvedVariable
module.exports = {
    getHowLongAgoText: getHowLongAgoText
};
