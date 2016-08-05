/**
 * SysUserRole.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  // identity: 'pet_user',
  tableName: 'sys_user_role',
  autoPK: false,
  attributes: {
    member: {
      model: 'sysuser'
    },
    oauth: {
      model: 'role'
    }
  }
}
