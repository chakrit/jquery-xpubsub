
# jQuery-xPubSub

A very minimal client-side publish/subscribe system on top of jQuery.

Publish/subscribe allows greater degree of separation between components when
designing large or complex javascript application. See the `test-mvc.html`
file for an example.

Under the hood, it is just a sugar coating on top of `$.bind` and `$.trigger` 
with an additional `$.connect` that helps reduce a lot of
glue code for you. But in reality, publish/subscribe is an entirely different
mode of thought.

In large events-based system, large portion of your code will be glue code
gathering data from one component and feeding it into another anyway, so why
not make that "gathering data" and "feeding" a first-class thing and model
your component accordingly?

If you're drowing in javascript glue code, connecting one interface to another
looking up multiple files at a time just to debug one small bug, then xPubSub
might help you. Especially so if you prefer functional-style js. :)

* `channel` - Can be any valid JS object that works with the `$(obj).bind`
  function. This is best used (not required) in conjunction with the
  `$.newChannel` method below.
* `data` - Can be anything that isn't `null` or `undefined`.

This plugin provides the following methods:

* `$.publish(channel, data)`

  Publish `data` to channel `channel` if `data` is not `null` or `undefined`.

* `$.subscribe(channel, handler)`

  Subscribe to channel `channel` using handler `handler`.

  Handler should have signature: `function (data) { }` with `data` being
  the data object passed exactly as published.

* `$.connect(fromChannel, toChannel, translator)`

  Connect two channels together, so when data arrives on `fromChannel`, it is
  automatically published to `toChannel` as well.

  Optionally, a `translator` function with signature:
  `function(data) { return translatedData; }` maybe provided.
  The `data` parameter being published to the `fromChannel`. It should returns
  a translated version of `data` to be published to `toChannel`.
  
  The `translator` function may also be used as a kind of filter, by selectively
  returning `null`. Returning `null` from the `translator` function will
  prevents the message from being published to `toChannel`

* `$.newChannel(channelName)`

  Convenience method for creating new channel endpoints. This is *not* required.
  Channel endpoint can be any valid javascript object such as a simple `{}`
  which the pub/sub system can bind (using `$.bind`) events to.

