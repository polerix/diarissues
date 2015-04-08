// Vars
var pathArray = window.location.host.split( '.' );
var pathSlash = window.location.pathname.split( '/' );
var pathHash = window.location.hash.substring(2); // Drop #!
console.log(pathHash);
var path = { 'username': pathArray[0], 'reponame': pathSlash[1], 'number': 1 };
var dateoptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
// Render templates
var timlabel = document.getElementById("tim_label").innerHTML;
var timissue = document.getElementById("tim_issue").innerHTML;
var timheader = document.getElementById("tim_header").innerHTML;
var timfooter = document.getElementById("tim_footer").innerHTML;

// Hash change
window.onhashchange = function() {
  window.location.reload();
}

// Preload
function load() {
  console.log("load event detected!");
}
window.onload = load;

// Render header
function renderTitle(){
  var resp = JSON.parse(this.responseText);
  document.querySelector('body > header').innerHTML = tim(timheader, resp);
}

// Render complete issues
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
          obj['labels'][lab]['reponame'] = path['reponame'];
          labels += tim(timlabel, obj['labels'][lab]);
        }
      };
      obj['reponame'] = path['reponame'];
      obj['html_labels'] = labels;
      obj['timedate'] = new Date(obj['created_at']).toLocaleTimeString('en-US', dateoptions);
      // obj['html_milestone'] = tim(timmilestone, obj['milestone']);
      var article = tim(timissue, obj);
      document.getElementsByTagName("section")[0].innerHTML += article;
    }
  }
}

// Render complete issues
function renderPost(){
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
          obj['labels'][lab]['reponame'] = path['reponame'];
          labels += tim(timlabel, obj['labels'][lab]);
        }
      };
      obj['reponame'] = path['reponame'];
      obj['html_labels'] = labels;
      obj['timedate'] = new Date(obj['created_at']).toLocaleTimeString('en-US', dateoptions);
      // obj['html_milestone'] = tim(timmilestone, obj['milestone']);
      var article = tim(timissue, obj);
      document.getElementsByTagName("section")[0].innerHTML += article;
    }
  }
}

// Render header
getAPI( "repos/" + path['username'] + "/" + path['reponame'], renderTitle );

// Check page
if ( pathHash == '' ){
  // Homepage
  // getURLInfo() completes immediately...
  getAPI( "repos/" + path['username'] + "/" + path['reponame'] + "/issues", renderIssues );
}else{
  if ( !isNaN( pathHash ) ){
    // Not is Not a Number: Post
    getAPI( "repos/" + path['username'] + "/" + path['reponame'] + "/issues", renderPost );
  }else{
    var term = pathHash.split("").shift().join('');
    console.log( term, pathHash );
  }
}

// Render footer
document.querySelector('footer').innerHTML = tim(timfooter, path);
