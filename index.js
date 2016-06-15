var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');
var parser = new xml2js.Parser({
    explicitArray: false,
    mergeAttrs: true
});
var debug = require('debug')('iisconfig2json');


iisconfig2json.prototype.getJSON = function(options) {
    var input = path.resolve(options.inputFile);
    var json = {};
    var data = '';
    
    debug('getJSON: Reading %s', input);
    
    try {
        data = fs.readFileSync(input);
        debug('getJSON: Got data %s', data);
        parser.parseString(data, function(err, result) {
            if (err) {
                debug('getJSON: %s', err);
                return {};
            }
            json = result;
        });

        return json;
    } catch (e) {
        debug('getJSON: %s', e);
        return {};
    }
};

iisconfig2json.prototype.getAppSettings = function(data) {
    var appSettings = {};
    var arr = [];

    debug('getAppSettings data: %s', data);

    if (data && data.configuration && data.configuration.appSettings && data.configuration.appSettings.add) {
        arr = data.configuration.appSettings.add;
    } else {
        return appSettings;
    }

    arr.forEach(function(element, index, arr) {
        if(element.key && element.value) {
            appSettings[element.key] = element.value;
        }
    });

    return appSettings;
};

function iisconfig2json (options) {
    var json = {};
    var output;

    if (!(this instanceof iisconfig2json)) {
        return new iisconfig2json(options);
    }

    if (!options) {
        debug('iisconfig2json: No options');
        return json;
    }

    json = this.getJSON(options);

    if (!json) {
        debug('iisconfig2json: No json');
        return {};
    }

    if (Object.keys(json).length < 1 || options.defaultJSON) {
        debug('iisconfig2json: Object.keys(json).length < 1 || options.defaultJSON');
        return json;
    }


    if (json && json.configuration) {
        json.configuration["appSettings"] = this.getAppSettings(json);
    }

    if (options.outputFile) {
        output = path.resolve(options.outputFile);
        fs.writeFile(output, JSON.stringify(json), function(err) {
            if (err) {
                debug('iisconfig2json: %s', err);
            }
        });
    }

    return json;
}

exports = module.exports = iisconfig2json;