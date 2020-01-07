// UserHandler.js

const connectToDatabase = require('../db');
const User = require('./User');

/**
* Functions
*/

module.exports.getUsers = (evet, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    return connectToDatabase()
     .then(this.getUsers)
     .then(users => ({
         statusCode: 200,
         bosy: JSON.stringify(users)
     }))
     .catch(err => ({
         statusCode: err.statusCode || 500,
         headers: {'Content-Type': 'text/plain'},
         body: JSON.stringify({ message: err.message})
     }))
};

/**
 * Helpers
 */

function getUsers(){
    return User.find({})
        .then(user => users)
        .catch(err => Promise.reject(new Error(err)));
    
}