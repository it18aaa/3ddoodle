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

    incrementSizes() {
        return this.incrementSize;
    }
    
    get() {
        return this.level;
    }

    set(val) {
        this.level = val;
    }
    reset() {
        this.level = this.incrementSize;
    }
}