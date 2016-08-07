/*
 * @charset: 'utf-8'
 * @Author: Yuk
 * @Email:  wuyingyucn@gmail.com
 * @Date:   2016-08-05 17:43:15
 * @Last Modified by:   yingyuk
 * @Last Modified time: 2016-08-07 15:10:52
 * @Description:
 */
'use strict';
/**
 * Role.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    name: {
      type: 'string',
      unique: true,
      required: true,
    },
    user: {
      collection: 'sysuser',
      via: 'role',
      // through: 'sysuserrole',
      dominant: true,
    },
    permissions: {
      collection: 'syspermission',
      via: 'owners',
      dominant: true,
    },
    menus: {
      collection: 'menu',
      via: 'owners',
      dominant: true,
    },
    createUid: {
      type: 'integer',
    },
    fetchMenus: function (cb) {
      Role.findOne({
          id: this.id,
        })
        .populate('menus')
        .exec(function (err, role) {
          cb(err, role.menus);
        });
    },
    fetchPermissons: function (cb) {
      Role.findOne({
          id: this.id,
        })
        .populate('permissions')
        .exec(function (err, role) {
          cb(err, role.permissions);
        });
    },
  },
  beforeCreate: function (values, cb) {
    let createUid = values.createUid;
    let subMenus = values.menus;
    let subPermissions = values.permissions;
    sails.log('创建Role',values, createUid, subMenus, subPermissions);

    SysUser.findOne({
      id: createUid,
    }).exec(function (err, user) {
      if (err) {
        cb(err);
      }

      user.fetchRole(function (err, role) {
        let roleId = role[0].id;
        Role.findOne({
          id: roleId,
        }).exec(function (err, role) {
          if (err) {
            cb(err);
          }

          role.fetchMenus(function (err, menus) {
            role.fetchPermissons(function (err, permissions) {
              if (err) {
                cb(err);
              }

              for (let i in subMenus) {
                while (menus.indexOf(subMenus[i]) < 0) {
                  return cb('不能分配该菜单');
                }
              }

              for (let i in subPermissions) {
                while (permissions.indexOf(subPermissions[i]) < 0) {
                  return cb('不能分配该权限');
                }
              }
              cb();
            });
          });
        });

      })

    })
  },
};
