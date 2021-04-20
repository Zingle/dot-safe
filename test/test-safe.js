const expect = require("expect.js");
const safe = require("..");

describe("safe(object)", () => {
    var object,
        proxy;

    beforeEach(() => {
        object = {a: 42, b: {c: "foo"}};
        proxy = safe(object);
    });

    it("should return virtual proxy properties", () => {
        expect(proxy.a).to.be.an("object");
        expect(proxy.zing).to.be.an("object");
        expect(proxy.zap).to.be.an("object");
    });

    it("should return virtual nested proxy properties", () => {
        expect(proxy.a.b.c).to.be.an("object");
    });

    it("should update underlying object when assigned", () => {
        proxy.zing = 42;
        expect(object.zing).to.be(42);
    });

    it("should update nested object properties when assigned", () => {
        proxy.b.c = "bang";
        expect(object.b.c).to.be("bang");
    });

    it("should push value to nested array when pushed", () => {
        object.array = [];
        proxy.array.push("foo");
        expect(object.array.length).to.be(1);
        expect(object.array).to.contain("foo");
    });

    it("should push multiple values to nested array when pushed", () => {
        object.array = [];
        proxy.array.push("foo", "bar");
        expect(object.array.length).to.be(2);
        expect(object.array).to.contain("foo");
        expect(object.array).to.contain("bar");
    });

    it("should pop value from nested array when popped", () => {
        object.array = ["foo"];
        expect(proxy.array.pop()).to.be("foo");
        expect(object.array.length).to.be(0);
    });

    it("should generate intermediary objects as necessary", () => {
        proxy.foo.bar.baz = 13;
        expect(object.foo).to.be.an("object");
        expect(object.foo.bar).to.be.an("object");
        expect(object.foo.bar.baz).to.be(13);
    });

    it("should generate terminal array for push as necessary", () => {
        proxy.foo.push("foo");
        expect(object.foo).to.be.an("array");
        expect(object.foo.length).to.be(1);
        expect(object.foo).to.contain("foo");
    });

    it("should not generate unnecessary objects", () => {
        expect(proxy.foo.bar).to.be.an("object");
        expect(object.foo).to.be(undefined);
    });
});
