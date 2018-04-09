"use strict"

console.log("server is starting!")


// require the packages
var express = require("express")
var multer = require("multer")
var upload = multer({
  dest: "static/styles/images/uploads/" // the folder where the uploaded images go
})
var ejs = require("ejs")
var app = express()
var bodyParser = require("body-parser") //  a plugin for express
// that is used to read the values of the form more easily
var mysql = require("mysql")
var session = require("express-session")
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "datingsite"
})
connection.connect() // connects to mysql

app.set("view engine", "ejs")
app.set("views", "views")
app.use(express.static("static")) // static folder
// browsers use urlencoded to send forms
app.use(bodyParser.urlencoded({
  extended: true
}))
// the key that will be used for the encryption of all the cookies
// resave saves the cookies everytime. If it is true, it wil overwrite,
// If that is false, than it won't overwrite all the time
// Otherwise you've had a lot of data traffic, and now you don't
// saveUninitialized = makes sure that there are no unnecessary sessions
// False = only when a user logs in you want a session
// true = unnecessary sessions
// source: Wouter Lem
app.use(session({
  secret: "hoihoi",
  resave: false,
  saveUninitialized: false
}))

// with app.get you get something back
// All the routes will be typed like this: localhost:3000/route
// So if you type that in your browser, you will use an app.get('/route', ...)
// When something like that happens, a function after the route will be executed,
// the function after the route so: app.get('/form', hoi)
// app.post sends something away
app.post("/portal", handleLogin)
app.post("/chat", saveMessage) // zet bericht in de database
app.post("/register", upload.single("img"), register) // zet ingevulde gegevens in database
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
app.listen(3000) // listen on port 3000

// this function is invoked when the server starts
function home(req, res) {
  console.log("listening...")
  var id = req.params.id
  // select everything from the tabel accounts
  connection.query("SELECT * FROM accounts", function(err, data) {
    // locals contains all the local variables that we give to a templatc
    // the req.session shows us who is logged in
    // the var locals part is from Wouter Lem. This is used often.
    var locals = {
      data: data,
      session: req.session
    }
    res.render("index.ejs", locals) // go to the home page, with the data from locals behind it
  })
}

// this function is invoked when someone goes to the sign up page
function signup(req, res) {
  var id = req.params.id
  // from the request you get the parameters and from there the id
  // select everything from the table accounts
  connection.query("SELECT * FROM accounts", function(err, data) {
    // if there's an error
    if (err) {
        console.log("Error: ", err)
        return res.status(404).render("error.ejs", { // go to error.ejs
          id: 404,
          description: "page not found",
          map: "../"
        })
    } else {
    var locals = {
      data: data,
      session: req.session
    }
    res.render("signup.ejs", locals) // go to the signup page, with the data from locals behind it
  }})
}

// this function is invoked when someone submits the signup form
// I used https://github.com/cmda-be/course-17-18/blob/master/examples/mysql-server/index.js
// I also used a conversation in slack in #backend
function register(req, res) {
  // you're inserting all these inputs from the form into the table
  connection.query("INSERT INTO accounts SET ?", {
    img: req.file ? req.file.filename : null,
    email: req.body.email,
    name: req.body.name,
    place: req.body.place,
    gender: req.body.gender,
    age: req.body.age,
    type: req.body.type,
    password: req.body.password,
  }, done) // after this, invoke function done

// if there's an error, render error.ejs
// if there's not, redirect to /login
  function done(err, data) {
    if (err) {
      console.log("Error: ", err)
      return res.status(404).render("error.ejs", {
        id: 404,
        description: "page not found",
        map: "../"
      })
    } else {
      res.redirect("/login")
    }
  }
}

