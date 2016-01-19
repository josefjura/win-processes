var winProc = require('../js/win-processes').wproc;
var assert = require('chai').assert;

describe('#list()', function () {
    it('should finish', function () {
        return winProc.list();
    });
    it('should return values', function () {
        return winProc.list().then((result) => {
            assert.notEqual(result, null);
        });
    });
    it('should return values without quotes', function () {
        return winProc.list().then((result) => {
            for (var procIndex in result) {
                if (result.hasOwnProperty(procIndex)) {
                    var process = result[procIndex];
                    assert.isNotNull(process.ImageName,"ImageName is null");
                    assert.isNotNull(process.PID,"PID is null");
                    assert.isNotNull(process.SessionName,"SessionName is null");
                    assert.isNotNull(process.SessionNumber,"SessionNumber is null");
                    assert.isNotNull(process.MemoryUsage,"MemoryUsage is null");


                    assert.notInclude(process.ImageName, "\"", "ImageName contains quotes");
                    assert.notInclude(process.PID, "\"", "PID contains quotes");
                    assert.notInclude(process.SessionName, "\"", "SessionName contains quotes");
                    assert.notInclude(process.SessionNumber, "\"", "SessionNumber contains quotes");
                    assert.notInclude(process.MemoryUsage, "\"", "MemoryUsage contains quotes");
                }
            }
        });
    });
});
