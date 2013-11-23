var ObjectId = require('mongodb').ObjectID;

module.exports = [
  {
    _id: new ObjectId("62875455e3e2812b6e000001"),
    user: new ObjectId("12875455e3e2812b6e000001"),
    expiresOn: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 14)
  }
];
