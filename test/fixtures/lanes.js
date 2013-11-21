var ObjectId = require('mongodb').ObjectID;

module.exports = [
  {
    _id: new ObjectId("32875455e3e2812b6e000001"),
    projectId: new ObjectId("22875455e3e2812b6e000001"),
    name: 'One',
    order: 1
  },
  {
    _id: new ObjectId("32875455e3e2812b6e000002"),
    projectId: new ObjectId("22875455e3e2812b6e000001"),
    name: 'two',
    order: 2
  },
  {
    _id: new ObjectId("32875455e3e2812b6e000003"),
    projectId: new ObjectId("22875455e3e2812b6e000001"),
    name: 'three',
    order: 3
  }
];
