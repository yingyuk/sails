/*
 * @charset: 'utf-8'
 * @Author: Yuk
 * @Email:  wuyingyucn@gmail.com
 * @Date:   2016-08-10 22:15:51
 * @Last Modified by:   yingyuk
 * @Last Modified time: 2016-08-10 22:19:40
 * @Description:
 */
'use strict';

module.exports = {
  // 有很多 局限性 读取的是id属性
  groupBy: function (name, obj) {
    let cache = {};
    let resultArr = [];
    if (obj) {
      for (let i in obj) {
        if (obj[i][name]) {
          for (let j in obj[i][name]) {
            let id = obj[i][name][j].id;
            if (!!id && !cache[id]) {
              cache[id] = true;
              resultArr.push(obj[i][name][j]);
            }
          }
        }
      }
    }

    return resultArr;
  },
};
