var winProc = require('../js/win-processes').wproc;
var assert = require('chai').assert;
var spawn = require('child_process').spawn;
var process;

function runProcess() {
    process = spawn("charmap");
}

function killProcess() {
    process.kill('SIGTERM');
}

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
                    assert.isNotNull(process.ImageName, "ImageName is null");
                    assert.isNotNull(process.PID, "PID is null");
                    assert.isNotNull(process.SessionName, "SessionName is null");
                    assert.isNotNull(process.SessionNumber, "SessionNumber is null");
                    assert.isNotNull(process.MemoryUsage, "MemoryUsage is null");

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

describe('#find()', function () {
    it('should finish', function () {
        return winProc.find((process) => {
            return process.PID === '1';
        });
    });
    it('should find one PID 0 - System Idle Process', function () {
        return winProc.find((process) => {
            return process.PID === '0';
        }).then((results) => {
            assert.equal(results.length, 1, "There should be one process with PID 0");
            var systemIdle = results[0];

            assert.equal(systemIdle.ImageName, "System Idle Process", "ImageName is System Idle Process");
            assert.equal(systemIdle.PID, "0", "PID is 0");
            assert.equal(systemIdle.SessionName, "Services", "SessionName should be Services");
            assert.equal(systemIdle.SessionNumber, "0", "SessionNumber should be 0");
        });
    });
    it('should find one process with image name explorer.exe', function () {
        return winProc.find((process) => {
            return process.ImageName === 'explorer.exe';
        }).then((results) => {
            assert.equal(results.length, 1, "There should be one process with ImageName = explorer.exe");
            var systemIdle = results[0];

            assert.equal(systemIdle.ImageName, "explorer.exe", "ImageName is explorer.exe");
        });
    });
    it('should not find process with image name charmap.exe before starting it', function () {
        return winProc.find((process) => {
            return process.ImageName === 'charmap.exe';
        }).then((results) => {
            assert.equal(results.length, 0, "There should be no process ImageName = charmap.exe");
        });
    });
    it('should find one process with image name charmap.exe after starting it', function () {
        runProcess();
        return winProc.find((process) => {
            return process.ImageName === 'charmap.exe';
        }).then((results) => {
            assert.equal(results.length, 1, "There should be one process with ImageName = charmap.exe");
            var systemIdle = results[0];

            assert.equal(systemIdle.ImageName, "charmap.exe", "ImageName is charmap.exe");
        });
    });
    it('should find no process with image name charmap.exe after killing it', function () {
        killProcess();
        return winProc.find((process) => {
            return process.ImageName === 'charmap.exe';
        }).then((results) => {
            assert.equal(results.length, 0, "There should be no process ImageName = charmap.exe");
        });
    });

});

describe('#kill()', function () {
    it('should kill a process', function () {
        runProcess();
        return winProc.find((prc) => {
            return prc.PID == process.pid.toString();
        }).then((result) => {
            assert.equal(result.length, 1, "There should be one process with ImageName = charmap.exe");

            winProc.kill(process.pid)
                .then(() => {
                    winProc.find((prc) => {
                        prc.id == process.pid.toString();
                    }).then((result) => {
                        assert.equal(result.length, 0, "There should be no process with ImageName = charmap.exe");
                    });
                })
                .fail(() => {
                    assert.fail('Kill call failed');
                });
        });
    });
});

describe('#isRunning()', function () {
    it('should find one process with image name explorer.exe', function () {
        return winProc.isRunning('explorer.exe').then((result) => {
            assert.isTrue(result, "There should be one process with ImageName = explorer.exe");
        });
    });
    it('should find no process with image name nonexistent.exe', function () {
        return winProc.isRunning('nonexistent.exe').then((result) => {
            assert.isFalse(result, "There should be no process with ImageName = nonexistent.exe");
        });
    });
});