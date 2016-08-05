/**
 * Role.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: 'integer',
      unique: true,
      primaryKey: true,
    },
    name: {
      type: 'string'
    },
    color: {
      type: 'string'
    },
    oauth: {
      collection: 'sysuser',
      via: 'oauth',
      through: 'sysuserrole'
    },
  }
}
