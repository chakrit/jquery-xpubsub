
$(document).ready(function () {


  // ___________________________________________________________________________
  //                                                                       MODEL
  var Model = new function () {

    var me = this,
      _searchUrl = "http://search.twitter.com/search.json?callback=?",
      _currentPage = 1;

    me.pageDeltas = $.newChannel("Model.pageDeltas");
    me.tweets = $.newChannel("Model.tweets");

    // turn incoming pageDeltas into outgoing list of tweets
    $.connect(me.pageDeltas, me.tweets, function (pageDelta) {
      return function (cont) {

        _currentPage += pageDelta;

        var query = {
          q: "jquery",
          rpp: 10,
          page: _currentPage
        };

        $.getJSON(_searchUrl, query, function (json) { cont(json.results); });
      };
    });

  };


  // ___________________________________________________________________________
  //                                                                        VIEW
  var View = new function () {

    var me = this,
      _tweetsList = $("#tweetsList"),
      _nextButton = $("#nextButton"),
      _prevButton = $("#prevButton");

    me.pageDeltas = $.newChannel("Views.pageDeltas");
    me.tweets = $.newChannel("Views.tweets");


    // publish deltas to pageDeltas channel on page changes
    _nextButton.click(function () { $.publish(me.pageDeltas, 1); });
    _prevButton.click(function () { $.publish(me.pageDeltas, -1); });

    // on incoming tweets, display them in a list
    $.subscribe(me.tweets, function (tweetsCont) {
      tweetsCont(function (tweets) {

        _tweetsList.html("");

        $(tweets).each(function () {
          $(document.createElement("li"))
            .text("@" + this.from_user + ": " + this.text)
            .appendTo(_tweetsList);
        });

      });
    });

  };


  // ___________________________________________________________________________
  //                                                               CONTROLLER(?)

  $.connect(View.pageDeltas, Model.pageDeltas);
  $.connect(Model.tweets, View.tweets);

  $.publish(Model.pageDeltas, 0);

});