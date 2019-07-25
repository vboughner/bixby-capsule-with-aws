'use strict';

const awsSDK = require('aws-sdk');
const docClient = new awsSDK.DynamoDB.DocumentClient({ region: 'us-east-1' });
const storeTable = 'MyBrainLines';
const maxBatchOperations = 25;    // you get an error with too many batch operations at once

// load everything from memory in the db for this user, returns the array of data items
async function loadMemories(userId) {
    return new Promise((resolve, reject) => {
        let params = {
            TableName: storeTable,
            KeyConditionExpression: '#user = :uId',
            ExpressionAttributeNames: {
                '#user': 'UserId'
            },
            ExpressionAttributeValues:  {
                ':uId': userId
            }
        };
        // console.log('DEBUG: reading with db params = ' + JSON.stringify(params));

        docClient.query(params, function(err, data) {
            if (err) {
                console.log('ERROR: problem in query operation = ' + JSON.stringify(err, null, 2));
                resolve([]);
            }
            else {
                // console.log('DEBUG: returned from query operation = ' + JSON.stringify(data));
                // data.Items.forEach(function(item) {
                //     console.log(" -", item.Text);
                // });
                resolve(data.Items);
            }
        });
    })
}

// store a line of text in the db, returns an object describing what was stored,
// or null if not successfully stored
async function storeMemory(userId, text) {
    return new Promise((resolve, reject) => {
        let when = Date.now().toString();
        let params = {
            TableName: storeTable,
            Item: {
                UserId: userId,
                WhenStored: when,
                Text: text
            }
        };
        // console.log('DEBUG: storing with db params = ' + JSON.stringify(params));

        // noinspection JSUnusedLocalSymbols
        docClient.put(params, function (err, data) {
            if (err) {
                console.log('ERROR: problem in put operation = ' + JSON.stringify(err));
                resolve(null);
            } else {
                resolve(params.Item);
            }
        });
    });
}

// remove one memory from the database, given the original item object made when recalling it,
// return true if successful, false if not successful
async function eraseOneMemory(item) {
    return new Promise((resolve, reject) => {
        let params = {
            TableName: storeTable,
            Key: {
                'UserId': item.UserId,
                'WhenStored': item.WhenStored.toString()
            },
        };
        // console.log('DEBUG: deleting with db params = ' + JSON.stringify(params));

        // noinspection JSUnusedLocalSymbols
        docClient.delete(params, function (err, data) {
            if (err) {
                console.log('ERROR: problem in delete operation = ' + JSON.stringify(err));
                resolve(false);
            } else {
                console.log('delete succeeded ', JSON.stringify(data, null, 2));
                resolve(true);
            }
        });
    });
}

// remove memories in this batch, starting at index, until they are all done,
// eventually calling the given callback method
function eraseMemoriesByBatch(batchItemArray, index, callback) {
    let partOfBatchItemArray = batchItemArray.slice(index, index + maxBatchOperations);
    let requestItems = {};
    requestItems[storeTable] = partOfBatchItemArray;
    let params = {
        RequestItems: requestItems
    };
    // console.log('DEBUG: batchWrite at index ' + index + ' with db params = ' + JSON.stringify(params));

    docClient.batchWrite(params, function(err, data) {
        if (err) {
            console.log('ERROR: problem in batchWrite operation = ' + JSON.stringify(err));
            callback(false);
        }
        else {
            // console.log('batchWrite at index ' + index + ' succeeded ', JSON.stringify(data, null, 2));

            if (data.UnprocessedItems && data.UnprocessedItems.length) {
                // TODO: add any data.UnprocessedItems back into the upcoming batches (it's a possible result of throttling)
                console.log('WARNING: need to add code to deal with unprocessed items: ' + JSON.stringify(data));
            }

            if (index + maxBatchOperations >= batchItemArray.length) {
                // we're done with all batches
                callback(true);
            }
            else {
                eraseMemoriesByBatch(batchItemArray, index + maxBatchOperations, callback);
            }
        }
    });
}

// remove memories given in the batchItemArray, using batches, until they are all gone
async function eraseMemoriesByBatchWithPromise(batchItemArray) {
    return new Promise((resolve, reject) => {
        const callback = (callbackResponse) => {
            resolve(callbackResponse);
        };
        eraseMemoriesByBatch(batchItemArray, 0, callback);
    });
}

// remove all memories for a user from the database,
// call the callback when done, return true if successful, false if not successful
async function eraseAllMemories(userId) {
    const items = await loadMemories(userId);
    if (items && items.length > 0) {
        let batchItemArray = [];
        for (let i = 0; i < items.length; i++) {
            let batchItem = {
                DeleteRequest: {
                    Key: {
                        'UserId': userId,
                        'WhenStored': items[i].WhenStored
                    }
                }
            };
            batchItemArray.push(batchItem);
        }
        await eraseMemoriesByBatchWithPromise(batchItemArray);
    }
    return true;
}

// noinspection JSUnresolvedVariable
module.exports = {
    getMyBrainUserId: getMyBrainUserId,
    loadMemories: loadMemories,
    storeMemory: storeMemory,
    eraseOneMemory: eraseOneMemory,
    eraseAllMemories: eraseAllMemories
};
