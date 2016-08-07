/*
 * @charset: 'utf-8'
 * @Author: yingyuk
 * @Email:  wuyingyucn@gmail.com
 * @Date:   2016-08-04 23:42:12
 * @Last Modified by:   yingyuk
 * @Last Modified time: 2016-08-07 16:07:16
 * @Description:
 */
'use strict';
/**
 * SysUserController
 *
 * @description :: Server-side logic for managing sysusers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  createUserView: function (req, res) {
    let userId = req.session.user.id;
    if (userId) {
      let data = {
        user: req.session.user,
        roles: [],
      };
      SysUser.findOne({
          id: userId,
        })
        .populate('role')
        .exec(function (err, user) {
          if (err) {
            return res.negotiate(err);
          }
          sails.log(user);
          let role = user.role[0];
          let condition = {};
          sails.log(role.name);
          if (role.name !== '超级管理员') {
            condition.createUid = parseInt(userId);
          }

          Role.find(condition).exec(function (err, roles) {
            data.roles = roles;
            sails.log(data);
            res.view('create/sysuser', data);
          });

        });
    } else {
      res.redirect('/login');
    }
  },
  createUser: function (req, res) {
    let body = req.body;
    let name = body.name;
    let password = body.password;
    let role = body.role;
    sails.log('创建用户', body);
    SysUser.create({
      name: name,
      password: password,
    }).exec(function (err, user) {
      if (err) {
        sails.log('创建出错', err);
        return res.negotiate(err);
      }
      user.role.add(role);
      user.save(function (err) {
        if (err) {
          sails.log('添加分组出错', err);
          return res.negotiate(err);
        }
        return res.redirect('/');
      })
    });
  },
  sideBar: function (req, res) {
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
            name: result.user.name,
            menus: [],
            permissions: [],
          };
          data.menus = result.menus.map(function (item) {
            return item.name;
          });
          data.permissions = result.permissions.map(function (item) {
            return item.name;
          });
          res.view('homepage', data);
        });
      });
    } else {
      res.redirect('/login');
    }
  }
};
