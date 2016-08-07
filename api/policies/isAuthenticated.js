/*
 * @charset: 'utf-8'
 * @Author: Yuk
 * @Email:  wuyingyucn@gmail.com
 * @Date:   2016-08-07 00:06:51
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-08-07 11:07:40
 * @Description:
 */
'use strict';
module.exports = function (req, res, next) {
  sails.log('是否登录', req.session.user);
  if (req.session.user) {
    return next();
  } else {
    return res.redirect('/login');
  }
};
