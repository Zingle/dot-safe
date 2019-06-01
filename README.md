dot-safe
========
The `dot-safe` function creates an object proxy that an be used to safely
access object properties and manipulate arrays.  It is intended to be used with
unstructured data to avoid lots of `(obj && obj.prop && obj.prop.foo)` noise.

Usage
-----

```js
const safe = require("dot-safe");
const object = {}
const proxy = safe(object);

// set nested properties; intermediary objects created as needed
proxy.foo.bar = 13;

// push values onto arrays; array and intermediary objects created as needed
proxy.list.push(42);
proxy.list.push(23);

// safely access nested properties or pop from arrays
assert(proxy.foo.bar.valueOf() === 13);
assert(proxy.baz.bang.valueOf() === undefined);
assert(proxy.list.pop() === 23);
assert(proxy.baz.pop() === undefined);

// after all that, object now looks like:
// {
//   foo: {bar: 13},
//   list: [42]
// }
```

API
---

### safe(object) => Proxy
Create an object proxy that can be used to safely access nested data within the
object.

Performance Considerations
--------------------------
Each time a property is accessed, a new `Proxy` is created.  If you are going
to be accessing the same nested property of a particular object, consider
saving the result for subsequent property access.

```js
const proxy = safe(object);

// GOOD: do this
const status = proxy.info.status;
while (status.valueOf() === "incomplete") { ... }

// BAD: don't do this
while (proxy.info.status.valueOf() === "incomplete") { ... }
```
