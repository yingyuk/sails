/**
 * Pet.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    breed: 'string',
    type: 'string',
    name: 'string',

    // Add a reference to User
    owners: {
      collection: 'user',
      via: 'pets'
    }
  }
};
