/*
 * @charset: 'utf-8'
 * @Author: Yuk
 * @Email:  wuyingyucn@gmail.com
 * @Date:   2016-08-06 21:10:55
 * @Last Modified by:   yingyuk
 * @Last Modified time: 2016-08-11 23:15:30
 * @Description:
 */
'use strict';
module.exports = {
  // 暂时把用户,菜单,权限 放在session上
  processLogin: function (req, res) {
    let _user = req.body.user;
    let name = _user.name;
    let password = _user.password;
    SysUser.findOne({
      name: name,
    }, function (err, user) {
      if (err) {
        return res.redirect('/login');
      }

      if (!user) {
        return res.redirect('/login');
      }
      user.comparePassword(password, function (err, isMatch) {
        if (err) {
          return res.redirect('/login');
        }
        if (isMatch) {
          req.session.user = {
            id: user.id,
            name: user.name,
          };
          user.fetchAbility(function (err, ability) {
            if (err) {
              return res.redirect('/login');
            }
            // 暂时 放到 session上 省的每次去查
            req.session.ability = ability; // 菜单 和权限
            return res.redirect('/');
          });
        } else {
          return res.redirect('/login');
        }
      });
    });
  },
  logout: function (req, res) {
    req.session.user = null;
    // req.logout();
    res.redirect('/login');
  },
};
