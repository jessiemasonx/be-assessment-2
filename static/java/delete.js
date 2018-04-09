

var deletebutton = document.querySelector("#delete")

function sendDelete() {
  var id = this.dataset.id
  fetch("/delete/" + id, {method: "DELETE"})
  .then(onDelete)
  .then(onSucces, onError)
  // fetch says: pick up what's in the url
  // Wouter Lem helped
  // with `this` we mean the id of the button in myprofile.ejs
}

function onDelete(res) {
  return res.json()
  // you put the res object to a json file
}

function onSucces() {
  window.location = "/"
}

function onError() {
  throw new Error("Doesn't work")
}

deletebutton.addEventListener("click", sendDelete)

// do sendDelete THEN ondelete THEN onsucces and if it fails onerror
