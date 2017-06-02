'use strict';

import { isObject } from './shared';

var hasOwnProperty = Object.prototype.hasOwnProperty,
    nativeKeys = Object.keys;

function keys(obj) {
    if (nativeKeys) {
        return nativeKeys(obj);
    }

    var keys = [];

    for (var key in obj) {
        keys.push(key);
    }

    return keys;
}

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
    // SameValue algorithm
    if (x === y) {
        // Steps 1-5, 7-10
        // Steps 6.b-6.e: +0 != -0
        // Added the nonzero y check to make Flow happy, but it is redundant
        return x !== 0 || y !== 0 || 1 / x === 1 / y;
    } else {
        // Step 6.a: NaN == NaN
        return x !== x && y !== y;
    }
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
export default function shallowEqual(objA, objB) {
    if (is(objA, objB)) {
        return true;
    }

    if (!isObject(objA) || objA === null || !isObject(objB) || objB === null) {
        return false;
    }

    var keysA = keys(objA);
    var keysB = keys(objB);

    if (keysA.length !== keysB.length) {
        return false;
    }

    // Test for A's keys different from B.
    for (var i = 0; i < keysA.length; i++) {
        if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }

    return true;
}