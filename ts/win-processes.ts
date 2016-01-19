/// <reference path="../typings/tsd.d.ts" />

import proc = require('child_process');
import Q = require('q');

/**
 * @class WinProcessesContext
 */
export class WinProcessesContext {

    /**
     * List all current processes
     * @method List
     * @returns {Promise} Promise with resulting WinProcess array
     */
    list(): Q.Promise<WinProcess[]> {
        var deff = Q.defer<WinProcess[]>();
        execute("tasklist /NH /fo csv")
            .then((stdout) => {
                deff.resolve(this.parseTaskList(stdout));
            })
            .fail((err) => {
                deff.reject("Something went wrong: " + err);
            });

        //TODO: Hack: this is here just to stop tsc comaplaints about return value;
        return deff.promise;
    }

    /**
     * Find specific process depending on a search function
     * @method Find
     * @param {function} condition Search callback. This function should contain the condition and every item will be tested against it.
     * @returns {Promise} Promise with resulting WinProcess array
     */
    find(condition: (process: WinProcess) => boolean): Q.Promise<WinProcess[]> {
        var deff = Q.defer<WinProcess[]>();
        this.list().then((processes) => {
            let results = new Array<WinProcess>();
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
    }

    /**
     * Kill a process
     * @method Kill
     * @param {string|string[]} pids One or many PIDs of processes to be killed
     * @returns {Promise}
     */
    kill(pids: string | string[]) {
        var arr = Array<string>();
        if (typeof (pids) == 'string') arr.push(<string>pids);
        else if (pids instanceof Array) arr = <string[]>pids;
        var cmd = "taskkill";

        arr.forEach(pid => {
            cmd += " /PID " + pid;
        });

        var deff = Q.defer<void>();
        execute(cmd)
            .then((stdout) => {
                deff.resolve();
            })
            .fail((err) => {
                deff.reject("Something went wrong: " + err);
            });
        return deff.promise;
    }

    /**
     * Kill a process
     * @method KillByName
     * @param {string} name Name of the process to be killed
     * @returns {Promise}
     */
    killByName(name: string) {
        var deff = Q.defer<void>();
        execute("taskkill /IM " + name)
            .then((stdout) => {
                deff.resolve();
            })
            .fail((err) => {
                deff.reject("Something went wrong: " + err);
            });
        return deff.promise;
    }

    private parseTaskList(input: Buffer): WinProcess[] {
        let results = new Array<WinProcess>();
        var lines = input.toString().split("\r\n");

        lines.forEach(line => {
            var parsed = new WinProcess(line);
            if (parsed.PID != null)
                results.push(parsed);
        });

        return results;
    }
}

/**
 * @class WinProcess
 * Class representing a windows process.
 * @property ImageName
 * @property PID
 * @property SessionName
 * @property SessionNumber
 * @property MemoryUsage
 */
export class WinProcess {

    ImageName: string;

    PID: string;

    SessionName: string;

    SessionNumber: string;

    MemoryUsage: string;

    /**
     * @constructor
     * @param Line from tasklist to parse
     */
    constructor(line: string) {
        var values = line.split(',');
        this.ImageName = this.stripQuotes(values[0]);
        this.PID = this.stripQuotes(values[1]);
        this.SessionName = this.stripQuotes(values[2]);
        this.SessionNumber = this.stripQuotes(values[3]);
        this.MemoryUsage = this.stripQuotes(values[4]);
    }

    private stripQuotes(text: string): string {
        if (typeof (text) !== 'string') return null;
        return text.replace(/"/g, '');
    }
}

function execute(command: string): Q.Promise<Buffer> {
    var dff = Q.defer<Buffer>();
    proc.exec(command, function(error, stdout, stderr) {
        dff.resolve(stdout);
    });
    return dff.promise;
}

export var wproc: WinProcessesContext = new WinProcessesContext();
