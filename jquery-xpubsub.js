
// jquery-xpubsub.js - a very minimal pubsub framework on top of jQuery
// contact: Chakrit Wichian (http://chakrit.net/);
(function () {

  var $ = jQuery,
    pubsubEvent = 'pubsub.xpubsub';

  function publish(target, data) {
    $(target).trigger(pubsubEvent, data);
  }

  function subscribe(target, callback) {
    $(target).bind(pubsubEvent, {}, function (e, msg) { callback(msg); });
  }

  function connect(fromChannel, toChannel, translator) {
    var trans;

    if (!translator) {
      trans = function (data) { return data; };

    } else if (typeof translator == 'function') {
      trans = function (data) { return translator(data); };

    } else if (typeof translator == 'object') {
      trans = function (data) { return $.extend(data, translator); };

    };

    subscribe(fromChannel, function (data) {
      var transData = trans(data);

      if (transData !== null && typeof (transData) !== 'undefined')
        publish(toChannel, transData);
    });
  }

  // wire up to jQuery
  $.publish = publish;
  $.subscribe = subscribe;
  $.connect = connect;

  // channel is simply any distinct object
  // used as a target for jQuery.bind and trigger
  $.newChannel = function (name) {
    return name ?
      { toString: function () { return name; } } :
      {};
  };

})();