/**
 * jsmake
 *
 * @version v0.0.1
 * @link http://eser.ozvataf.com
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// {
//     'version': {
//         type: Boolean,
//         aliases: [ 'v' ],
//         description: 'Displays software version',
//         min: 0,
//         max: 1,
//         'default': false
//     }
// }
//
class ArgvList {
    constructor() {
        let initialList = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        this.list = initialList;
    }

    get(key) {
        return this.list[key];
    }

    set(key, item) {
        this.list[key] = item;
    }

    validate(argv) {
        // TODO check redundant keys

        const values = {};

        for (const key in this.list) {
            if (key === '_') {
                continue;
            }

            const item = this.list[key];

            // check occurences
            let foundValues = [];

            if (key in argv) {
                if (argv[key].constructor === Array) {
                    foundValues = foundValues.concat(argv[key]);
                } else {
                    foundValues.push(argv[key]);
                }
            }

            for (const aliaskey of item.aliases) {
                if (!(aliaskey in argv)) {
                    continue;
                }

                if (argv[aliaskey].constructor === Array) {
                    foundValues = foundValues.concat(argv[aliaskey]);
                } else {
                    foundValues.push(argv[aliaskey]);
                }
            }

            if (foundValues.length < item.min || foundValues.length > item.max) {
                values[key] = { error: 'out of range' };
                continue;
            }

            // check type
            let validType = true;

            for (const foundValue of foundValues) {
                if (foundValue.constructor !== item.type) {
                    validType = false;
                    break;
                }
            }

            if (!validType) {
                values[key] = { error: 'invalid type' };
                continue;
            }

            // otherwise
            if (foundValues.length === 0) {
                values[key] = { error: null, values: item.default || null };
            } else if (item.max <= 1) {
                values[key] = { error: null, values: foundValues[0] };
            } else {
                values[key] = { error: null, values: foundValues };
            }
        }

        return values;
    }
}

exports.default = ArgvList;