// this function is invoked when the user goes to the login page
function login(req, res) {
  var id = req.params.id
  connection.query("SELECT * FROM accounts", onDone)
  // select everything from the table accounts, after that invoke function onDone

  // if there is an error
  function onDone(err, data) {
    // this makes sure you will also go to error.ejs if there is no data, so if nothing is filled in in the form
    // creds to Wouter Lem
    if (err || data.length === 0) {
      // acount niet gevonden
      console.log("Error: ", err)
      return res.status(404).render("error.ejs", { // render error.ejs
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

// this function is invoked when the user submits the login form
function handleLogin(req, res, err) {
  var body = Object.assign({}, req.body) // zet alles uit de form in een object
  var user // declare var user but don't give it a value
  connection.query("SELECT * FROM accounts WHERE email = ?", body.email, function(err, users) {
  // select row from table accounts where the email is the same as the email filled in in the form
    var user = users[0] // all found users in var user
    // now it's just 1 user in var users because there's just 1 user that has that email
    if (user && user.password === body.password) {
      // if the user exists AND users' filled in password is the same as the one from the table
      req.session.loggedIn = true // user is logged in
      req.session.user = user // the user that just logged in is the req.session.user
      res.redirect("/matches") // go to /matches
    } else { // if the filled in things weren't right
      console.log(err)
      return res.status(404).render("error.ejs", { // go to error.ejs
        id: 404,
        description: "Not found",
        map: "../"
      })
    }
  })
}

// this function is invoked when someone goes to the matches page
function matches(req, res, users) {
  var user = users[0]
  // if logged in user likes female
  if (req.session.user.type == "female") {
    // show everyone with gender female
    connection.query("SELECT * FROM accounts WHERE gender = 'female'", onDone)
  } else {
    // show everyone with gender male
    connection.query("SELECT * FROM accounts WHERE gender = 'male'", onDone)
  }

  function onDone(err, data) {
    if (err) { // if there's an error
      console.log("Error: ", err)
      return res.status(404).render("error.ejs")
    } else {
      var locals = {
        data: data,
        session: req.session
      }
      res.render("matches.ejs", locals) // go to matches.ejs
    }
  }
}

// this function is invoked when the user goes to his own profile
function renderMyProfile(req, res) {
  var id = req.params.id
  // from the request you get the parameters and from there the id
  connection.query("SELECT * FROM accounts WHERE id = ?", id, onDone)
  // select everyone where the id is the same as the users' id
  function onDone(err, data) {
    if (err || data.length === 0) { // if there's an error or if there's no data
      // account not found
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
      res.render("myprofile.ejs", locals) // go to myprofile.ejs
    }
  }
}

// this function is invoked when someone goes to his matches' profile
// source: Nina van Bergen and Albert
function renderProfile(req, res) {
  var id = req.params.id
  // select everything from the row of the logged in user
  connection.query("SELECT * FROM accounts WHERE id = ?", id, onDone)

  function onDone(err, users) {
    var user = users[0] // select all users
    // select me and other
    // We want to see our message, but also the message that has been send back to us
    // That means that we need to specify them twice in order to make that work
    // But because we want one where the logged in user sends them,
    // you need to start with req.session.user.id and then req.params.id
    // And we also want one where the other person sends a message,
    // so then you need to begin with req.params.id and after that req.session.user.id
    connection.query("SELECT * FROM messages WHERE me = ? AND other = ? OR me = ? AND other = ?", [req.session.user.id,
        req.params.id,
        req.params.id,
        req.session.user.id
      ],
      function(err, messages) {
        if (err) { // there's an error
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
        res.render("profile.ejs", locals) // go to profile.ejs
      })
  }
}

// this function is invoked when someone sends a message
function saveMessage(req, res) {
  // put the filled in things from the form in var body and make it an object
  var body = Object.assign({}, req.body)
  // insert the filled in things into the table messages
  connection.query("INSERT INTO messages SET ?", {
    chatting: req.body.chatting,
    me: req.body.me,
    other: req.body.other,
  }, done)

  function done(err, data) {
    if (err) { // if there's an error
      console.log(err)
      return res.status(404).render("error.ejs", {
        id: 404,
        description: err,
        map: "../"
      })
    } else {
      res.redirect("/profile/" + body.other) // go to profile of the 'other' person
    }
  }
}

// this function is invoked when someone opens the first signup question
function start(req, res) {
  var id = req.params.id
  // select everyone from accounts tabel
  connection.query("SELECT * FROM accounts", function(err, data) {
    var locals = {
      data: data,
      session: req.session
    }
    res.render("start.ejs", locals)
  })
}

// this function is invoked when someone opens the second signup question
function artist(req, res) {
  var id = req.params.id
  // select everyone from accounts tabel
  connection.query("SELECT * FROM accounts", function(err, data) {
    var locals = {
      data: data,
      session: req.session
    }
    res.render("artist.ejs", locals)
  })
}

// this function is invoked when someone opens the third signup question
function album(req, res) {
  // select everyone from accounts tabel
  connection.query("SELECT * FROM accounts", function(err, data) {
    var locals = {
      data: data,
      session: req.session
    }
    res.render("album.ejs", locals)
  })
}

// this function is invoked when someone clicks on 'logout'
function logout(req, res) {
  if (req.session) { // if you're still in the session, still logged in
    req.session.destroy(function(err) { // destroy the session, log out
      if (err) { // if error
        return res.status(404).render("error.ejs", { // go to 404
          id: 404,
          description: err,
          map: "../"
        })
      } else {
        return res.redirect("/") // else, go to home
      }
    })
  }
}

// this function is invoked when someone clicks on 'delete account'
function deleteAccount(req, res) {
  var id = req.params.id
  connection.query("DELETE FROM accounts WHERE id = ?", id, function(err, users) {
    // delete the row of the id of the person who's logged in
    if (err) throw err
  })
}

// this function is invoked when someone opens the 'update account' page
function updatePage(req, res) {
  var id = req.params.id
  // select whole tabel accounts
  connection.query("SELECT * FROM accounts", function(err, data) {
    var locals = {
      data: data,
      session: req.session
    }
    res.render("update.ejs", locals) // go to update.ejs
  })
}

// this function is invoked when someone submits 'update account' form
function update(req, res) {
  var id = req.params.id // id of logged in person
  var body = req.body // everything from the form
  connection.query("UPDATE accounts SET name = ?, email = ?, age = ?, gender = ?, password = ?, type = ?, place = ? WHERE id = ?", [body.name, body.email, body.age, body.gender, body.password, body.type, body.place, id], done)
// update all these things WHERE the id is the same as the logged in users' id
  function done(err, data) {
    if (err) { // if there's an error
      return res.status(404).render("error.ejs", { // go to error.ejs
          id: 404,
          description: "Niet gevonden.",
          map: "../"
        })
      }
      console.log("Inserted!")
      var locals = {
        data: data,
        session: req.session
      }
      res.redirect("/myprofile/" + req.session.user.id) // go to my profile
    }
  }
