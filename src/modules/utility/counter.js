export class Counter {
    constructor() {
        this.counter = 1;
        this.incrementSize = 1;
    }
    increment() {
        this.counter = this.counter + this.incrementSize;
    }
    decrement() {
        this.counter = this.counter - this.incrementSize;
    }
    get() {
        return this.counter;
    }
    reset() {
        this.counter = 0;
    }
}