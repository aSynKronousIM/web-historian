var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.sendRes = function(res, obj, statusCode) {
  statusCode = statusCode || 200;
  res.writeHead(statusCode);
  res.end(obj);
  //res.end(archive.paths.list);
};

exports.collectData = function(req, cb) {
  var data = '';
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    cb(data);
  })
};

exports.sendRedirect = function(res, location, statusCode) {
  statusCode = statusCode || 302;
  res.writeHead(statusCode, {Location: location});
  res.end();
};

exports.send404 = function(res) {
  exports.sendRes(res, "Not Found", 404);
}

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
  fs.readFile(archive.paths.siteAssets + asset, function(err, data) {
    if (err) {
      fs.readFile(archive.paths.archivedSites + asset, function(err, data){
        if (err) {
          callback ? callback() : exports.sendRes(res, 'Not Found', 404);
        } else {
          exports.sendRes(res, data);
        }
      })
    } else {
      exports.sendRes(res, data);
    }
  });
};



// As you progress, keep thinking about what helper functions you can put here!
