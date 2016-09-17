const ArgvList = require('./lib/ArgvList.js').default;
const Utils = new (require('./lib/Utils.js').default)();

const x = new ArgvList({
    'name': {
        type: String,
        aliases: [ 'n' ],
        description: 'Sets name',
        min: 0,
        max: 5,
       'default': [ 'eser' ]
    },
    'version': {
        type: Boolean,
        aliases: [ 'v' ],
        description: 'Displays software version',
        min: 0,
        max: 1,
       'default': false
    }
});

console.log(
    x.validate(Utils.parseArgv('--name=seyma -n kedi'))
);
