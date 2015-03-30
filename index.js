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

function iisconfig2json (options) {
    var
        json = {},
        output
    ;

    if (!(this instanceof iisconfig2json)){
        return new iisconfig2json(options);
    }

    if (!options){
        return json;
    }

    json = this.getJSON(options);

    if(Object.keys(json).length < 1 || options.defaultJSON){
        return json;
    }


    if (json && json.configuration) {
        json.configuration["appSettings"] = this.getAppSettings(json);
    }

    if(options.outputFile){
        output = path.resolve(options.outputFile);
        fs.writeFile(output, JSON.stringify(json), function (err) {
            if (err){
                throw new Error(err);
            }
        });
    }

    return json;
}

exports = module.exports = iisconfig2json;