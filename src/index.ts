import * as fs from 'fs';
import * as path from'path';
import * as xml2js from 'xml2js';
import {Parser} from 'xml2js';

const parser: Parser = new xml2js.Parser({
    explicitArray: false,
    mergeAttrs: true
});
const debug : Function = require('debug')('iisconfig2json');

interface Options extends Object {
  inputFile?: string;
  outputFile?: string;
  defaultJSON?: boolean;
}

interface Configuration extends Object {
  configuration?: AppSettings;
}

interface AppSettings extends Object {
  appSettings?: Add;
}

interface Add extends Object {
  add?: Element;
}


interface Element extends Object {
  key?: number;
  value?: string;
}

const iisconfig2json = (options: Options = {}) : Configuration => {
    let json: Configuration = {};
    let output: string = '';
  
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
        fs.writeFile(output, JSON.stringify(json), function(err) {
            if (err) {
                debug('iisconfig2json: %s', err);
            }
        });
    }

    return json;
};


const getJSON = (options: Options) : Object => {
  const input: string = path.resolve(options.inputFile || '');
  let json: Object = {};

  debug('getJSON: Reading %s', input);

  try {
    let data: Buffer = fs.readFileSync(input);
    debug('getJSON: Got data %s', data);
    parser.parseString(data.toString(), function(err: any, result: any) : void {
      if (err) {
        debug('getJSON: %s', err);
      }
      json = result;
    });

    return json;
  } catch (e) {
    debug('getJSON: %s', e);
    return {};
  }
};

const getAppSettings = (data: Configuration) : Element => {
  let appSettings: Element = {};
  let arr;

  debug('getAppSettings data: %s', JSON.stringify(data));

  if (data && data.configuration && data.configuration.appSettings && data.configuration.appSettings.add) {
    arr = data.configuration.appSettings.add;
    debug('getAppSettings arr: %s', JSON.stringify(data));
  } else {
    return appSettings;
  }

  arr.forEach(function(element: Element) {
    if (element.key && element.value) {
      appSettings[element.key] = element.value;
    }
  });

  return appSettings;
};

export = iisconfig2json;
