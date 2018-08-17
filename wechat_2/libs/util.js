var Fs = require('fs');
var Promise = require('bluebird');

exports.readFileAsync = function (fpath,encodinig) {
  return new Promise(function (resolve,reject) {
    Fs.readFile(fpath,encodinig,function (err,content) {
      if (err) {
        reject(err)
      }else {
        resolve(content)
      }
    });
  })
}

exports.writeFileAsync = function (fpath,content) {
  return new Promise(function (resolve,reject) {
    Fs.writeFile(fpath,content,function (err) {
      if (err) {
        reject(err)
      }else {
        resolve()
      }
    });
  })
}
