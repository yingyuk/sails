/*
 * @charset: 'utf-8'
 * @Author: Yuk
 * @Email:  wuyingyucn@gmail.com
 * @Date:   2016-08-02 23:34:13
 * @Last Modified by:   yingyuk
 * @Last Modified time: 2016-08-07 15:58:11
 * @Description:
 */
'use strict';
/**
 * SysUser.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require('bcryptjs');
module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true,
      unique: true,
    },
    password: {
      type: 'string',
      minLength: 6,
      required: true,
    },
    role: {
      collection: 'role',
      via: 'user',
      // through: 'sysuserrole'
    },
    session: {
      type: 'string',
    },
    createUid: {
      type: 'integer',
    },
    oauth: function (roleName, cb) {
      Role.findOrCreate({
        name: roleName,
      }).exec(function (err, role) {
        if (err) {
          return cb(err);
        }

        role.user.add(this.id);
        role.save(cb);
      });
    },
    comparePassword: function (_password, cb) {
      bcrypt.compare(_password, this.password, function (err, isMatch) {
        if (err) {
          return cb(err);
        }
        return cb(null, isMatch);
      })
    },
    fetchRole: function (cb) {
      SysUser.findOne({
          id: this.id,
        }).populate('role')
        .exec(function (err, user) {
          sails.log('populate', err, user);
          return cb(err, user.role);
        });
    },
    // 获取权限
    fetchOauth: function (cb) {
      let data = {
        name: null,
        menus: null,
        permissions: null,
      };
      SysUser.findOne({
          id: this.id,
        })
        .populate('role')
        .exec(function (err, user) {
          if (err) {
            return cb(err);
          }

          data.user = user;
          let roleId = user.role[0].id;
          if (!roleId) {
            return cb();
          }

          Role.findOne({
              id: roleId,
            })
            .populate(['menus', 'permissions'])
            .exec(function (err, role) {
              if (err) {
                return cb(err);
              }

              data.menus = role.menus;
              data.permissions = role.permissions;
              sails.log('查询结果', data);
              cb(null, data);
            });
        });
    },
  },

  beforeCreate: function (values, cb) {
    let password = values.password;
    if (password.length < 6) {
      return cb('密码需大于6位');
    }
    bcrypt.hash(values.password, 10, function (err, hash) {
      if (err) {
        return cb(err);
      }

      values.password = hash;
      cb();
    });
  },
}
