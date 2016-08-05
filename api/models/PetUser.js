/**
 * PetUser.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  // identity: 'pet_user',
  // tableName: 'pet_user',
  autoPK: false,
  attributes: {
    // autoPK: false,
    // autoCreatedAt: false,
    // autoUpdatedAt: false,
    // id: {
    //   type: 'integer',
    //   unique: true,
    //   primaryKey: true,
    // },
    owner: {
      model: 'user'
    },
    pet: {
      model: 'pet'
    }
  }
}
