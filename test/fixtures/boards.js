var ObjectId = require('mongodb').ObjectID;

module.exports = [
  {
    _id: new ObjectId("22875455e3e2812b6e000001"),
    name: 'Board',
    defaultCardTypeId: new ObjectId("72875455e3e2812b6e000001"),
    createdByUserId: new ObjectId("12875455e3e2812b6e000001"),
    createdOn: new Date('2013-11-20'),
    cardTypes: [
      {
        _id: new ObjectId("72875455e3e2812b6e000001"),
        name: 'Story',
        icon: 'book',
        pointScale: '1,2,3,5,8',
        priority: 0
      },
      {
        _id: new ObjectId("72875455e3e2812b6e000002"),
        name: 'Bug',
        icon: 'bug',
        pointScale: '',
        priority: 1
      },
      {
        _id: new ObjectId("72875455e3e2812b6e000003"),
        name: 'Task',
        icon: 'wrench',
        pointScale: '',
        priority: 0
      }
    ],
    lanes: [
      {
        _id: new ObjectId("32875455e3e2812b6e000001"),
        name: 'One',
        order: 1,
        cards: [
          {
            _id: new ObjectId("42875455e3e2812b6e000001"),
            cardTypeId: new ObjectId("72875455e3e2812b6e000001"),
            title: 'Item 1',
            description: 'some details',
            points: 1,
            createdByUserId: new ObjectId("12875455e3e2812b6e000001"),
            createdOn: new Date('2013-11-20'),
            assignedToUserId: null,
            order: 1,
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
            cardTypeId: new ObjectId("72875455e3e2812b6e000001"),
            title: 'Item 2',
            description: 'some details',
            points: 1,
            createdByUserId: new ObjectId("12875455e3e2812b6e000001"),
            createdOn: new Date('2013-11-20'),
            assignedToUserId: null,
            order: 2,
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
            cardTypeId: new ObjectId("72875455e3e2812b6e000001"),
            title: 'Item 3',
            description: 'some details',
            points: 1,
            createdByUserId: new ObjectId("12875455e3e2812b6e000001"),
            createdOn: new Date('2013-11-20'),
            assignedToUserId: null,
            order: 3
          },
          {
            _id: new ObjectId("42875455e3e2812b6e000004"),
            cardTypeId: new ObjectId("72875455e3e2812b6e000001"),
            title: 'Item 4',
            description: 'some details',
            points: 1,
            createdByUserId: new ObjectId("12875455e3e2812b6e000001"),
            createdOn: new Date('2013-11-20'),
            assignedToUserId: null,
            order: 4
          }
        ]
      },
      {
        _id: new ObjectId("32875455e3e2812b6e000002"),
        name: 'Two',
        order: 2,
        cards: [
          {
            _id: new ObjectId("42875455e3e2812b6e000005"),
            cardTypeId: new ObjectId("72875455e3e2812b6e000001"),
            title: 'Item 5',
            description: 'some details',
            points: 1,
            createdByUserId: new ObjectId("12875455e3e2812b6e000001"),
            createdOn: new Date('2013-11-20'),
            assignedToUserId: null,
            order: 1
          }
        ]
      },
      {
        _id: new ObjectId("32875455e3e2812b6e000003"),
        name: 'Three',
        order: 3
      }
    ]
  },
  {
    _id: new ObjectId("22875455e3e2812b6e000002"),
    name: 'Board An Other',
    defaultCardTypeId: new ObjectId("72875455e3e2812b6e000004"),
    createdByUserId: new ObjectId("12875455e3e2812b6e000001"),
    createdOn: new Date('2013-11-20'),
    cardTypes: [
      {
        _id: new ObjectId("72875455e3e2812b6e000004"),
        name: 'Story',
        icon: 'book',
        pointScale: '1,2,3,5,8',
        priority: 0
      },
    ],
    lanes: [
      {
        _id: new ObjectId("32875455e3e2812b6e000004"),
        board: new ObjectId("22875455e3e2812b6e000002"),
        name: 'One',
        order: 1
      }
    ]
  }
];
