var ObjectId = require('mongodb').ObjectID;

module.exports = [
  {
    _id: new ObjectId("42875455e3e2812b6e000001"),
    cardType: new ObjectId("72875455e3e2812b6e000001"),
    title: 'Item 1',
    description: 'some details',
    points: 1,
    createdByUser: new ObjectId("12875455e3e2812b6e000001"),
    createdOn: new Date('2013-11-20'),
    assignedToUser: null,
    lane: new ObjectId("32875455e3e2812b6e000001"),
    order: 1
  },
  {
    _id: new ObjectId("42875455e3e2812b6e000002"),
    cardType: new ObjectId("72875455e3e2812b6e000001"),
    title: 'Item 2',
    description: 'some details',
    points: 1,
    createdByUser: new ObjectId("12875455e3e2812b6e000001"),
    createdOn: new Date('2013-11-20'),
    assignedToUser: null,
    lane: new ObjectId("32875455e3e2812b6e000001"),
    order: 2
  },
  {
    _id: new ObjectId("42875455e3e2812b6e000003"),
    cardType: new ObjectId("72875455e3e2812b6e000001"),
    title: 'Item 3',
    description: 'some details',
    points: 1,
    createdByUser: new ObjectId("12875455e3e2812b6e000001"),
    createdOn: new Date('2013-11-20'),
    assignedToUser: null,
    lane: new ObjectId("32875455e3e2812b6e000001"),
    order: 3
  },
  {
    _id: new ObjectId("42875455e3e2812b6e000004"),
    cardType: new ObjectId("72875455e3e2812b6e000001"),
    title: 'Item 4',
    description: 'some details',
    points: 1,
    createdByUser: new ObjectId("12875455e3e2812b6e000001"),
    createdOn: new Date('2013-11-20'),
    assignedToUser: null,
    lane: new ObjectId("32875455e3e2812b6e000001"),
    order: 4
  },
  {
    _id: new ObjectId("42875455e3e2812b6e000005"),
    cardType: new ObjectId("72875455e3e2812b6e000001"),
    title: 'Item 5',
    description: 'some details',
    points: 1,
    createdByUser: new ObjectId("12875455e3e2812b6e000001"),
    createdOn: new Date('2013-11-20'),
    assignedToUser: null,
    lane: new ObjectId("32875455e3e2812b6e000002"),
    order: 1
  }
];
