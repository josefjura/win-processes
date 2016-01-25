/// <reference path="../typings/tsd.d.ts" />
var proc = require('child_process');
var Q = require('q');
/**
 * @class WinProcessesContext
 */
var WinProcessesContext = (function () {
    function WinProcessesContext() {
    }
    /**
     * List all current processes
     * @method List
     * @returns {Promise} Promise with resulting WinProcess array
     */
    WinProcessesContext.prototype.list = function () {
        var _this = this;
        var deff = Q.defer();
        execute("tasklist /NH /fo csv")
            .then(function (stdout) {
            deff.resolve(_this.parseTaskList(stdout));
        })
            .fail(function (err) {
            deff.reject("Something went wrong: " + err);
        });
        //TODO: Hack: this is here just to stop tsc comaplaints about return value;
        return deff.promise;
    };
    /**
     * Find specific process depending on a search function
     * @method Find
     * @param {function} condition Search callback. This function should contain the condition and every item will be tested against it.
     * @returns {Promise} Promise with resulting WinProcess array
     */
    WinProcessesContext.prototype.find = function (condition) {
        var deff = Q.defer();
        this.list().then(function (processes) {
            var results = new Array();
            for (var pIndex in processes) {
                if (processes.hasOwnProperty(pIndex)) {
                    var process = processes[pIndex];
                    if (condition(process)) {
                        results.push(process);
                    }
                }
            }
            deff.resolve(results);
        });
        return deff.promise;
    };
    /**
     * Kill a process
     * @method Kill
     * @param {string|string[]} pids One or many PIDs of processes to be killed
     * @returns {Promise}
     */
    WinProcessesContext.prototype.kill = function (pids) {
        var arr = Array();
        if (typeof (pids) == 'string')
            arr.push(pids);
        else if (pids instanceof Array)
            arr = pids;
        var cmd = "taskkill";
        arr.forEach(function (pid) {
            cmd += " /PID " + pid;
        });
        var deff = Q.defer();
        execute(cmd)
            .then(function (stdout) {
            deff.resolve();
        })
            .fail(function (err) {
            deff.reject("Something went wrong: " + err);
        });
        return deff.promise;
    };
    /**
     * Kill a process
     * @method KillByName
     * @param {string} name Name of the process to be killed
     * @returns {Promise}
     */
    WinProcessesContext.prototype.killByName = function (name) {
        var deff = Q.defer();
        execute("taskkill /IM " + name)
            .then(function (stdout) {
            deff.resolve();
        })
            .fail(function (err) {
            deff.reject("Something went wrong: " + err);
        });
        return deff.promise;
    };
    WinProcessesContext.prototype.parseTaskList = function (input) {
        var results = new Array();
        var lines = input.toString().split("\r\n");
        lines.forEach(function (line) {
            var parsed = new WinProcess(line);
            if (parsed.PID != null)
                results.push(parsed);
        });
        return results;
    };
    return WinProcessesContext;
})();
exports.WinProcessesContext = WinProcessesContext;
/**
 * @class WinProcess
 * Class representing a windows process.
 * @property ImageName
 * @property PID
 * @property SessionName
 * @property SessionNumber
 * @property MemoryUsage
 */
var WinProcess = (function () {
    /**
     * @constructor
     * @param Line from tasklist to parse
     */
    function WinProcess(line) {
        var values = line.split(',');
        this.ImageName = this.stripQuotes(values[0]);
        this.PID = this.stripQuotes(values[1]);
        this.SessionName = this.stripQuotes(values[2]);
        this.SessionNumber = this.stripQuotes(values[3]);
        this.MemoryUsage = this.stripQuotes(values[4]);
    }
    WinProcess.prototype.stripQuotes = function (text) {
        if (typeof (text) !== 'string')
            return null;
        return text.replace(/"/g, '');
    };
    return WinProcess;
})();
exports.WinProcess = WinProcess;
function execute(command) {
    var dff = Q.defer();
    proc.exec(command, function (error, stdout, stderr) {
        dff.resolve(stdout);
    });
    return dff.promise;
}
exports.wproc = new WinProcessesContext();
