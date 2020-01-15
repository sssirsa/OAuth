// AuthHandler.js 

const connectToDatabase = require('../db');
require('dotenv').config({path: './variables.env'});
const User = require('../user/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs-then');

/**
 * Functions Register
 */

 module.exports.register = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    return connectToDatabase()
     .then(() =>
        register(JSON.parse(event.body))
     )
     .then(session => ({
         statusCode: 200,
         body: JSON.stringify(session)
     }))
     .catch(err => ({
         statusCode: err.statusCode || 500,
         headers: { 'Content-Type': 'text/plain'},
         body: err.message
     }));
 };

 /**
  * Functions Login
  */

  module.exports.login = (event, context) => {
      context.callbackWaitsForEmptyEventLoop = false;
      return connectToDatabase()
        .then(() =>
          login(JSON.parse(event.body))
        )
        .then(session =>({
            statusCode: 200,
            body: JSON.stringify(session)
        }))
        .catch(err => ({
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain'},
            body: { stack: err.stack, message: err.message}
        }));
  };

/**
 * Functions Me
 */

module.exports.me = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    return connectToDatabase()
      .then(() =>
        me(event.requestContext.authorizer.principalId) // the decoded.id from the VerifyToken.auth will be passed along as the principalId under the authorizer
      )
      .then(session => ({
        statusCode: 200,
        body: JSON.stringify(session)
      }))
      .catch(err => ({
        statusCode: err.statusCode || 500,
        headers: { 'Content-Type': 'text/plain' },
        body: { stack: err.stack, message: err.message }
      }));
  };

 /**
  * Helpers Register
  */
 
  function signToken(id){
     return jwt.sign({id: id}, 'reallystrongsecret' , {
         expiresIn: 86400 // expires in 24 hours
     });
 }

 function checkIfInputIsValid(eventBody) {
     if(
         !(eventBody.password &&
            eventBody.password.length >= 7)
     ){
         return Promise.reject(new Error('Password error. Password needs to be longer than 8 characters.'));  
     }

     if(
         !(eventBody.username &&
            eventBody.username.length > 5 &&
            typeof eventBody.username === 'string')
     )return Promise.reject(new Error('Username error: Username needs to longer than 5 characters'));
 
     if(
         !(eventBody.email &&
            typeof eventBody.email === 'string')
     ) return Promise.reject(new Error('Email error. Email mmust have valid characters.'));
    
  return Promise.resolve();
}

function register(eventBody) {
    return checkIfInputIsValid(eventBody) //validate input
      .then(() =>
        User.findOne({ email: eventBody.email}) // check if user exists
      )
      .then(user =>
            user 
            ? Promise.reject(new Error('User with that email exists.'))
            : bcrypt.hash(eventBody.password, 8) //hash the pass
        )
        .then(hash =>
            User.create({ username: eventBody.username,
                          email: eventBody.email, 
                          password: hash , 
                          is_active: eventBody.is_active}) 
            // create the new user
          )        
        .then(user => ({ auth: true, token: signToken(user._id)}));
        // sign the token and send it back
}

/**
 * Helpers Login
 */

 function login(eventBody) {
     return User.findOne({email: eventBody.email})
        .then(user =>
              !user
                ? Promise.reject(new Erroor('User with that email does not exists.'))
                : comparePassword(eventBody.password, user.password, user._id)
                )
        .then(token => ({ auth: true, token: token}));
 }

 function comparePassword(eventPassword, userPassword, userId){
     return bcrypt.compare(eventPassword, userPassword)
       .then(passwordIsValid =>
                !passwordIsValid    
                    ? Promise.reject(new Error(' The credentials do not match.'))
                    : signToken(userId)
            );
 }

 /**
  * Helpers Me
  */

 function me(userId) {
     return User.findById(userId, { password:0 })
       .then(user =>
        !user 
          ? Promise.reject('No user found.')
          : user
        )
        .catch(err => Promise.reject(new Error(err)));
 } 