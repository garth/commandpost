var mixin = Ember.Mixin.create({
  subscriptions: {},
  privateSubscriptions: {},

  init: function () {
    this._super();

    // subscribe to channels
    this.subscriptionList = [];
    this.subscribe(this.get('subscriptions'));
    this.subscribe(this.get('privateSubscriptions'), true);
  },

  subscribe: function (subscriptions, privateSubscription) {
    var self = this;
    var subscribe = privateSubscription ? App.pubsub.subscribeToClient : App.pubsub.subscribe;
    for (var subscription in subscriptions) {
      (function (subscription) {
        self.subscriptionList.push(subscribe.call(App.pubsub, subscription, function (message) {
          subscriptions[subscription].call(self, message);
        }));
      })(subscription);
    }
  },

  unsubscribeAll: function () {
     // unsubscribe all channels
    this.subscriptionList.forEach(function (subscription) {
      subscription.cancel();
    });
    this.subscriptionList = [];
  },

  willDestroy: function () {
    this._super();
    this.unsubscribeAll();
  },
});

App.Controller = Ember.Controller.extend(mixin, {});
App.ArrayController = Ember.ArrayController.extend(mixin, {});
App.ObjectController = Ember.ObjectController.extend(mixin, {});
