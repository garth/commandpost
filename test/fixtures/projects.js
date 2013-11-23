var ObjectId = require('mongodb').ObjectID;

module.exports = [
  {
    _id: new ObjectId("22875455e3e2812b6e000001"),
    name: 'Project',
    createdByUserId: new ObjectId("12875455e3e2812b6e000001"),
    createdOn: new Date('2013-11-20')
  },
  {
    _id: new ObjectId("22875455e3e2812b6e000002"),
    name: 'Project An Other',
    createdByUserId: new ObjectId("12875455e3e2812b6e000001"),
    createdOn: new Date('2013-11-20')
  }
];
