'use strict';

const connectToDatabase = require('./db');
const Person = require('./Person');
require('dotenv').config({path: './variables.env'});

module.exports.create = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() =>{
      Person.create(JSON.parse(event.body))
        .then(person => callback(null,{
          statusCode: 200,
          body: JSON.stringify(person)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          heders: {'Content-Type' : 'text/plain'},
          body: 'Could not create the Person'
        }));
    });
};


module.exports.getOne = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Person.findById(event.pathParameters.id)
        .then(person => callback(null,{
          statusCode: 200,
          body: JSON.stringify(person)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {'Content-Type': 'text/plain'},
          body: 'Could not fetch the Person.'
        }));
    });
};

module.exports.getAll = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Person.find()
        .then(person => callback(null, {
          statusCode: 200,
          body: JSON.stringify(person)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the Person.'
        }))
    });
};

module.exports.update = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Person.findByIdAndUpdate(event.pathParameters.id, JSON.parse(event.body), { new: true })
        .then(person => callback(null, {
          statusCode: 200,
          body: JSON.stringify(person)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the Person.'
        }));
    });
};

module.exports.delete = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Person.findByIdAndRemove(event.pathParameters.id)
        .then(person => callback(null, {
          statusCode: 200,
          body: JSON.stringify({ message: 'Removed Person with id: ' + person._id, person: person })
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the Person.'
        }));
      });
    };