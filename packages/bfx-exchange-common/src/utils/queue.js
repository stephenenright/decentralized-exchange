/**
 * A PriorityQueue to implement as a binary heap.
 */
class PriorityQueue {

    /**
     * @class
     * Creates a new PriorityQueue using the optional comparator to order the items
     * @param {Function} comparator - optional the comparator which controls the ordering
     */
    constructor(comparator) {
        this.heap = [];
        this.comparator = comparator || ((a, b) => a - b);
    }

    add(item) {
        this.heap.push(item);
        this._swim();
    }

    peek() {
        return this.heap[0];
    }

    remove() {
        if (this.isEmpty()) {
            return undefined;
        }

        if (this.size() === 1) {
            return this.heap.pop();
        }

        return this._removeHead();
    }

    _removeHead() {
        const top = this.heap[0];
        this.heap[0] = this.heap.pop();
        this._sink();
        return top;
    }

    removeAll() {
        this.heap = [];
    }

    size() {
        return this.heap.length;
    }

    isEmpty() {
        return this.size() === 0;
    }

    _swim() {
        let index = this.size() - 1;

        if(index <= 0) {
            return;
        }

        while (index > 0 && this.comparator(this.heap[index], this.heap[this._getParentIndex(index)]) < 0) {
            this._swap(index, this._getParentIndex(index));
            index = this._getParentIndex(index);
        }
    }

    _sink() {
        let index = 0;
        while (this._getLeftChildIndex(index) < this.size()) {
            const rightIndex = this._getRightChildIndex(index);
            const leftIndex = this._getLeftChildIndex(index);
            let smallerIndex = leftIndex;

            if (rightIndex < this.size() && this.comparator(this.heap[rightIndex], this.heap[leftIndex]) < 0) {
                smallerIndex = rightIndex;
            }

            if (this.comparator(this.heap[index], this.heap[smallerIndex]) < 0) {
                break;
            }

            this._swap(index, smallerIndex);
            index = smallerIndex;
        }
    }

    _swap(first, second) {
        const temp = this.heap[first];
        this.heap[first] = this.heap[second];
        this.heap[second] = temp;
    }

    _getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    _getLeftChildIndex(index) {
        return 2 * index + 1;
    }

    _getRightChildIndex(index) {
        return 2 * index + 2;
    }
}

module.exports = PriorityQueue