var pathArray = window.location.host.split( '.' );
var pathSlash = window.location.pathname.split( '/' );
var username = pathArray[0], reponame = pathSlash[1];
var timlabel = document.getElementById("tim_label").innerHTML;
var timissue = document.getElementById("tim_issue").innerHTML;

// getURLInfo() completes immediately...
getAPI( "repos/" + username + "/" + reponame, renderTitle );
getAPI( "repos/" + username + "/" + reponame + "/issues", renderIssues );
function renderTitle(){
  var resp = JSON.parse(this.responseText);
  console.log(resp[0]);
}
function renderIssues(){
  // ...however, the callback function is invoked AFTER the response arrives
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
