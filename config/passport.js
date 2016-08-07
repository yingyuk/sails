/*
* @charset: 'utf-8'
* @Author: Yuk
* @Email:  wuyingyucn@gmail.com
* @Date:   2016-08-07 00:25:40
* @Last Modified by:   yingyuk
* @Last Modified time: 2016-08-07 00:25:55
* @Description:
*/
'use strict';
var passport = require('passport'),
    // 使用本地登录逻辑
    LocalStrategy = require('passport-local').Strategy,
    // 使用bcrypt进行密码加密
    bcrypt = require('bcryptjs');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({ id: id } , function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {

        User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }

            bcrypt.compare(password, user.password, function (err, res) {
                if (!res)
                    return done(null, false, {
                        message: 'Invalid Password'
                    });
                var returnUser = {
                    email: user.email,
                    createdAt: user.createdAt,
                    id: user.id
                };
                return done(null, returnUser, {
                    message: 'Logged In Successfully'
                });
            });
        });
    }
));
