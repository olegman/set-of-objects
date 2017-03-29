export const errors = {
    "1": {
        "code": 1,
            "message": "Item is already added"
    },
    "2": {
        "code": 2,
            "message": "Not found to remove"
    },
    "3": {
        "code": 3,
            "message": "Item don't have required attribute id"
    },
    "4": {
        "code": 4,
            "message": "Item don't have proper type for attribute id, must be number or string"
    }
};

export function* enumerate(iterable) {
    let i = 0;
    for (const x of iterable) {
        yield [x, i];
        i++;
    }
}

class SetOfObjects {
    constructor(items = [], options = {}) {
        this.items = [...items];
        if (options.make) this.__make = options.make;
        if (options.reverse) this.reverse = options.reverse;
    }
    *[Symbol.iterator]() {
        let index = 0;
        while (index in this.items) {
            yield this.items[index];
            index++;
        }
    }
    static isValid(item) {
        let result = false;
        let error = null;
        if (item.id === undefined) {
            return {
                result,
                error: errors['3']
            }
        }
        if (!(typeof item.id === 'number' || typeof item.id === 'string')) {
            return {
                result,
                error: errors['4']
            }
        }
        return {
            result: true,
            error
        }
    }
    add(item,  options = {}) {
        let {result: validateResult, error: validateError} = SetOfObjects.isValid(item);
        let reverse = this.reverse;
        if (options.reverse) {
            reverse = options.reverse;
        }
        if (validateResult) {
            if (this.isAdded(item)) {
                return {
                    error: errors['1'],
                    result: this.__make([...this.items])
                }
            } else {
                reverse ? this.items.unshift(item) : this.items.push(item);
                return {
                    error: null,
                    result: this.__make([...this.items])
            }
            }
        } else {
            return {
                error: validateError,
                result: this.__make([...this.items])
            }
        }
    }
    isAdded({ id }) {
        for (const item of this.items) {
            if (item.id === id) return true;
        }
        return false;
    }
    remove({ id }) {
        let isRemoved = false;
        for (const [item, index] of enumerate(this.items)) {
            if (item.id === id) {
                this.items.splice(index, 1);
                isRemoved = true;
                break;
            }
        }
        if (!isRemoved) {
            return {
                error: errors['2'],
                result: this.__make([...this.items])
            }
        } else {
            return {
                error: null,
                result: this.__make([...this.items])
            }
        }
    }
    removeById(id) {
        return this.remove({ id });
    }
    removeAll() {
        this.items = [];
        return this.__make();
    }
    get(id) {
        return this.items.find(item => item.id === id);
    }
    getByIndex(index) {
        return this.items[index];
    }
    get length() {
        return this.items.length
    }
}

function makeSet(items = []) {
    return new SetOfObjects(items);
}

SetOfObjects.prototype.__make = makeSet;

export default SetOfObjects;
