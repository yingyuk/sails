/*
 * @charset: 'utf-8'
 * @Author: yingyuk
 * @Email:  wuyingyucn@gmail.com
 * @Date:   2016-08-05 17:43:16
 * @Last Modified by:   yingyuk
 * @Last Modified time: 2016-08-11 23:52:35
 * @Description:
 */
'use strict';
/**
 * RoleController
 *
 * @description :: Server-side logic for managing Roles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var utility = require('../services/utility');

module.exports = {
  // 列表展示
  roleList: function (req, res) {
    let session = req.session;
    let id = session.user.id;
    let ability = session.ability;
    if (ability.permissions.every(function (item) {
        return item.name === '角色浏览' ? false : true;
      })) {
      return res.redirect('back');
    }

    if (ability.superManager) {
      // 超级管理员 查看 所有的角色
      Role.find({
        select: ['id', 'name'],
      }).then(function (roles) {
        let result = {
          roles: roles,
          user: session.user,
          menus: session.ability.menus,
          permissions: session.ability.permissions,
        };
        res.view('sys/roleList', result);
      }).catch(function (err) {
        return res.serverError('发生错误' + err);
      });
    } else {
      // 我创建的组
      Role.find({
        id: id,
        select: ['id', 'name'],
        where: {
          createUid: id,
        },
      }).then(function (roles) {
        let result = {
          roles: roles,
          user: session.user,
          menus: session.ability.menus,
          permissions: session.ability.permissions,
        };
        res.view('sys/roleList', result);
      });
    }
  },
  createRoleView: function (req, res) {
    let userId = req.session.user.id;
    if (userId) {
      SysUser.findOne({
          id: userId,
          select: ['id'],
        })
        .then(function (user) {
          user.validatePermission('角色浏览', function (err, status) {
            if (status) {
              user.fetchRole(function (err, roleArr) {
                return res.json(roleArr);
              });
            }
          });
        });
    }
  },
  createRole: function (req, res) {
    let body = req.body;
    let ability = req.session.ability;
    let createUid = req.session.user.id;
    let subMenus = body.menus;
    let subPermissions = body.permissions;
    let name = body.name;
    if (ability.permissions.map(function (item) {
        if (item.name === '角色编辑') {
          return true;
        }
      }).every(false)) {
      return res.forbidden('没有权限');
    }

    Role.create({
        createUid: createUid,
        name: name,
      })
      .then(function (role) {
        if (!!subMenus) {
          role.menus.add(subMenus);
        }
        if (!!subPermissions) {
          role.permissions.add(subPermissions);
        }
        role.save(function (err) {
          if (err) {
            return res.serverError('保存时 发生错误' + err);
          }

          res.redirect('/');
        });
      }).catch(function (err) {
        return res.serverError('创建时 发生错误' + err);
      });
  },
  roleDetail: function (req, res) {
    let id = req.param('id');
    let session = req.session;
    Role.findOne({
      id: id,
      select: ['id', 'name'],
    }).populate(['user', 'menus', 'permissions']).then(function (role) {
      let roles = {};
      roles.name = role.name;
      roles.user = role.user.map(function (item) {
        return item.id ? item : undefined;
      });
      roles.menus = role.menus.map(function (item) {
        return item.id ? item : undefined;
      });
      roles.permissions = role.permissions.map(function (item) {
        return item.id ? item : undefined;
      });
      let result = {
        role: roles,
        user: session.user,
        menus: session.ability.menus,
        permissions: session.ability.permissions,
      };
      res.view('sys/roleDetail', result);
    });
  },
  roleUpdate: function (req, res) {
    let body = req.body;
    let session = req.session;
    let id = body.id;
    let name = body.name;
    let users = body.userId;
    Role.findOne({
      id: id,
    }, {
      name: name,
    }).then(function (role) {
      role.user.remove([users]);
      role.save(function (err) {
        if (err) {
          return res.serverError('更新出错' + err);
        }

        let result = {
          role: role,
          user: session.user,
          menus: session.ability.menus,
          permissions: session.ability.permissions,
        };
        return res.view('sys/roleDetail', result);
      });
    });

  },
  DelRole: function (req, res) {
    let body = req.body;
    let id = body.id;
    let ability = req.session.ability;
    if (ability.permissions.map(function (item) {
        if (item.name === '角色删除') {
          return true;
        }
      }).every(false)) {
      return res.forbidden('没有权限');
    }

    Role.findOne({
        id: id,
        select: ['id'],
      })
      .populate(['roles', 'permissions'])
      .then(function (role) {
        let subMenus = role.menus || [];
        let subPermissions = role.permissions || [];
        subMenus.forEach(function (item) {
          role.menus.remove(item.id);
        });
        subPermissions.forEach(function (item) {
          role.permissions.remove(item.id);
        });

        role.save(function (err) {
          if (err) {
            return res.serverError('删除 发生错误' + err);
          }

          res.redirect('/roleList');
        });
      }).catch(function (err) {
        return res.serverError('删除 发生错误' + err);
      });
  }
};
