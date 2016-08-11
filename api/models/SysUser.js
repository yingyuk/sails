/*
 * @charset: 'utf-8'
 * @Author: Yuk
 * @Email:  wuyingyucn@gmail.com
 * @Date:   2016-08-02 23:34:13
 * @Last Modified by:   yingyuk
 * @Last Modified time: 2016-08-11 22:57:45
 * @Description:
 */
'use strict';
/**
 * SysUser.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 */
var bcrypt = require('bcryptjs');
let utility = require('../services/utility');
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
    // 验证是否有这项权限
    // 例如是否有菜单浏览权利;
    validatePermission: function (permission, cb) {
      SysUser.findOne({
          id: this.id,
          select: ['id'],
        })
        .populate('role')
        .exec(function (err, user) {
          if (err) {
            cb(err);
          }
          var roles = user.role.map(function (item) {
            return item.id;
          });
          Role.find({
              id: roles,
              select: ['id'],
            })
            .populate('permissions')
            .exec(function (err, permissions) {
              if (err) {
                cb(err);
              }
              permissions = utility.groupBy('permissions', permissions);
              for (let i in permissions) {
                if (permissions[i].name === permission) {
                  return cb(null, true);
                }
              }
              return cb(null, false);
            });
        });
    },
    // 添加角色
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
    // 菜单,权限 获取;
    fetchAbility: function (cb) {
      this.validatePermission('菜单浏览', function (err, status) {
        if (err) {
          cb(err);
        }
        if (!status) {
          return [];
        }
        SysUser.findOne({
          id: 1,
          select: ['id'],
        }).populate('role').then(function (user) {
          var roleIds = user.role.map(function (item) {
            if (item.id) {
              return item.id;
            }
          });
          Role.find({
            id: roleIds,
          }).populate(['menus', 'permissions']).exec(function (err, role) {
            if (err) {
              return cb(err);
            }
            let menus = utility.groupBy('menus', role);
            let superManager = false;
            if (role.some(function (item) {
                return item.name === '超级管理员' ? true : false;
              })) {
              superManager = true;
            }
            let data = {
              superManager: superManager,
              menus: menus,
              permissions: utility.groupBy('permissions', role),
            };
            return cb(null, data);
          });
        }).catch(function (err) {
          return cb(err);
        });
      });
    },
    // 验证密码
    comparePassword: function (_password, cb) {
      bcrypt.compare(_password, this.password, function (err, isMatch) {
        if (err) {
          return cb(err);
        }
        return cb(null, isMatch);
      });
    },
    fetchRole: function (cb) {
      SysUser.findOne({
          id: this.id,
          select: ['id'],
        }).populate('role')
        .exec(function (err, user) {
          return cb(utility.groupBy('role', user));
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
};
