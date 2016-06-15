import * as test from 'tape';
import * as config from './index';

test('Configuration files Tests', (t: test.Test) => {
    const json1 = config({
        inputFile: './testData/test1.config',
    });

    const expected1 = {
      configuration: {
        'system.webServer': {
          defaultDocument: {
            enabled: 'true',
            files: {
              clear: '',
              add: [
                {
                  value: 'foo.htm',
                },
                {
                  value: 'foo.php',
                },
                {
                  value: 'foo.aspx',
                },
                {
                  value: 'foo.cfm',
                },
              ],
            },
          },
          modules: {
            runAllManagedModulesForAllRequests: 'true',
          },
        },
        appSettings: {},
      },
    };

    t.equal(typeof json1, 'object', 'Check type of object returned');
    t.deepEqual(expected1, json1, 'Check returned object equals expected object');

    const json2 = config({
        inputFile: './testData/test1.config',
        defaultJSON: true
    });

    const expected2 = {
      configuration: {
        'system.webServer': {
          defaultDocument: {
            enabled: 'true',
            files: {
              clear: '',
              add: [
                {
                  value: 'foo.htm',
                },
                {
                  value: 'foo.php',
                },
                {
                  value: 'foo.aspx',
                },
                {
                  value: 'foo.cfm',
                },
              ],
            },
          },
          modules: {
            runAllManagedModulesForAllRequests: 'true',
          },
        },
      },
    };

    t.deepEqual(expected2, json2, 'Check defaultJSON option returns correctly');
    t.end();
});

test('appSettings Tests', (t: test.Test) => {
    const json1 = config({
        inputFile: './testData/appsettings1.config',
    });

    const expected1 = {
      configuration: {
        'system.webServer': {
          defaultDocument: {
            enabled: 'true',
            files: {
              clear: '',
              add: [
                {
                  value: 'foo.htm',
                },
                {
                  value: 'foo.php',
                },
                {
                  value: 'foo.aspx',
                },
                {
                  value: 'foo.cfm',
                },
              ],
            },
          },
          modules: {
            runAllManagedModulesForAllRequests: 'true',
          },
        },
        appSettings: {},
      },
    };

    t.deepEqual(expected1, json1, 'Check appsettings1.config returned object equals expected object');

    const json2 = config({
        inputFile: './testData/appsettings2.config',
    });

    const expected2 = {
      configuration: {
        appSettings: {
            test1: 'value1',
            test2: 'value2',
        },
        'system.webServer': {
          defaultDocument: {
            enabled: 'true',
            files: {
              clear: '',
              add: [
                {
                  value: 'foo.htm',
                },
                {
                  value: 'foo.php',
                },
                {
                  value: 'foo.aspx',
                },
                {
                  value: 'foo.cfm',
                },
              ],
            },
          },
          modules: {
            runAllManagedModulesForAllRequests: 'true',
          },
        },
      },
    };

    t.deepEqual(expected2, json2, 'Check appsettings2.config returned object equals expected object');

    t.end();
});

test('Error Tests', (t: test.Test) => {
    let json = config({});
    let expected = {};
    t.deepEqual(expected, json, 'No options 1');

    json = config();
    expected = {};
    t.deepEqual(expected, json, 'No options 2');

    json = config({
        inputFile: './testData/nodata.config',
    });
    expected = {};
    t.deepEqual(expected, json, 'No data in configuration file');

    json = config({
        inputFile: './testData/test2.config',
    });
    expected = {};
    t.deepEqual(expected, json, 'Only one line in configuration file');

    json = config({
        inputFile: './testData/filedoesnotexist',
    });
    expected = {};
    t.deepEqual(expected, json, 'Configuration file does not exist');

    json = config({
        inputFile: './testData/non-utf8.config',
    });
    expected = {};
    t.deepEqual(expected, json, 'Non-utf8 Configuration file');

    t.end();
});

test('Output file Tests', (t: test.Test) => {
    const fs = require('fs');
    const output1filePath = './testData/output1-result.json';

    config({
        inputFile: './testData/output1.config',
        outputFile: output1filePath
    });

    // Wait a second for the output file to be created
    setTimeout(() : void => {
        const test = fs.readFileSync(output1filePath, 'utf8');
        const expected = '{"configuration":{"appSettings":{"test1":"value1","test2":"value2"},' +
          '"system.webServer":{"defaultDocument":{"enabled":"true",' +
          '"files":{"clear":"","add":[{"value":"foo.htm"},{"value":"foo.php"},' +
          '{"value":"foo.aspx"},{"value":"foo.cfm"}]}},"modules":{"runAllManagedModulesForAllRequests":"true"}}}}';

        t.equal(expected, test, 'Check output file output1-result.json data');

        const json = config({
            inputFile: './testData/output2.config',
            outputFile: './testData/test/output2-result.json'
        });

        if (fs.existsSync('./testData/test/output2-result.json')) {
            t.error('./testData/test/output2-result.json should not exist');
        } else {
            t.pass('Could not find ./testData/test/output2-result.json');
        }

        t.end();
    }, 1000);

});
