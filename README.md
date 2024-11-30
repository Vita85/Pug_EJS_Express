# Integration of Pug and EJS with Express
The created project uses the PUG and EJS templating engines to dynamically create pages that display the data received from MongoDB. 

### Using PUG:
Two routers are created in the _index.js_ file.
The server returns the _/users_ and _/users/:userId_ pages using the __PUG__ templating engine. 
* _user.pug_ template - displays the user (name, password, email) details page.
* _usersList.pug_ template - displays a page with a list of users.

>By going through the specified port to the local server using the _/users_ parameter, you can get a list of all users from the database.

>By going through the specified port to the local server using the _/users/:userId_ parameter and passing the Id of a specific user, you can get the user's details from the database

Appropriate __CSS styles__ have been added to the templating engine to improve the look of the page.


### Using EJS:
Two routs have been created in the _index.js_ file.
The server returns the _/comments_ and _/comments/:commentId_ pages using the __EJS__ templating engine. 
* _comment.ejs_ template - displays the page with comment details (name, text, date)
* _commentsList.ejs_ template - displays a page with a list of comments.

>By going through the specified port to the local server using the /comments parameter, you can get a list of all comments from the database.

>By passing the /comments/:commentId parameter to the local server through the specified port and passing the Id of a specific comment, you can get the details of the comment from the database

Appropriate __CSS styles__ have been added to the templating engine to improve the look of the page.

The _.env_ file, which stores the access _keys_ to __MongoDB__, has been added to the project. 
Additionally, the _dotenv_, _express_, _ejs_, _pug_, _mongodb_ dependencies are installed in the project.

You can run the project using the _npm run express_ command in the terminal.

The project is published in the __Git__ repository. 
