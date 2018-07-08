export class Contents {
    value: any;
    constructor(value: any) {
        this.value = value;
    }
    get() {
        return this.value;
    }
    set(value: any) {
        return this.value;
    }

    toString() {
        return this.value.toString();
    }

    toJSON() {
        return JSON.stringify(this.value);
    }
}
