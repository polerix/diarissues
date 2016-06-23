function getAPI(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open (
    "GET",                               /* do NOT use escape() */
    "https://api.github.com/" + url,
    true
  );
  if (url.indexOf('issues') < 0) xhr.setRequestHeader('Accept', 'application/vnd.github.v3.full+json'); else xhr.setRequestHeader('Accept', 'application/vnd.github.squirrel-girl-preview.full+json');
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      // defensive check
      if (typeof callback == "function") {
        // apply() sets the meaning of "this" in the callback
        callback.apply(xhr);
      }
    }
  };
  // send the request *after* the event handler is defined
  xhr.send();
}
