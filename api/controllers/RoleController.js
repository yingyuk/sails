/*
 * @charset: 'utf-8'
 * @Author: yingyuk
 * @Email:  wuyingyucn@gmail.com
 * @Date:   2016-08-05 17:43:16
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-08-07 15:21:28
 * @Description:
 */
'use strict';
/**
 * RoleController
 *
 * @description :: Server-side logic for managing Roles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  createRoleView: function (req, res) {
    let userId = req.session.user.id;
    if (userId) {
      SysUser.findOne({
        id: userId,
      }).exec(function (err, user) {
        if (err) {
          return res.negotiate(err);
        }

        user.fetchOauth(function (err, result) {
          if (err) {
            return res.negotiate(err);
          }

          let data = {
            user: result.user,
            menus: [],
            permissions: [],
          };
          data.menus = result.menus.map(function (item) {
            if (item.name) {
              return item;
            }
          });
          data.permissions = result.permissions.map(function (item) {
            if (item.name) {
              return item;
            }
          });
          sails.log(data);
          res.view('create/role', data);
        });
      });
    }
  },
  createRole: function (req, res) {
    let body = req.body;
    let createUid = parseInt(body.createUid);
    let subMenus = body.menus;
    let subPermissions = body.permissions;
    let name = body.name;
    sails.log(body);
    if (!createUid) {
      sails.log('who are you')
      return res.negotiate('who are you');
    }
    Role.create({
        createUid: createUid,
        name: name
      })
      .exec(function (err, role) {
        if (err) {
          sails.log('创建错误')
          return res.negotiate(err);
        }
        if (!!subMenus) {
          role.menus.add(subMenus);
        }
        if (!!subPermissions) {
          role.permissions.add(subPermissions);
        }
        role.save(function (err, result) {
          if (err) {
            return res.negotiate('who are you');
          }

          sails.log('创建成功')
          res.redirect('/');
        });
      });
  }
};
