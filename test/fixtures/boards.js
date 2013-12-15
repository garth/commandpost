var ObjectId = require('mongodb').ObjectID;

module.exports = [
  {
    _id: new ObjectId("22875455e3e2812b6e000001"),
    name: 'Board',
    createdByUser: new ObjectId("12875455e3e2812b6e000001"),
    createdOn: new Date('2013-11-20')
  },
  {
    _id: new ObjectId("22875455e3e2812b6e000002"),
    name: 'Board An Other',
    createdByUser: new ObjectId("12875455e3e2812b6e000001"),
    createdOn: new Date('2013-11-20')
  }
];
