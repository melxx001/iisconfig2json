# iisconfig2json

Convert an iis configuration file to json format. 

## Status

[![Build Status](https://travis-ci.org/melxx001/iisconfig2json.svg?branch=master)](https://travis-ci.org/melxx001/iisconfig2json) [![Coverage Status](https://coveralls.io/repos/github/melxx001/iisconfig2json/badge.svg?branch=master)](https://coveralls.io/github/melxx001/iisconfig2json?branch=master)

## Installation
```
npm install iisconfig2json
```

## Options
- inputFile (required)
```javascript
var config = require('iisconfig2json');
var json = config({
        inputFile: './sample/global.config'
    });
console.log(JSON.stringify(json,null,4));
```
- outputFile (optional) **The output directory should already exist**)
```javascript
var config = require('iisconfig2json');
var json = config({
        inputFile: './sample/global.config',
        outputFile: './sample/global.json'
    });
console.log(JSON.stringify(json,null,4));
```
- defaultJSON (optional) 
    - Defaults to **false**. The AppSettings node will be modified from an array to an object 
    - Setting this to **true** will convert the IIS config file to JSON without any manipulation to AppSettings

```javascript
var config = require('iisconfig2json');
var json = config({
        inputFile: './sample/global.config',
        defaultJSON: true
    });
console.log(JSON.stringify(json,null,4));
```
