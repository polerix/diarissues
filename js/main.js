var pathArray = window.location.host.split( '.' );
var pathSlash = window.location.host.split( '/' );
var username = pathArray[0];
var timlabel = document.getElementById("tim_label").innerHTML;
var timissue = document.getElementById("tim_issue").innerHTML;
console.log( pathArray );

// getURLInfo() completes immediately...
getAPI(
  "repos/" + "petrosh" + "/diarissues/issues",
  // ...however, the callback function is invoked AFTER the response arrives
  function() {
    // "this" is the XHR object here!
    var resp = JSON.parse(this.responseText);
    for (var key in resp) {
      if (resp.hasOwnProperty(key)) {
        // single issue
        var obj = resp[key];
        console.log(obj);
        // loop labels
        var labels = '';
        for (var lab in obj['labels']) {
          if (obj['labels'].hasOwnProperty(lab)){
            labels += tim(timlabel, obj['labels'][lab]);
          }
        };
        obj['html_labels'] = labels;
        obj['timedate'] = new Date(Date.parse(obj['created_at']));
        // obj['html_milestone'] = tim(timmilestone, obj['milestone']);
        var article = tim(timissue, obj);
        document.getElementsByTagName("section")[0].innerHTML += article;
      }
    }
  }
);
