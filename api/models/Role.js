/**
 * Role.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  id: {
    type: 'integer',
    unique: true,
    primaryKey: true,
  },
  attributes: {
    name: {
      type: 'string',
    },
    member: {
      collection: 'SysUser',
      via: 'oauth',
      dominant: true,
    },
    permissions: {
      collection: 'SysPermission',
      via: 'owners',
      dominant: true,
    },
  },
};
