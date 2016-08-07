/*
 * @charset: 'utf-8'
 * @Author: Yuk
 * @Email:  wuyingyucn@gmail.com
 * @Date:   2016-08-06 21:10:55
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-08-07 11:12:25
 * @Description:
 */
'use strict';
let passport = require('passport');
module.exports = {
  processLogin: function (req, res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;
    SysUser.findOne({
      name: _user.name
    }, function (err, user) {
      if (err) {
        sails.log(err);
      }

      if (!user) {
        return res.redirect('/login');
      }
      user.comparePassword(password, function (err, isMatch) {
        if (err) {
          sails.log(err);
        }
        sails.log('isMatch',isMatch);
        if (isMatch) {
          req.session.user = user;
          sails.log('写入session',req.session.user);
          return res.redirect('/');
        } else {
          return res.redirect('/login');
        }

      });
    })
  },
  logout: function (req, res) {
    req.session.user = null;
    // req.logout();
    res.redirect('/login');
  },
};
