# be-assessment-2 
# HeartBeat 💜

This is an application for anyone with the age between 18 and 30 who is looking for someone to spend the rest of his/her life with. HeartBeat focuses on someone's taste in music. In that way you can find someone who shares the same interests musically and the rest will follow. 

<img src="https://github.com/jessiemasonx/images/blob/master/home.png" width="250"> <img src="https://github.com/jessiemasonx/images/blob/master/genre.png" width="250">

- [Description](https://github.com/jessiemasonx/be-assessment-2/blob/master/README.md#description)
- [How to install](https://github.com/jessiemasonx/be-assessment-2/blob/master/README.md#how-to-install)
- [Start Server](https://github.com/jessiemasonx/be-assessment-2/blob/master/README.md#start-server)
- [Structure]()
- [Database]()
- [To Do List]()
- [Personal Opinion]()

## Description

As I mentioned before, HeartBeat is an application for anyone with the age between 18 and 30 who is looking for someone to spend the rest of his/her life with, and it focuses on someone's taste in music. While that's been said, let's take a look at every page of the website and see what you can do there. I'll give you a little tour around.

Ofcourse, the first thing you see is the home page. On this page the user will get a short introduction about the website and hopefully this will trigger the user to sign up. Or login if he/she already has an account. 

    afbeelding home page, afbeelding login naast elkaar
    
If the user decides to sing up, these are the pages he'll have to go through. The first 3 pages are questions about music, and on the last page the user puts the general information. After finishing these steps the user has signed up and the account is made.

    afbeelding 1e vraag, 2e vraag, 3e vraag en inschrijf formulier



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




  
