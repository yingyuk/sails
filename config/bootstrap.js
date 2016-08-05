/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  Pet.create({
      id: 1,
      name: 'pnk',
    })
    .then(function (pet) {
      User.create({
          id: 1,
          name: 'Yuk',
        })
        .exec(function (err, user) {
          console.log(user);
          pet.owners.add(1);
          console.log(pet);
          pet.save(function () {
            Pet.find({
              name: 'pnk',
            }).populate('owners').exec(console.log)

          });
        });
    })
    .then(
      function () {
        User.findOne(1).exec(function (err, result) {
          console.log('=============');
          console.log(err, result);
        });
      });

  Role.create({
    id: 1,
    name: '管理员组',
  }).exec(function (err, pet) {
    SysUser.create({
      id: 1,
      name: 'mike',
    }).exec(function (err, user) {
      user.oauth.add(1);
      user.save(function (err, result) {
        SysUser.find({
          name: 'mike'
        }).populate('oauth').exec(function (err, res) {
          console.log(err, res);
        });
      });
    });

    SysPermission.create({
      id: 1,
      name: '读写权限',
    }).exec(function (err, permissions) {
      permissions.owners.add(1);
      permissions.save(console.log);
    });
  });

  cb();
};
