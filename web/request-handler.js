var path = require('path');
var archive = require('../helpers/archive-helpers');
var utils = require('./http-helpers');
var urlParser = require('url');
// require more modules/folders here!

var actions = {
  'GET': function(req, res) {
    var parts = urlParser.parse(req.url);
    var url = parts.pathname === '/' ? '/index.html' : parts.pathname;
    utils.serveAssets(res, url);
  },
  'POST': function(req, res) {
    utils.collectData(req, function(data) {
      var siteName = data.split('=')[1];

      archive.isUrlInList(siteName, function(found){

        if (found) {
          archive.isURLArchived(siteName, function(archived) {

            if (archived) {
              utils.serveAssets(res, '/' + siteName);
            } else {
              utils.sendRedirect(res, '/loading.html');
            }

          })

        } else {
          utils.sendRedirect(res, '/loading.html');
          archive.addUrlToList(data);
        }
      });
    });
  }
};

exports.handleRequest = function (req, res) {
  console.log("Serving request type " + req.method + " for url " + req.url);

  var action = actions[req.method];

  if (action) {
    action(req, res);
  } else {
    utils.sendRes(res, 'Not found', 404);
  }
};

