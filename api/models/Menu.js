/**
 * Menu.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string'
    },
    url: {
      type: 'string',
    },
    pid: {
      type: 'interger',
      model: 'menu',
      via: 'id',
    },
    owners: {
      collection: 'role',
      via: 'menus',
      // dominant: true,
      // through: 'PetUser'
    },
  }
};
