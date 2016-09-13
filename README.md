# [jsmake](https://github.com/eserozvataf/jsmake)

This project is designed to function as a build tool especially for node.js applications.

* Source: [https://github.com/eserozvataf/jsmake](https://github.com/eserozvataf/jsmake)
* Twitter: [@eserozvataf](http://twitter.com/eserozvataf)
* Homepage: [http://eser.ozvataf.com/](http://eser.ozvataf.com/)


## Quick start

Execute `npm install jsmake -g` to install jsmake on your system.


## Why?

jsmake is a tool to simplify building or deploying your software components from its sources by executing user created directives listed in `makefile.js`.

Apart from other tools like gulp, jsmake only concentrates on executing tasks. But it can *also* [interoperate with tools like gulp](samples/using-with-gulp-makefile.js). So it's the right tool if you have set of duties needs to be executed on your codebase.


## Planned Feature Highlights

- ~~Tasks with prerequisites~~ *done!*
- ~~Async task execution with Promises~~ *done!*
- ~~Can be used as a library~~ *done!*
- ~~Powerful command line argument parsing~~ *done!*
- Environment variables handling (even in Windows)
- Event subscription for tasks and execution queues
- ~~NPM bump version~~ *done!*
- Watch task
- Publish tasks


## Todo List

See [GitHub Issues](https://github.com/eserozvataf/jsmake/issues).


## Dependencies

* [maester](https://github.com/eserozvataf/maester)
* [cofounder](https://github.com/eserozvataf/cofounder)
* yargs-parser
* update-notifier


## Requirements

* node.js (https://nodejs.org/)


## License

Apache 2.0, for further details, please see [LICENSE](LICENSE) file


## Contributing

See [contributors.md](contributors.md)

It is publicly open for any contribution. Bugfixes, new features and extra modules are welcome.

* To contribute to code: Fork the repo, push your changes to your fork, and submit a pull request.
* To report a bug: If something does not work, please report it using GitHub issues.
* To support: [![Donate](https://img.shields.io/gratipay/eserozvataf.svg)](https://gratipay.com/eserozvataf/)
