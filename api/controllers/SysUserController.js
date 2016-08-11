/*
 * @charset: 'utf-8'
 * @Author: yingyuk
 * @Email:  wuyingyucn@gmail.com
 * @Date:   2016-08-04 23:42:12
 * @Last Modified by:   yingyuk
 * @Last Modified time: 2016-08-11 17:58:19
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
        menus: [],
        permissions: [],
      };
      SysUser.findOne({
          id: userId,
          select: ['id'],
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
            user.fetchOauth(function (err, result) {
              if (err) {
                return res.negotiate(err);
              }

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
              res.view('create/sysuser', data);
            });
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
      });
    });
  },
  // 侧边栏
  sideBar: function (req, res) {
    let session = req.session;
    let userId = session.user.id;
    sails.log('userId', userId);
    if (userId) {
      let data = {
        title: '首页',
        user: session.user,
        menus: session.ability.menus,
        permissions: session.ability.permissions,
      };
      sails.log(data);
      return res.view('homepage', data);
    } else {
      res.redirect('/login');
    }
  },
};
