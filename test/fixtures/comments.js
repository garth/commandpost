var ObjectId = require('mongodb').ObjectID;

module.exports = [
  {
    _id: new ObjectId("52875455e3e2812b6e000001"),
    cardId: new ObjectId("42875455e3e2812b6e000001"),
    text: 'I like it',
    userId: new ObjectId("12875455e3e2812b6e000001"),
    createdOn: new Date('2013-11-20')
  },
  {
    _id: new ObjectId("52875455e3e2812b6e000002"),
    cardId: new ObjectId("42875455e3e2812b6e000001"),
    text: 'I don\'t like it',
    userId: new ObjectId("12875455e3e2812b6e000001"),
    createdOn: new Date('2013-11-21')
  }
];
