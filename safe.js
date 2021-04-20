/**
 * Create object proxy to access properties safely.
 * @param {object} object
 * @returns {Proxy}
 */
function safe(object) {
    const path = arguments[1] || [];

    return new Proxy(object, {
        get(target, name) {
            switch (name) {
                case "pop":     return pop;
                case "push":    return push;
                case "valueOf": return valueOf;
                default:        return safe(object, path.concat(name));
            }
        },

        set(target, property, value, receiver) {
            var context = object;

            path.forEach(prop => {
                if (!(prop in context)) context[prop] = {};
                context = context[prop];
            });

            context[property] = value;
        }
    });

    /**
     * Resolve the path, create missing intermediary objects, and set a fallback
     * value if one was not already set.  Return the effective value.
     * @param {*} value
     * @returns {*}
     */
    function fallback(value) {
        const intermediate = path.slice(0,-1);
        const final = path[path.length-1];
        var obj;

        if (!path.length) {
            throw new Error("setting fallback undefined for base target");
        }

        // ensure intermediate objects are set and return the final object
        obj = intermediate.reduce((obj, prop) => {
            if (obj[prop] === undefined) obj[prop] = {};
            return obj[prop];
        }, object);

        // set fallback value if one is not set and return result
        if (obj[final] === undefined) obj[final] = value;
        return obj[final];
    }

    /**
     * Resolve the path and attempt to pop a value from it.
     * @returns {*}
     */
    function pop() {
        const value = valueOf();
        return value === undefined ? value : value.pop();
    }

    /**
     * Resolve the path, fallback to an empty array, and push a value on it.
     * @param {array} values
     */
    function push(...values) {
        fallback([]).push(...values);
    }

    /**
     * Resolve the path to its actual value.
     * @returns {*}
     */
    function valueOf() {
        return path.reduce((obj, prop) => obj ? obj[prop] : undefined, object);
    }
}

module.exports = safe;
