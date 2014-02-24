var ObjectId = require('mongodb').ObjectID;

module.exports = [
  {
    _id: new ObjectId("82875455e3e2812b6e000001"),
    boardId: new ObjectId("22875455e3e2812b6e000001"),
    version: 'v1.0.0-beta.1',
    description: 'This is the first release',
    createdByUserId: new ObjectId("12875455e3e2812b6e000001"),
    createdOn: new Date('2014-02-20'),
    cards: [
      {
        _id: new ObjectId("42875455e3e2812b6e000001"),
        cardType: "Story",
        cardIcon: "book",
        title: 'Item 1',
        description: 'some details',
        points: 1,
        createdByUserId: new ObjectId("12875455e3e2812b6e000001"),
        createdOn: new Date('2013-11-20'),
        comments: [
          {
            _id: new ObjectId("52875455e3e2812b6e000001"),
            text: 'I like it',
            userId: new ObjectId("12875455e3e2812b6e000001"),
            createdOn: new Date('2013-11-20')
          },
          {
            _id: new ObjectId("52875455e3e2812b6e000002"),
            text: 'I don\'t like it',
            userId: new ObjectId("12875455e3e2812b6e000001"),
            createdOn: new Date('2013-11-21')
          }
        ]
      },
      {
        _id: new ObjectId("42875455e3e2812b6e000002"),
        cardType: "Story",
        cardIcon: "book",
        title: 'Item 2',
        description: 'some details',
        points: 1,
        createdByUserId: new ObjectId("12875455e3e2812b6e000001"),
        createdOn: new Date('2013-11-20'),
        comments: [
          {
            _id: new ObjectId("52875455e3e2812b6e000003"),
            text: 'Super',
            userId: new ObjectId("12875455e3e2812b6e000001"),
            createdOn: new Date('2013-11-21')
          }
        ]
      },
      {
        _id: new ObjectId("42875455e3e2812b6e000003"),
        cardType: "Story",
        cardIcon: "book",
        title: 'Item 3',
        description: 'some details',
        points: 1,
        createdByUserId: new ObjectId("12875455e3e2812b6e000001"),
        createdOn: new Date('2013-11-20')
      }
    ]
  },
  {
    _id: new ObjectId("82875455e3e2812b6e000002"),
    boardId: new ObjectId("22875455e3e2812b6e000001"),
    version: 'v1.0.0',
    description: 'This is the final release',
    createdByUserId: new ObjectId("12875455e3e2812b6e000001"),
    createdOn: new Date('2014-02-21'),
    cards: [
      {
        _id: new ObjectId("42875455e3e2812b6e000004"),
        cardType: "Story",
        cardIcon: "book",
        title: 'Item 4',
        description: 'some details',
        points: 1,
        createdByUserId: new ObjectId("12875455e3e2812b6e000001"),
        createdOn: new Date('2013-11-20')
      }
    ]
  }
];
