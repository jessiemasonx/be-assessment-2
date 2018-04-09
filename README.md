# be-assessment-2
# HeartBeat 💜

This is an application for anyone with the age between 18 and 30 who is looking for someone to spend the rest of his/her life with. HeartBeat focuses on someone's taste in music. In that way you can find someone who shares the same interests musically and the rest will follow.

<img src="https://github.com/jessiemasonx/images/blob/master/home.png" width="250"> <img src="https://github.com/jessiemasonx/images/blob/master/genre.png" width="250">

- [Description](https://github.com/jessiemasonx/be-assessment-2/blob/master/README.md#description)
- [How to install](https://github.com/jessiemasonx/be-assessment-2/blob/master/README.md#how-to-install)
- [Start Server](https://github.com/jessiemasonx/be-assessment-2/blob/master/README.md#start-server)
- [Structure](https://github.com/jessiemasonx/be-assessment-2/blob/master/README.md#structure)
- [Database](https://github.com/jessiemasonx/be-assessment-2/blob/master/README.md#database)
- [To Do List](https://github.com/jessiemasonx/be-assessment-2/blob/master/README.md#to-do-list)

## Description

As I mentioned before, HeartBeat is an application for anyone with the age between 18 and 30 who is looking for someone to spend the rest of his/her life with, and it focuses on someone's taste in music. While that's been said, let's take a look at every page of the website and see what you can do there. I'll give you a little tour around.

Ofcourse, the first thing you see is the home page. On this page the user will get a short introduction about the website and hopefully this will trigger the user to sign up. Or login if he/she already has an account.

   <img src="https://github.com/jessiemasonx/images/blob/master/home.png" width="250"> <img src="https://github.com/jessiemasonx/images/blob/master/login.png" width="250">

If the user decides to sign up, these are the pages he'll have to go through. The first 3 pages are questions about music, and on the last page the user puts the general information. After finishing these steps the user has signed up and the account is made.

<img src="https://github.com/jessiemasonx/images/blob/master/genre.png" width="210"> <img src="https://github.com/jessiemasonx/images/blob/master/artiest.png" width="210"> <img src="https://github.com/jessiemasonx/images/blob/master/album.png" width="210"> <img src="https://github.com/jessiemasonx/images/blob/master/signup.png" width="210">

After this, the user has made an account. Yay! The user will then login to his account, and go to the page where he can see all his matches. This is a list of people who 'match' with your interests. From there you can go and take a look at someone's account. __Important:__ you won't be able to see someone's profile picture until you've been talking to them for a couple of days. A little notification about that pops up on the matches page so the user knows. From the matches page the user can take a look at their profiles and send them a message.

<img src="https://github.com/jessiemasonx/images/blob/master/matchespopup.png" width="250"> <img src="https://github.com/jessiemasonx/images/blob/master/matches.png" width="250"> <img src="https://github.com/jessiemasonx/images/blob/master/match.png" width="246">

By pressing the 'mijn profiel' button, the user can view his own profile. If the user isn't happy about his profile, or just wants to change it, he or she can do this by pressing the 'wijzig profiel'. You can also delete your account by pressing 'verwijder mijn profiel'.

<img src="https://github.com/jessiemasonx/images/blob/master/mijnprofiel.png" width="250">

## How to install

To install it, you will need to follow a few steps.

__- Clone it onto your computer.__  
First you want to change directory *in your terminal*, to the folder where you want to install the application.  
You can do so by running `cd` with the folder, in your terminal. For example:  
```cd server``` (if the folder is called *server*)

After this you want the clone the repository. You can doing by running the following command in your terminal:
```
clone https://github.com/jessiemasonx/be-assessment-2.git
```

__- Download extra's.__  
If you don't have [node](https://github.com/cmda-be/course-17-18/blob/master/week-2.md#node) installed, install it.  
To make a package.json file you have to run the following in your terminal:
```
npm init
```
You will need to install the following __packages__ by running the `npm install` command in your terminal:
* [Express](https://github.com/expressjs/express)
* [EJS](https://github.com/tj/ejs)
* [Body Parser](https://github.com/expressjs/body-parser)
* [Multer](https://github.com/expressjs/multer)
* [MySQL](https://github.com/mysqljs/mysql)
* [Express Session](https://github.com/expressjs/session)

After this you will be able to see what packages you installed in your package.json file.

## Start server
Now you're able to start the server. Do this by running the following command:  
```
node index.js
```

## Structure
index.js is the main file of the project. This contains all the main code. Like the code that makes the server and the functions for every page. This file keeps everything together.

### Folders
There are also 2 folders in the main directory. These are views and static. __views__ contains all the ejs templates for every page. __static__ contains static files like css files and images. These are the files that don't change. That's why they're called static.

### index.js structure
The index.js file consists of variables, express requests, and a lot of functions. In that order. I'll show you some of the code I used and why I used it.

```js
var express = express("ejs")
var ejs = require("ejs")
```

The code above is how I required the packages I used and put them in a var. In this way, instead of having to pick up the packages every time you use them, you can just pick them up once and use them over and over.

Under here you see a post request and a get request. The post request is used when someone signs up, so the user __posts__ something. The get request is used when the user wants to __get__ something from the page. `/start` is the route where the user goes. `start` behind that is the function that will be invoked when this happens.
```js
app.post("/register", upload.single('img'), register)
app.get("/start", start)
```

The code underneath is the what the function start looks like. This is a very simple function. All it does is it takes you to the start page.
```js
function start(req, res) {
  res.render("start.ejs")
}
```

## Database
I used the [mySQL](https://github.com/cmda-be/course-17-18/blob/master/examples/mysql-server) database.  

### How it works
How to install mySQL:
- Install Homebrew
- brew update
- brew install mysql
- Make a connection in your server.js with MySQL

Log in to your own table:
```
mysql -u your-username -p
```
Once mySQL is up and running, you can make your table.
Do this by running the following in your command line:
```
CREATE TABLE IF NOT EXISTS tablename (
  column1 INT NOT NULL AUTO_INCREMENT,
  column2 TEXT CHARACTER SET utf8,
  column3 TEXT CHARACTER SET utf8,
  column4 TEXT CHARACTER SET utf8,
  column5 TEXT CHARACTER SET utf8,
  PRIMARY KEY (id)
);
```

Add a row:
```
INSERT INTO tablename (title, plot, description) VALUES (
  'Evil Dead',
  'Five friends travel to a cabin in …',
  'Five friends head to a remote cabin, …'
);
```

Add a column:
```
 ALTER TABLE tablename
 ADD type BLOB;
 ```

Edit the table:
```
UPDATE tablename SET column = 'data' WHERE column= 'data';
```

See the table:
```
SELECT * FROM tablename
```

### My tables
I have 2 tables in my database. The first one is called accounts and the second one is called messages.

The __accounts__ table contains all the users.  

| id | name | age | place | email | password | gender | type | img |
|----|--------------|-----|-----------|--------------------|--------------|--------|--------|------|
| 1 | Tim Bosch | 22 | Utrecht | tim@hoi.nl | timbosch | male | female | NULL |
| 2 | Jos Baars | 28 | Friesland | jos@hoi.nl | josbaars11 | male | female | NULL |
| 3 | Jessie Mason | 23 | Groningen | jessiemason@hoi.nl | jessiemason2 | female | male | NULL |

The __message__ table contains the messages people send to eachother.  

| id | chatting | me | other |
|----|-------------------|----|-------|
| 1 | Hey!! | 4 | 7 |
| 2 | Hey, how are you? | 7 | 4 |
| 3 | Fine thanks! | 4 | 7 |

## To Do List

Here you can see all my plans I had before I started the project, and which of these plans I fulfilled.

- [x] Let user login, logout
- [x] Let user sign up
- [x] Let user delete and edit account
- [x] Let user filter the matches on a preference
- [x] Use consistency
- [x] Add a readme.md
- [x] Make a repository on github and put everything in it
- [x] Add a database and tables
- [x] Add a license
- [ ] Hash passwords

## License
[MIT](https://github.com/jessiemasonx/be-assessment-2/blob/master/LICENSE)

  
