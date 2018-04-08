"use strict"

console.log("server is starting!")

var express = require("express")
var multer = require("multer")
var upload = multer({
  dest: 'static/styles/images/uploads/'
})
var ejs = require("ejs")
var app = express()
// body-parser is een plugin voor express
// waarmee je de waarde van het formulier makkelijker kan lezen
var bodyParser = require("body-parser")
var mysql = require("mysql")
var session = require("express-session")
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "datingsite"
})
connection.connect()
app.set("view engine", "ejs")
app.set("views", "views")
app.use(express.static("static"))
// browsers use urlencoded to send forms
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(session({
  secret: "hoihoi",
  resave: false,
  saveUninitialized: false
}))
app.post("/portal", handleLogin)
app.post("/chat", saveMessage) // zet bericht in de database
app.post("/register", upload.single('img'), register) // zet ingevulde gegevens in database
// app.post('/img', upload.single('img'), addImg)
app.post("/update/:id", update) // zet veranderde gegevens in database
app.get("/logout", logout)
app.delete("/delete/:id", deleteAccount)
app.get("/", home)
app.get("/profile/:id", renderProfile)
app.get("/myprofile/:id", renderMyProfile)
app.get("/start", start)
app.get("/matches", matches)
app.get("/artist", artist)
app.get("/album", album)
app.get("/signup", signup)
app.get("/updatePage", updatePage)
app.get("/login", login)
app.listen(3000)

// de functie die begint als de server wordt opgestart
function home(req, res) {
  console.log("listening...")
  var id = req.params.id
  // selecteer alles uit de tabel accounts
  connection.query("SELECT * FROM accounts", function(err, data) {
    var locals = {
      data: data,
      session: req.session
    }
    res.render("index.ejs", locals)
  })
}


function handleLogin(req, res, err) {
  var body = Object.assign({}, req.body) // zet alles uit de form in een object
  var user
  connection.query("SELECT * FROM accounts WHERE email = ?", body.email, function(err, users) {
    var user = users[0]
    if (user && user.password === body.password) {
      // dit gebeurt als alles correct is
      req.session.loggedIn = true
      req.session.user = user
      res.redirect("/matches")
    } else {
      console.log(err)
      return res.status(404).render("error.ejs", {
        id: 404,
        description: "Not found",
        map: "../"
      })
    }
  })
}


// als je naar profiel van match gaat
function renderProfile(req, res) {
  // je zet de id van de ingelogde gebruiker in var id
  var id = req.params.id
  // selecteer alles uit de rij van de persoon die ingelogd is
  connection.query("SELECT * FROM accounts WHERE id = ?", id, onDone)

  function onDone(err, users) {
    var user = users[0]
    connection.query("SELECT * FROM messages WHERE me = ? AND other = ? OR me = ? AND other = ?", [req.session.user.id, req.params.id, req.params.id, req.session.user.id], function(err, messages) {
      if (err) {
        console.log(err)
        return res.status(404).render("error.ejs", {
          id: 404,
          description: "Niet gevonden.",
          map: "../"
        })
      }
      var locals = {
        data: user,
        messages: messages,
        session: req.session
      }
      res.render("profiel.ejs", locals)
    })
  }
}

// als je naar je eigen profiel gaat
function renderMyProfile(req, res) {
  var id = req.params.id
  connection.query("SELECT * FROM accounts WHERE id = ?", id, onDone)

  function onDone(err, data) {
    console.log(data)
    if (err || data.length === 0) {
      // account niet gevonden
      console.log("Error: ", err)
      return res.status(404).render("error.ejs", {
        id: 404,
        description: "page not found",
        map: "../"
      })
    } else {
      var user = data[0]
      var locals = {
        data: user,
        session: req.session
      }
      res.render("mijnprofiel.ejs", locals)
    }
  }
}

