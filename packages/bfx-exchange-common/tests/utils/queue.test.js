const PriorityQueue = require("../../src/utils/queue");

describe("Test priority queue", () => {
    test('should return the min value first', () => {
        const queue = new PriorityQueue((a, b) => a - b);
        queue.add(10)
        queue.add(5)
        queue.add(1)
        queue.add(20)

        expect(queue.remove()).toBe(1);
        expect(queue.remove()).toBe(5);
        expect(queue.remove()).toBe(10);

        queue.add(1)
        expect(queue.remove()).toBe(1);
        expect(queue.remove()).toBe(20);
        expect(queue.isEmpty()).toBeTruthy();
    });

    test('should return the max value first', () => {
        const queue = new PriorityQueue((a, b) => b - a);
        queue.add(10)
        queue.add(5)
        queue.add(1)
        queue.add(20)

        expect(queue.remove()).toBe(20);
        expect(queue.remove()).toBe(10);
        expect(queue.remove()).toBe(5);

        queue.add(50)
        expect(queue.remove()).toBe(50);
        expect(queue.remove()).toBe(1);
        expect(queue.isEmpty()).toBeTruthy();
    });
});