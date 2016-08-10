/*
 * @charset: 'utf-8'
 * @Author: Yuk
 * @Email:  wuyingyucn@gmail.com
 * @Date:   2016-08-02 23:34:13
 * @Last Modified by:   yingyuk
 * @Last Modified time: 2016-08-10 17:48:08
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
              permissions = groupBy('permissions', permissions);
              sails.log('拥有的权限', permissions);
              for (let i in permissions) {
                if (permissions[i].name === permission) {
                  sails.log('permissions[i].name === permission', permissions[i].name === permission);
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
    // 菜单展示
    fetchMenu: function (cb) {
      this.validatePermission('菜单浏览', function (err, status) {
        if (err) {
          cb(err);
        }
        sails.log('权限', status);
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
          }).populate(['menus']).exec(function (err, role) {
            if (err) {
              return cb(err);
            }
            sails.log('权限', groupBy('menus', role));
            return cb(null, groupBy('menus', role));
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
};

function groupBy(name, obj) {
  'use strict';
  let cache = {};
  let resultArr = [];
  for (let i in obj) {
    for (let j in obj[i][name]) {
      let id = (obj[i][name][j].id);
      if (!!id && !cache[id]) {
        cache[id] = true;
        resultArr.push((obj[i][name][j]));
      }
    }
  }
  return resultArr;
}
