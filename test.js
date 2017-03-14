import SetOfObjects from './src/index.js';
import errors from './errors.json';

const arr = () => {
  return [{ id: 1 }, { id: 2 }, { id: 3 }];
};
const defaultResult = {
  result: {
    items: arr()
  }
}
const expectedData = {
  validSet: {
    items: arr()
  },
  add: {
    validItem: {
      result: {
        items: [...arr(), { id: 5 }]
      },
      error: null
    },
    reverseItem: {
      result: {
        items: [{ id: 4 }, ...arr()]
      },
      error: null
    },
    noIdItem: {
      ...defaultResult,
      error: errors['3']
    },
    duplicateItem: {
      ...defaultResult,
      error: errors['1']
    },
    invalidIdItem: {
      ...defaultResult,
      error: errors['4']
    }
  },
  remove: {
    validItem: {
      result: {
        items: [{ id: 1 }, { id: 2 }]
      },
      error: null
    },
    invalidItem: {
      ...defaultResult,
      error: errors['2']
    },
    all: {
      items: []
    }
  },
  get: {
    byId: { id: 2 },
    byIndex: arr()[1],
    length: arr().length
  }
}
test('test creating set', () => {
  expect(new SetOfObjects(arr())).toEqual(expectedData.validSet);
});

test('test adding valid item', () => {
  const Set = new SetOfObjects(arr());
  let { result, error } = Set.add({ id: 5 });
  expect({ result, error }).toEqual(expectedData.add.validItem);
});

test('test adding item in a reverse order (reverse option in method)', () => {
  const Set = new SetOfObjects(arr());
  let { result, error } = Set.add({ id: 4 }, { reverse: true });
  expect({ result, error }).toEqual(expectedData.add.reverseItem);
});

test('test adding item in a reverse order (reverse option in constructor)', () => {
  const Set = new SetOfObjects(arr(), { reverse: true });
  let { result, error } = Set.add({ id: 4 });
  expect({ result, error }).toEqual(expectedData.add.reverseItem);
});

test('test adding item without id', () => {
  const Set = new SetOfObjects(arr());
  let { result, error } = Set.add({ rocky: 'horror' });
  expect({ result, error }).toEqual(expectedData.add.noIdItem);
});

test('test adding item with invalid id', () => {
  const Set = new SetOfObjects(arr());
  let { result, error } = Set.add({ id: ['w', 't', 'f'] });
  expect({ result, error }).toEqual(expectedData.add.invalidIdItem);
});

test('test adding duplicate item', () => {
  const Set = new SetOfObjects(arr());
  let { result, error } = Set.add({ id: 1 });
  expect({ result, error }).toEqual(expectedData.add.duplicateItem);
});

test('test removing valid item', () => {
  const Set = new SetOfObjects(arr());
  let { result, error } = Set.removeById(3);
  expect({ result, error }).toEqual(expectedData.remove.validItem);
});

test('test removing invalid item', () => {
  const Set = new SetOfObjects(arr());
  let { result, error } = Set.removeById('oops');
  expect({ result, error }).toEqual(expectedData.remove.invalidItem);
});

test('test removing all items', () => {
  const Set = new SetOfObjects(arr());
  expect(Set.removeAll()).toEqual(expectedData.remove.all);
});

test('test getting item by id', () => {
  const Set = new SetOfObjects(arr());
  expect(Set.get(2)).toEqual(expectedData.get.byId);
});

test('test getting item by index', () => {
  const Set = new SetOfObjects(arr());
  expect(Set.getByIndex(1)).toEqual(expectedData.get.byIndex);
});

test('test getting items length', () => {
  const Set = new SetOfObjects(arr());
  expect(Set.length).toEqual(expectedData.get.length);
});