function matches(req, res, users) {
  var user = users[0]
  console.log("filter matches")
  if (req.session.user.type == "female") {
    // selecteer iedereen met gender female
    connection.query("SELECT * FROM accounts WHERE gender = 'female'", onDone)
  } else {
    // selecteer iedereen met gender male
    connection.query("SELECT * FROM accounts WHERE gender = 'male'", onDone)
  }

  function onDone(err, data) {
    if (err) {
      console.log("Error: ", err)
      return res.status(404).render("error.ejs")
    } else {
      console.log(data)
      var locals = {
        data: data,
        session: req.session
      }
      res.render("matches.ejs", locals)
    }
  }
}

function saveMessage(req, res) {
  var body = Object.assign({}, req.body)
  connection.query("INSERT INTO messages SET ?", {
    chatting: req.body.chatting,
    me: req.body.me,
    other: req.body.other,
  }, done)

  function done(err, data) {
    if (err) {
      console.log(err)
      return res.status(404).render("error.ejs", {
        id: 404,
        description: err,
        map: "../"
      })
    } else {
      res.redirect("/profile/" + body.other)
    }
  }
}

function start(req, res) {
  res.render("start.ejs")
}

function artist(req, res) {
  res.render("artiest.ejs")
}

function album(req, res) {
  res.render("album.ejs")
}

function signup(req, res) {
  // res.render("inschrijven.ejs")
  var id = req.params.id
  // selecteer alles uit de tabel accounts
  connection.query("SELECT * FROM accounts", function(err, data) {
    var locals = {
      data: data,
      session: req.session
    }
    res.render("inschrijven.ejs", locals)
  })

}

function login(req, res) {

  var id = req.params.id
  connection.query("SELECT * FROM accounts", onDone)

  function onDone(err, data) {
    if (err || data.length === 0) {
      // acount niet gevonden
      console.log("Error: ", err)
      return res.status(404).render("error.ejs", {
        id: 404,
        description: "page not found",
        map: "../"
      })
    } else {
      var locals = {
        data: data,
        session: req.session
      }
      res.render("login.ejs", locals)
    }
  }
}

function logout(req, res) {
  if (req.session) { // als je nog in de sessie zit
    req.session.destroy(function(err) { // destroy die sessie
      if (err) { // als je een error hebt
        return res.status(404).render("error.ejs", { // ga naar 404 pagina
          id: 404,
          description: err,
          map: "../"
        })
      } else {
        return res.redirect("/") // anders, geen error, ga naar home
      }
    })
  }
}

function deleteAccount(req, res) {
  var id = req.params.id
  // je zet de id van een gebruiker in deze var id
  // wat je achter de / zet in de browser haalt ie op en dat zet je dan in var id
  connection.query("DELETE FROM accounts WHERE id = ?", id, function(err, users) {
    // verwijder de row met het id waar je nu mee ingelogd bent
    // if (err) throw err
  })
}

function register (req, res, next){
  connection.query('INSERT INTO accounts SET ?', {
      img: req.file ? req.file.filename : null,
      email: req.body.email,
      name: req.body.name,
      place: req.body.place,
      gender: req.body.gender,
      age: req.body.age,
      type: req.body.type,
      password: req.body.password,
    }, done)

    function done(err, data) {
      if (err) {
        next(err)
      } else {
        res.redirect('/login')
      }
    }
  }



function updatePage(req, res) {
  console.log("open update.ejs")
  var id = req.params.id
  connection.query("SELECT * FROM accounts", function(err, data) {
    var locals = {
      data: data,
      session: req.session
    }
    res.render("update.ejs", locals)
  })
}

function update(req, res) {
  var id = req.params.id
  var body = req.body
  connection.query("UPDATE accounts SET name = ?, email = ?, age = ?, gender = ?, password = ?, type = ?, place = ? WHERE id = ?", [body.name, body.email, body.age, body.gender, body.password, body.type, body.place, id], done)

  function done(err, data) {
    if (err) throw err
    console.log("Inserted!")
    var locals = {
      data: data,
      session: req.session
    }
    res.redirect("/myprofile/" + req.session.user.id)
  }
}
