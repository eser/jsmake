# [jsmake](https://github.com/eserozvataf/jsmake)

[![npm version][npm-image]][npm-url]
[![npm download][download-image]][npm-url]
[![dependencies][dep-image]][dep-url]
[![license][license-image]][license-url]

This project is designed to function as a build tool especially for node.js applications.


## Why jsmake?

jsmake is a tool to simplify building or deploying your software components from its sources by executing user created directives listed in `makefile.js`.

Apart from other tools like gulp, jsmake only concentrates on executing tasks. But it can *also* [interoperate with tools like gulp](samples/using-with-gulp-makefile.js). So it's the right tool if you have set of duties needs to be executed on your codebase.

As a build tool it offers,

- Tasks with prerequisites,
- Async task execution with Promises,
- Developer-friendly API to be used as a library,
- Powerful command line argument parsing,
- Utility methods for various tasks such as glob, recursively delete directories or bump version in package.json,
- Environment variables handling (even in Windows),
- Event subscription for tasks and execution queues,


## Quick start

Execute `npm install jsmake -g` to install jsmake on your system.


## Sample makefile.js

jsmake's own [makefile.js](makefile.js) output is shown below:

```bash
$ jsmake -h
Usage: jsmake [command] [parameters]

--makefile FILE, -f           Load tasks from FILE.
--tasks, -t                   Lists defined tasks.
--quiet, -q                   Turns off output of non-critical log messages.
--version, -v                 Displays the jsmake version.
--help, -h, -?                Displays this help message.

 Tasks                           Description
 ------------------------------  -----------------------------------
 bump                            Bumps the package version for next release.
   Parameters:
   --type                        Increment type [major, minor, patch, premajor, preminor, prepatch or prerelease]

 publish                         Publishes package to npm.
 deps                            Reinstalls dependencies from npm.
 build                           Builds the source code.
```

Also another examples are found in [samples/](samples/) folder, such as:

- [Alternative syntax](samples/alternative-syntax-makefile.js)
- [API](samples/api.js)
- [Async/Promises](samples/async-promises-makefile.js)
- [Events](samples/events-makefile.js)
- [NPM Utils](samples/npm-utils-makefile.js)
- [Pre/Post Tasks](samples/pre-post-tasks-makefile.js)
- [Sequential Tasks](samples/sequential-tasks-makefile.js)
- [Shell Commands](samples/shell-commands-makefile.js)
- [Tasks with Descriptions](samples/tasks-with-descriptions-makefile.js)
- [Tasks with Parameters](samples/tasks-with-parameters-makefile.js)
- [Using with Gulp.js](samples/using-with-gulp-makefile.js)


## Todo List

- Watch task
- Publish tasks

See [GitHub Projects](https://github.com/eserozvataf/jsmake/projects) for more.


## Requirements

* node.js (https://nodejs.org/)


## License

Apache 2.0, for further details, please see [LICENSE](LICENSE) file


## Contributing

See [contributors.md](contributors.md)

It is publicly open for any contribution. Bugfixes, new features and extra modules are welcome.

* To contribute to code: Fork the repo, push your changes to your fork, and submit a pull request.
* To report a bug: If something does not work, please report it using [GitHub Issues](https://github.com/eserozvataf/maester/issues).


## To Support

[Visit my patreon profile at patreon.com/eserozvataf](https://www.patreon.com/eserozvataf)


[npm-image]: https://img.shields.io/npm/v/jsmake.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/jsmake
[download-image]: https://img.shields.io/npm/dt/jsmake.svg?style=flat-square
[dep-image]: https://img.shields.io/david/eserozvataf/jsmake.svg?style=flat-square
[dep-url]: https://github.com/eserozvataf/jsmake
[license-image]: https://img.shields.io/npm/l/jsmake.svg?style=flat-square
[license-url]: https://github.com/eserozvataf/jsmake/blob/master/LICENSE
