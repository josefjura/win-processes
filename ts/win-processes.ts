/// <reference path="../typings/tsd.d.ts" />

import proc = require('child_process');
import Q = require('q');

export class WinProcessesContext {
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

    kill(pid: string | string[]): boolean {
        return false;
    }

    parseTaskList(input: Buffer): WinProcess[] {
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

export class WinProcess {
    ImageName: string;
    PID: string;
    SessionName: string;
    SessionNumber: string;
    MemoryUsage: string;

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
