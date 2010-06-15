
$(function () {

  var monitor = $.newChannel("OP Monitoring Channel"),
    broadcast = $.newChannel("OP Broadcasting Channel");


  // utility functions
  function findParts(target) {
    target = $(target);

    return {
      isOpRoom: target.is('#opRoom'),
      name: $('h2', target).text(),
      list: $('ul', target),
      members: $.map($('div', target), function (mem) {
        return {
          name: $('strong', mem).text(),
          input: $('input', mem),
          sendButton: $('button', mem)
        };
      })
    };
  }

  function formatMsg(msg) {
    return "[" + msg.from + "] " + msg.msg;
  }


  // setup chat pub/sub
  function setupChat(room) {

    // send message to the channel on click
    $(room.members).each(function () {
      var me = this;

      me.sendButton.click(function () {
        $.publish(room, {
          isBroadcast: room.isOpRoom,
          from: me.name,
          msg: me.input.val()
        });
      });
    });

    // append an item to the list on incoming messages
    $.subscribe(room, function (msg) {
      $(document.createElement("li"))
        .text(formatMsg(msg))
        .appendTo(room.list);
    });

    // logs all non-op room to the monitoring channel
    // and make them receive all broadcasts
    if (!room.isOpRoom) {

      $.connect(broadcast, room);
      $.connect(room, monitor, function (msg) {
        if (msg.isBroadcast) return null; // prevents infinite loop

        msg.from = msg.from + "@" + room.name;
        return msg;
      });

    } else {

      // op can see the monitor channel and can broadcasts messages
      $.connect(monitor, room);
      $.connect(room, broadcast, function (msg) {
        return msg.isBroadcast ? msg : null; // prevents infinite loop
      });
    }
  }


  $(".chatroom").each(function () {
    setupChat(findParts(this));
  });


});