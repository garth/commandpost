var ObjectId = require('mongodb').ObjectID;

module.exports = [
  {
    _id: new ObjectId("32875455e3e2812b6e000001"),
    board: new ObjectId("22875455e3e2812b6e000001"),
    name: 'One',
    order: 1
  },
  {
    _id: new ObjectId("32875455e3e2812b6e000002"),
    board: new ObjectId("22875455e3e2812b6e000001"),
    name: 'Two',
    order: 2
  },
  {
    _id: new ObjectId("32875455e3e2812b6e000003"),
    board: new ObjectId("22875455e3e2812b6e000001"),
    name: 'Three',
    order: 3
  },
  {
    _id: new ObjectId("32875455e3e2812b6e000004"),
    board: new ObjectId("22875455e3e2812b6e000002"),
    name: 'One',
    order: 1
  }
];
