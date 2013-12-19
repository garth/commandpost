var ObjectId = require('mongodb').ObjectID;

module.exports = [
  {
    _id: new ObjectId("72875455e3e2812b6e000001"),
    board: new ObjectId("22875455e3e2812b6e000001"),
    name: 'Story',
    icon: 'book',
    pointScale: '1,2,3,5,8',
    priority: 0
  },
  {
    _id: new ObjectId("72875455e3e2812b6e000002"),
    board: new ObjectId("22875455e3e2812b6e000001"),
    name: 'Bug',
    icon: 'bug',
    pointScale: '',
    priority: 1
  },
  {
    _id: new ObjectId("72875455e3e2812b6e000003"),
    board: new ObjectId("22875455e3e2812b6e000001"),
    name: 'Task',
    icon: 'wrench',
    pointScale: '',
    priority: 0
  },
  {
    _id: new ObjectId("72875455e3e2812b6e000004"),
    board: new ObjectId("22875455e3e2812b6e000002"),
    name: 'Story',
    icon: 'book',
    pointScale: '1,2,3,5,8',
    priority: 0
  },
];
