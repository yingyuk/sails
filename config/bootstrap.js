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
    id: 10,
    name: 'pnk',
  }).exec(function (err, pet) {
    console.log(err, pet);
    User.create({
      id: 10,
      name: 'mike',
    }).exec(function (err, user) {
      console.log(err, user)
      user.pets.add([10]);
      user.save();
    });
  });
  cb();
};
