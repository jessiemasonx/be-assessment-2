

var deletebutton = document.querySelector('#delete')

function sendDelete() {
  var id = this.dataset.id
  console.log('Dit is mijn id: ' + String(id))
  fetch('/delete/' + id, {method: 'DELETE'})
  .then(onDelete)
  .then(onSucces, onError)
  // fetch zegt: haal op wat er op de eerste url staat
  // wouter halp
  // met this spreek je de id aan uit de knop uit mijnprofiel.ejs
}

function onDelete(res) {
  return res.json()
  // je zet het res object om naar het json file
}

function onSucces() {
  console.log('Verwijderd!!')
  window.location = '/'
}

function onError() {
  throw new Error('Werkt niet. Balen man!')
}

deletebutton.addEventListener('click', sendDelete)

// doe sendDelete THEN ondelete THEN onsucces en als die faalt onerror
