export class GroundLevel {
    constructor() {
        this.level = 0.001;
        this.incrementSize = 0.001;
    }
    increment() {
        this.level = this.level + this.incrementSize;
    }
    decrement() {
        this.level = this.level - this.incrementSize;
    }
    get() {
        return this.level;
    }
    reset() {
        this.level = this.incrementSize;
    }
}