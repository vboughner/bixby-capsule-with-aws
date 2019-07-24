'use strict';

// fuse.js library helps with fuzzy search for a string, see http://fusejs.io/
// threshold 0.0 requires a perfect match, threshold 1.0 matches anything
const Fuse = require('fuse.js');
const minWordLength = 3;
const maxWordLength = 32;
const fuseSearchOptions = {
    keys: ['Text'],
    shouldSort: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: maxWordLength,
    minMatchCharLength: minWordLength,
};

// strip out punctuation and double-spaces (probably only important for command line testing,
// because does the skill's literal slot really ever return any punctuation?)
// thanks go to this stack overflow answer: https://stackoverflow.com/a/4328722/5828789
function stripPunctuation(text) {
    // noinspection RegExpRedundantEscape
    let withoutPunctuation = text.replace(/[\!\?.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    return withoutPunctuation.replace(/\s{2,}/g,' ');  // removes extra spaces left in after removals
}

// list of words to ignore in search strings
const ignoreWords = [
    'who', 'what', 'where', 'why', 'how', 'when', 'many', 'much',
    'a', 'an', 'the', 'i', 'you', 'am', 'are', 'is', 'my', 'on', 'of', 'and',
    'did', 'say', 'said', 'about'
];

// returns an array of the significant words in a search string,
// it will filter out some of the words this way:
//     - do not consider words that are too short
//     - shorten all words that are longer than maxWordLength
//     - remove ignored words from the results
function findSignificantWordsInString(s) {
    let result = [];
    const initial = s.split(' ');
    for (let i = 0; i < initial.length; i++) {
        if (initial[i].length >= minWordLength) {
            let consider = initial[i];
            if (consider.length > maxWordLength) {
                consider = consider.substring(0, maxWordLength);
            }
            if (ignoreWords.indexOf(consider) === -1) {
                result.push(consider);
            }
        }
    }
    return result;
}

// list of words that mean the search was for everything
const everythingWords = [
  'all', 'everything'
]

// expects data in a format where there is an array of objects,
// the 'Text' attribute of each object is the one to search,
// and 'WhenStored' is expected to be unique (for this user),
// something like this:
//
// [
//     {
//         UserId: 'cmdlineuser',
//         WhenStored: '1520180339761',
//         Text: 'this is a statement about bananas and tomatoes dont eat them together'
//     },
//     <etc>
// ]
//
// The results will include an array of objects, that looks like the original
// objects, but contains only those elements in the data that match a search,
// and you can expect that there will be an additional element added, called 'Score',
// that is a sibling of the 'Text' attribute, which is a positive integer,
// and is number of words in the search string that had good results for a match
// with the data. Your best result will be the one with the highest score,
// that is also the most recent (recentness is the tie-breaker),
// and that will be placed as the first element of the returned array of results.
function searchThruDataForString(data, s) {
    let hashedResults = {};
    const nopunc = stripPunctuation(s.toLowerCase())
    // console.log('DEBUG: searching through data for string "' + nopunc +  '"');

    const base = new Fuse(data, fuseSearchOptions);

    // divide up the string into significant words and search for each of these individually
    const words = findSignificantWordsInString(nopunc);
    // console.log('DEBUG: significant words are', words)

    // if this actually looks like a request for everything, feed all results back
    if (data && (words.length === 0 || (words.length === 1 && everythingWords.indexOf(words[0]) !== -1))) {
        for (let i = 0; i < data.length; i++) {
            hashedResults[data[i].WhenStored] = data[i];
            hashedResults[data[i].WhenStored].Score = 1;
        }
    } else {
        // otherwise search for significant words in every entry and keep score for every word
        for (let i = 0; i < words.length; i++) {
            // console.log('DEBUG: searching for word === ' + words[i] + ' === and results for that word are');
            const wordResult = base.search(words[i]);
            // console.log(wordResult);
            for (let r = 0; r < wordResult.length; r++) {
                // put this result somewhere so we can count it
                if (hashedResults[wordResult[r].WhenStored]) {
                    hashedResults[wordResult[r].WhenStored].Score++;
                } else {
                    hashedResults[wordResult[r].WhenStored] = wordResult[r];
                    hashedResults[wordResult[r].WhenStored].Score = 1;
                }
            }
        }
    }

    // convert output to an array and sort it by score, placing the best results first
    let sortedResults = [];
    for (let property in hashedResults) {
        if (hashedResults.hasOwnProperty(property)) {
            sortedResults.push(hashedResults[property]);
        }
    }
    sortedResults.sort(function (a, b) {
        const score = b.Score - a.Score;
        if (score === 0) {
            return b.WhenStored - a.WhenStored;
        }
        else {
            return score;
        }
    });

    // console.log('DEBUG: sorted results are', sortedResults);
    // console.log();

    return sortedResults;
}


// plain command line tests will use something like to execute this script:
//     node search.js 'this is a test string'
//
/*
if (process && process.argv && process.argv.length > 1) {

    let mockdata = [
        {"UserId":"cmdlineuser","WhenStored":"1519920819210","Text":"i put tape under the door frame"},
        {"UserId":"cmdlineuser","WhenStored":"1519920819212","Text":"i put tape under the door"},
        {"UserId":"cmdlineuser","WhenStored":"1519920819213","Text":"i put tape under the door"},
        {"UserId":"cmdlineuser","WhenStored":"1519920819214","Text":"i put tape under the door"},
        {"UserId":"cmdlineuser","WhenStored":"1519920829215","Text":"fred's phone number is four five two three three nine four"},
        {"UserId":"cmdlineuser","WhenStored":"1520056342330","Text":"i've become increasingly concerned"},
        {"UserId":"cmdlineuser","WhenStored":"1520056343331","Text":"i took my medication this morning"},
        {"UserId":"cmdlineuser","WhenStored":"1520056344332","Text":"i hid the cookies on the bottom shelf"},
        {"UserId":"cmdlineuser","WhenStored":"1520056345334","Text":"susan washed the car"},
        {"UserId":"cmdlineuser","WhenStored":"1520056358968","Text":"There are three boxes of copy paper"},
        {"UserId":"cmdlineuser","WhenStored":"1520180339761","Text":"this is a statement about bananas and tomatoes dont eat them together"}
    ];

    process.argv.forEach(function (val, index, array) {
        console.log(index + ': ' + val);
        if (index > 1) {
            let response = searchThruDataForString(mockdata, process.argv[2]);
            console.log('   ' + JSON.stringify(response));
            console.log();
            if (response.length > 0) {
                console.log('BEST MATCH: ' + response[0].Text);
            }
            else {
                console.log('NO GOOD MATCHES');
            }
            console.log();
        }
    });
}
*/

// noinspection JSUnresolvedVariable
module.exports = {
    searchThruDataForString: searchThruDataForString
};
