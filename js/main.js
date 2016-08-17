// create function
function create (tagname, attributes, content) {
	var element = document.createElement(tagname), property;
	// element attributes
	if(typeof attributes == "object") {
		for(property in attributes) {
			if(attributes.hasOwnProperty(property)) {
				element.setAttribute(property, attributes[property]);
			}
		}
	}
	if (typeof attributes === "string") { content = attributes; }
	if (content) { element.innerHTML = content; }
	return element;
}

// Check local debug
var	loc = window.location;
if (loc.hostname == "127.0.0.1" || loc.hostname == "") loc = create('a', {href: 'https://petrosh.it/diarissues' + window.location.hash});

// Vars
var pathArray = loc.host.split( '.' ),
	pathSlash = loc.pathname.split( '/' ),
	pathHash = loc.hash.substring(2),
	path = { 'username': pathArray[0], 'reponame': pathSlash[1], 'edit_link': '', 'updated_at': '' },
	dateoptions = { year: 'numeric', month: 'long', day: 'numeric' };

// Templates
var timlabel = document.getElementById("tim_label").innerHTML,
	timissue = document.getElementById("tim_issue").innerHTML,
	postitem = document.getElementById("tim_post_list").innerHTML,
	timheader = document.getElementById("tim_header").innerHTML,
	timheaderlink = document.getElementById("tim_header_link").innerHTML,
	timfooter = document.getElementById("tim_footer").innerHTML,
	timarticlelink = document.getElementById("tim_article_link").innerHTML,
	timarticlenolink = document.getElementById("tim_article_nolink").innerHTML;

// Hash change
window.onhashchange = function() {
	window.location.reload();
};

// Homelink
function homePage(){
	window.location.href = window.location.host;
}

// Render header
function renderTitle(){
	var resp = JSON.parse(this.responseText);
	document.querySelector('body > header').innerHTML = tim(timheader, resp);
	path.updated_at = new Date(resp.updated_at).toLocaleTimeString('en-US', dateoptions);
	renderFooter();
}
function renderTitleLink(){
	var resp = JSON.parse(this.responseText);
	document.querySelector('body > header').innerHTML = tim(timheaderlink, resp);
	path.updated_at = new Date(resp.updated_at).toLocaleTimeString('en-US', dateoptions);
	renderFooter();
}

// Render footer
function renderFooter(){
	document.querySelector('footer').innerHTML = tim(timfooter, path);
}

// Render issues list
function renderIssues(){
	var resp = JSON.parse(this.responseText),
		art = create('article');
	document.getElementsByTagName("section")[0].appendChild(art);
	for (var key in resp) {
		if (resp.hasOwnProperty(key)) {

			// single issue
			var obj = resp[key];
			// console.log(obj);

			// loop labels
			var labels = '';
			if (obj.labels.length) {
				// labels += ' labeled ';
				for (var lab in obj.labels) {
					if (obj.labels.hasOwnProperty(lab)){
						labels += tim(timlabel, obj.labels[lab]);
					}
				}
			}
			obj.html_labels = labels;
			obj.timedate = new Date(obj.created_at).toLocaleDateString('en-US', dateoptions);

			// obj['html_milestone'] = tim(timmilestone, obj['milestone']);
			obj.html_headerarticle = tim(timarticlelink, obj);
			var article = tim(postitem, obj); // was timissue
			art.innerHTML += article;
		}
	}
}

// Render single issue
function renderPost(){
	var resp = JSON.parse(this.responseText);
	for (var key in resp) {
		if (resp.hasOwnProperty(key)) {

			// single issue
			var obj = resp[key];
			if ( obj.number == pathHash ){
				// loop labels
				var labels = '';
				if (obj.labels.length) {
					labels += ' labeled ';
					for (var lab in obj.labels) {
						if (obj.labels.hasOwnProperty(lab)){
							labels += tim(timlabel, obj.labels[lab]);
						}
					}
				}
				obj.html_labels = labels;
				obj.timedate = new Date(obj.created_at).toLocaleTimeString('en-US', dateoptions);
				// obj['html_milestone'] = tim(timmilestone, obj['milestone']);
				obj.html_headerarticle = tim(timarticlenolink, obj);
				var article = tim(timissue, obj);
				document.getElementsByTagName("section")[0].innerHTML += article;
			}
		}
	}
}

// Check page
if ( !pathHash ){
	// Homepage
	// getURLInfo() completes immediately...
	// Render header nolink
	getAPI( "repos/" + path.username + "/" + path.reponame, renderTitle );
	getAPI( "repos/" + path.username + "/" + path.reponame + "/issues?creator=" + path.username, renderIssues );
	// Render pagetitle
	document.querySelector('html > head > title').innerHTML = path.reponame;
}else{
	if ( !isNaN( pathHash ) ){
		// Not is Not a Number: Post
		// Render header link
		path.edit_link = '<li id="edit"><a href="https://github.com/' + path.username + '/' + path.reponame + '/issues/' + pathHash + '">Edit this Issue</a></li>';
		getAPI( "repos/" + path.username + "/" + path.reponame, renderTitleLink );
		getAPI( "repos/" + path.username + "/" + path.reponame + "/issues?creator=" + path.username, renderPost );
		// Render pagetitle
		document.querySelector('html > head > title').innerHTML = 'post';
	}else{
		pathHash = pathHash.split('');
		var term = pathHash.shift();
		if( term == '/'){
			// Search label
			pathHash = pathHash.join('');
			console.log( term, pathHash );
			getAPI( "repos/" + path.username + "/" + path.reponame, renderTitleLink );
			getAPI( "repos/" + path.username + "/" + path.reponame + "/issues?labels=" + pathHash, renderIssues );
			// Render pagetitle
			document.querySelector('html > head > title').innerHTML = 'search';
		}else{
			console.log('404');
		}
	}
}
