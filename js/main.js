var pathArray = window.location.host.split( '.' );
var pathSlash = window.location.pathname.split( '/' );
var pathHash = window.location.hash.substring(2); // Drop #!
var path = { 'username': pathArray[0], 'reponame': pathSlash[1], 'number': 1 };
console.log(pathHash);
window.onhashchange = function() {
  window.location.reload();
}

// Render templates
var timlabel = document.getElementById("tim_label").innerHTML;
var timissue = document.getElementById("tim_issue").innerHTML;
var timheader = document.getElementById("tim_header").innerHTML;
var timfooter = document.getElementById("tim_footer").innerHTML;

// getURLInfo() completes immediately...
getAPI( "repos/" + path['username'] + "/" + path['reponame'], renderTitle );
getAPI( "repos/" + path['username'] + "/" + path['reponame'] + "/issues", renderIssues );
// footer
document.querySelector('footer').innerHTML = tim(timfooter, path);
// Render header
function renderTitle(){
  var resp = JSON.parse(this.responseText);
  document.querySelector('body > header').innerHTML = tim(timheader, resp);
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
        obj['reponame'] = path['reponame'];
        obj['html_labels'] = labels;
        obj['timedate'] = new Date(Date.parse(obj['created_at']));
        obj['bidate'] = new Date(obj['created_at']);
        // obj['html_milestone'] = tim(timmilestone, obj['milestone']);
        var article = tim(timissue, obj);
        document.getElementsByTagName("section")[0].innerHTML += article;
      }
    }
}
