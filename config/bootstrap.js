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

  // Role.findOne(3).exec(function (err, role) {
  //   sails.log(role);
  //   SysPermission.find({}).exec(function (err, pers) {
  //     sails.log(pers);

  //     role.permissions.add(pers);
  //     role.save(function (err) {
  //       Menu.find({}).exec(function (err, menus) {
  //         role.menus.add(menus);
  //         role.save(function (err) {})
  //       })
  //     })
  //   });
  // });

  //   Menu.query(`
  //     INSERT INTO menu (id,name,pid) VALUES (208,'系统管理',NULL),(209,'菜单管理',208),(210,'角色管理',208),(211,'用户管理',208),(212,'物流管理',NULL),(213,'工人管理',212),(214,'商品管理',NULL),(215,'活动管理',214),(216,'商品分类管理',214),(217,'菜场管理',NULL),(218,'服务区域管理',217),(219,'菜市场管理',217),(220,'商品管理',214),(221,'标签管理',NULL),(222,'标签列表管理',221),(223,'会员管理',NULL),(224,'会员列表',223),(225,'热门商品',214),(226,'今日特价',214),(227,'轮播图管理',NULL),(228,'轮播图列表',227),(229,'大厨管理',NULL),(230,'大厨列表',229),(231,'订单管理',NULL),(232,'订单查询',231),(233,'订单打包',231),(234,'商家管理',NULL),(235,'商家列表',234),(236,'菜谱管理',NULL),(237,'菜谱分类',236),(238,'菜谱管理',236),(239,'商品评论管理',231),(240,'大厨评论管理',231),(241,'活动营养知识管理',NULL),(242,'活动营养知识列表',241),(243,'提现列表',234),(244,'退款列表',223),(245,'优惠管理',NULL),(246,'优惠管理列表',245),(247,'团购预售商品',NULL),(248,'团购预售商品列表',247);
  // `,function (err,result) {
  //   console.log(err,result);
  // })

  // SysPermission.query(
  //   `  INSERT INTO syspermission (id,name) VALUES (8,'菜单浏览'),(9,'菜单编辑'),(10,'菜单删除'),(11,'角色浏览'),(12,'角色编辑'),(13,'角色删除'); `,function (err,result) {
  //     console.log(err,result);
  //   })

  // Role.findOrCreate({
  //   name: '管理员组',
  // }).exec(function (err, role) {
  //   Menu.find({}).exec(function (err, menus) {
  //     role.menus.add(menus);
  //     role.save(console.log);
  //   });
  // });

  // Role.findOrCreate({
  //   name: '管理员组',
  // }).exec(function (err, role) {
  //   SysPermission.find({}).exec(function (err, permissions) {
  //     role.permissions.add(permissions);
  //     role.save(console.log);
  //   });
  // });

  // SysUser.findOrCreate({
  //   name: 'admin',
  //   password: '123456',
  // }).exec(function (err, user) {
  //   console.log(err, user);
  // })

  // SysUser.findOne({
  //   name: 'admin',
  // }).then(function (user) {
  //   Role.findOne({
  //     name: '管理员组'
  //   }).then(function (role) {
  //     user.role.add(role.id);
  //     user.save(console.log);
  //   });
  // })

  cb();
};
