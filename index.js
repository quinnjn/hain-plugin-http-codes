'use strict';

// Taken from : https://raw.githubusercontent.com/for-GET/know-your-http-well/master/json/status-codes.json
const statusCodes = require('./status-codes');

// Default query is xx, This brings up the status code classes (i.e. 1xx Informational, 2xx Successful, etc)
const defaultQuery = "xx";

function deepContains(obj, needle) {
  return contains(obj.code, needle) ||
    contains(obj.phrase, needle) ||
    contains(obj.description, needle);
}

function contains(haystack, needle) {
  return haystack.toLowerCase().indexOf(needle.toLowerCase()) > -1;
}


module.exports = (pluginContext) => {
  const app = pluginContext.app;
  const shell = pluginContext.shell;

  function search(query, res) {
    query = query.trim();
    if (query.length === 0) {
      query = defaultQuery;
    }

    statusCodes.filter(function (code) {
      return deepContains(code, query);
    }).forEach(function (code) {
      res.add({
        id: code.code,
        title: `<b>${code.code}</b> - ${code.phrase}`,
        desc: code.description,
        payload: code.spec_href
      });
    });
  }

  function execute(id, payload) {
    shell.openExternal(payload);
    app.close();
  }
  return { search, execute };
};
