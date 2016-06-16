"use strict";
var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');
var parser = new xml2js.Parser({
    explicitArray: false,
    mergeAttrs: true
});
var debug = require('debug')('iisconfig2json');
var iisconfig2json = function (options) {
    if (options === void 0) { options = {}; }
    var json = {};
    var output = '';
    if (!options.inputFile) {
        debug('iisconfig2json: No options');
        return json;
    }
    json = getJSON(options);
    if (!json) {
        debug('iisconfig2json: No json');
        return {};
    }
    if (Object.keys(json).length < 1 || options.defaultJSON) {
        debug('iisconfig2json: Object.keys(json).length < 1 || options.defaultJSON');
        return json;
    }
    if (json && json.configuration) {
        json.configuration.appSettings = getAppSettings(json);
    }
    if (options.outputFile) {
        output = path.resolve(options.outputFile);
        fs.writeFile(output, JSON.stringify(json), function (err) {
            if (err) {
                debug('iisconfig2json: %s', err);
            }
        });
    }
    return json;
};
var getJSON = function (options) {
    var input = path.resolve(options.inputFile || '');
    var json = {};
    debug('getJSON: Reading %s', input);
    try {
        var data = fs.readFileSync(input);
        debug('getJSON: Got data %s', data);
        parser.parseString(data.toString(), function (err, result) {
            if (err) {
                debug('getJSON: %s', err);
            }
            json = result;
        });
        return json;
    }
    catch (e) {
        debug('getJSON: %s', e);
        return {};
    }
};
var getAppSettings = function (data) {
    var appSettings = {};
    var arr;
    debug('getAppSettings data: %s', JSON.stringify(data));
    if (data && data.configuration && data.configuration.appSettings && data.configuration.appSettings.add) {
        arr = data.configuration.appSettings.add;
        debug('getAppSettings arr: %s', JSON.stringify(data));
    }
    else {
        return appSettings;
    }
    arr.forEach(function (element) {
        if (element.key && element.value) {
            appSettings[element.key] = element.value;
        }
    });
    return appSettings;
};
module.exports = iisconfig2json;
