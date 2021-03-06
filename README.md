# win-processes [![npm version](https://badge.fury.io/js/win-processes.svg)](https://badge.fury.io/js/win-processes)
Node module for working with windows processes

Simple few commands that can be used to interact with Windows processes. Feel free to add, fix and contribute

## Examples

```js
var wProc = require('win-processes').wproc;
```

### Read full list of processes

```js
wProc.list().then(function (result) {
        gUtils.log(result);
    })
```

### Check if process is running

```js
wProc.isRunning("processName.exe").then(function (result) {
        if (result){
            console.log("Process is running");
        }else {
            console.log("Process is not running");
        }
    });
```


## API

## Class: WinProcessesContext

### WinProcessesContext.IsRunning(processName)

Checks if process is currently running

**Returns**: `Promise`, Promise with resulting boolean

#### WinProcessesContext.List()

List all current processes

**Returns**: `Promise`, Promise with resulting WinProcess array

#### WinProcessesContext.Find(condition)

Find specific process depending on a search function

**Parameters**

*condition*: `function`, Search callback. This function should contain the condition and every item will be tested against it. Returns boolean.

**Returns**: `Promise`, Promise with resulting WinProcess array

#### WinProcessesContext.Kill(pids)

Kill a process

**Parameters**

*pids*: `string | string[]`, One or many PIDs of processes to be killed

**Returns**: `Promise`

#### WinProcessesContext.KillByName(name)

Kill a process

**Parameters**

*name*: `string`, Name of the process to be killed

**Returns**: `Promise`


## Class: WinProcess


*ImageName*:

*PID*:

*SessionName*:

*SessionNumber*:

*MemoryUsage*:


* * *










