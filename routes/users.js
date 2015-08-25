var express = require('express');
var router = express.Router();
var express = require('express'),
    router = express.Router(),
    mysql = require('mysql'), //mysql connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'test'
});
router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}));

/* GET users listing. */
//build the REST operations at the base for blobs
//this will be accessible from http://127.0.0.1:3000/blobs if the default route for / is left unchanged
router.route('/')
    //GET all blobs
    .get(function(req, res, next) {
        //retrieve all users from users table

		connection.query('SELECT * from users', function(err, rows, fields) {
		  if (err) {
                  return console.error(err);
              } else {
              	  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/blobs folder. We are also setting "blobs" to be an accessible variable in our jade view
                    html: function(){
                        res.render('users/index', {
                              title: 'All Users',
                              "users" : rows
                          });
                    },
                    //JSON response will show all blobs in JSON format
                    json: function(){
                        res.json(rows);
                    }
                });
              }
		});


    });
    //POST a new users
router.post('/adduser',function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var email = req.body.email;
        var password = req.body.password;
        var post =  {
        	email : email,
        	password : password
        };

       connection.query("INSERT INTO `users` SET ?",post,function(err){
       		if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("users");
                        // And forward to success page
                        res.redirect("/users");
                    },
                    //JSON response will show the newly created blob
                    json: function(){
                        res.json(post);
                    }
                });
              }
       });

       
    });

/* GET New Blob page. */
router.get('/new', function(req, res) {
    res.render('users/new', { title: 'Add New User' });
});

//DELETE a user by ID
router.delete('/:id', function (req, res){

    connection.query("DELETE FROM `users` WHERE id = '"+req.params.id+"'", function (err,result) {
        if (err) {
            return console.error(err);
        } else {

                    //Returning success messages saying it was deleted

                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                               res.redirect("/users");
                               //console.log(req);
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json({message : 'deleted',
                                   item : result
                               });
                         }
                      });
                
            
        }
    });
});

router.get('/:id/edit', function (req, res){

    connection.query("SELECT * FROM `users` WHERE id = '"+req.params.id+"'", function (err,row,result) {
        if (err) {
            return console.error(err);
        } else {

                    //Returning success messages saying it was deleted

                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                            res.render('users/edit', {
                              title: 'Edit User',
                              "user" : row[0]
                          });
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json(row);
                         }
                      });
                
            
        }
    });
})
.post('/:id/edit', function (req, res){
        var email = req.body.email;
        var password = req.body.password;
        var post =  {
          email : email,
          password : password
        };
    connection.query("UPDATE `users` SET ? WHERE id = '"+req.params.id+"'",post, function (err,result) {
        if (err) {
            return console.error(err);
        } else {

                    //Returning success messages saying it was deleted

                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                            res.redirect("/users");
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json(result);
                         }
                      });
                
            
        }
    });
});

router.get('/:id/view', function (req, res){

    connection.query("SELECT * FROM `users` WHERE id = '"+req.params.id+"'", function (err,row,result) {
        if (err) {
            return console.error(err);
        } else {
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                            res.render('users/show', {
                              title: 'Show User',
                              "user" : row[0]
                          });
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json(row[0]);
                         }
                      });
                
            
        }
    });
});

module.exports = router;
