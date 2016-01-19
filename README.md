# win-processes
Node module for working with windows processes

Simple few commands that can be used to interact with Windows processes. Feel free to add, fix and contribute

## API

## Class: WinProcessesContext

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










