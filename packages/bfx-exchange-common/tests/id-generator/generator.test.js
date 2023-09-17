const IdGenerator = require("../../src/id-generator/generator");

describe("Test id generator", () => {
    test('id generator should work as expected', () => {
        const idGenerator = new IdGenerator(10);
        expect(idGenerator.nextId()).toBe(10);
        expect(idGenerator.nextId()).toBe(11);
        expect(idGenerator.nextId()).toBe(12);
    });
});
