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
        let rules = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        this.rules = rules;
    }

    getRule(key) {
        return this.rules[key];
    }

    setRule(key, rule) {
        this.rules[key] = rule;
    }

    checkOccurences(rule, values) {
        if (rule.min !== undefined && values.length < rule.min || rule.max !== undefined && values.length > rule.max) {
            return { error: 'out of range' };
        }

        return null;
    }

    checkType(rule, values) {
        for (const value of values) {
            if (value.constructor !== rule.type) {
                return { error: 'invalid type' };
            }
        }

        return null;
    }

    findValues(argv, key) {
        let foundValues = [];

        if (key in argv) {
            if (argv[key].constructor === Array) {
                foundValues = foundValues.concat(argv[key]);
            } else {
                foundValues.push(argv[key]);
            }
        }

        const rule = this.rules[key];

        if (rule.aliases !== undefined) {
            for (const alias of rule.aliases) {
                if (!(alias in argv)) {
                    continue;
                }

                if (argv[alias].constructor === Array) {
                    foundValues = foundValues.concat(argv[alias]);
                } else {
                    foundValues.push(argv[alias]);
                }
            }
        }

        return foundValues;
    }

    validate(argv) {
        // TODO check redundant keys

        const values = {};

        for (const key in this.rules) {
            if (key === '_') {
                continue;
            }

            const rule = this.rules[key];

            const foundValues = this.findValues(argv, key);

            // check occurences
            const checkOccurences = this.checkOccurences(rule, foundValues);

            if (checkOccurences !== null) {
                values[key] = checkOccurences;
                continue;
            }

            // check type
            const checkType = this.checkType(rule, foundValues);

            if (checkType !== null) {
                values[key] = checkType;
                continue;
            }

            // otherwise
            if (foundValues.length === 0) {
                values[key] = { error: null, value: rule.default || null };
            } else if (rule.max <= 1) {
                values[key] = { error: null, value: foundValues[0] };
            } else {
                values[key] = { error: null, value: foundValues };
            }
        }

        return values;
    }

    help() {
        let output = '';

        for (const key in this.rules) {
            const rule = this.rules[key];

            let lineOutput = `${ key.length > 1 ? '--' : '-' }${ key }`;

            if (rule.parameter !== undefined) {
                lineOutput += ` ${ rule.parameter }`;
            }

            for (const alias of rule.aliases) {
                lineOutput += `, ${ alias.length > 1 ? '--' : '-' }${ alias }`;
            }

            output += `${ lineOutput }${ ' '.repeat(32 - lineOutput.length) } ${ rule.description }\n`;
        }

        return output;
    }
}

exports.default = ArgvList;