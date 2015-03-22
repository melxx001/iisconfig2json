var 
	fs = require('fs'),
	path = require('path'),
	xml2js = require('xml2js'),
	parser = new xml2js.Parser({
        explicitArray: false,
        mergeAttrs: true
    })
;


iisconfig2json.prototype.getJSON = function(options){
    var
        _this = this,
        input = path.resolve(options.inputFile),
        json = {},
        data = ""
    ;

    data = fs.readFileSync(input);
    parser.parseString(data , function (err, result) {
        if(err){
            throw new Error(err);
        }

        json = result;
    });

    return json;
}

iisconfig2json.prototype.getAppSettings= function(data){
    var appSettings = {}, arr = [];

    if(data && data.configuration && data.configuration.appSettings && data.configuration.appSettings.add){
        arr = data.configuration.appSettings.add;
    }else{
        return appSettings;
    }

    arr.forEach(function(element, index, arr) {
        if(element.key && element.value) {
            appSettings[element.key] = element.value;
        }
    });

    return appSettings;
}

iisconfig2json.prototype.getConfigSections= function(data) {
    if (data && data.configuration && data.configuration.configSections) {
        return data.configuration.configSections;
    }

    return {};
}

iisconfig2json.prototype.getConnectionStrings= function(data) {
    if (data && data.configuration && data.configuration.connectionStrings) {
        return data.configuration.connectionStrings;
    }

    return {};
}

iisconfig2json.prototype.getLocation= function(data) {
    if (data && data.configuration && data.configuration.location) {
        return data.configuration.location;
    }

    return {};
}

iisconfig2json.prototype.getElements= function(data, element) {
    if (data && data.configuration && data.configuration[element]) {
        return data.configuration[element];
    }

    return {};
}


function iisconfig2json (options) {
    var
        json = {},
        config = {},
        output,
        nodes
    ;

    if (!(this instanceof iisconfig2json)){
        return new iisconfig2json(options);
    }

    if (!options){
        options = {};
        return;
    }

    json = this.getJSON(options);
    if(options.fullJSON) {
        return json;
    }

    if (json && json.configuration) {
        config["appSettings"] = this.getAppSettings(json);
        config["configSections"] = this.getConfigSections(json);
        config["connectionStrings"] = this.getConnectionStrings(json);
        config["location"] = this.getLocation(json);
        config["system.web.extensions"] = this.getElements(json, "system.web.extensions");
        config["system.web"] = this.getElements(json, "system.web");
        config["system.webServer"] = this.getElements(json, "system.webServer");
    }else if(json && Object.keys(json).length !== 0){
        config = json;
    }else{
        return;
    }

    if(options.outputFile){
        output = path.resolve(options.outputFile);
        fs.writeFile(output, JSON.stringify(config), function (err) {
            if (err){
                throw new Error(err);
            }
        });
    }

    return config;
}

exports = module.exports = iisconfig2json;