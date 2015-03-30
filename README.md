# iisconfig2json
---

Convert an iis configuration file to json format. 

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
