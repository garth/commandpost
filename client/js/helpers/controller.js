var mixin = Ember.Mixin.create({
  subscriptions: {},
  privateSubscriptions: {},

  init: function () {
    this._super();

    var self = this;
    this.subscriptionList = [];

    // subscribe to public channels
    var subscriptions = this.get('subscriptions');
    for (var sub in subscriptions) {
      (function (sub) {
        self.subscriptionList.push(App.pubsub.subscribe(sub, function (message) {
          subscriptions[sub].call(self, message);
        }));
      })(sub);
    }

    // subscribe to private channels
    var privateSubscriptions = this.get('privateSubscriptions');
    for (var privateSub in privateSubscriptions) {
      (function (privateSub) {
        self.subscriptionList.push(App.pubsub.subscribeToClient(privateSub, function (message) {
          privateSubscriptions[privateSub].call(self, message);
        }));
      })(privateSub);
    }
  },

  willDestroy: function () {
    this._super();

    // unsubscribe all channels
    this.subscriptionList.forEach(function (subscription) {
      subscription.cancel();
    });
  },
});

App.Controller = Ember.Controller.extend(mixin, {});
App.ArrayController = Ember.ArrayController.extend(mixin, {});
