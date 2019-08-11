var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var mysql = require('mysql');

// var con = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'wyt920403',
//     database: 'ECOMMERCE'
// });

var con = mysql.createConnection({
    host: 'database-1.cs1o4f3tbdoq.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'wyt920403',
    database: 'ECOMMERCE'
});

var app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.get('/index.html', function(req, res){
    res.json({message:'OK'});
});

// app.get('/', function(request, response) {
// 	response.sendFile(path.join(__dirname + '/login_page.html'));
// });
app.post('/registerUser', function(req, res){
    var fname = req.body.fname;
    var lname = req.body.lname;
    var address = req.body.address;
    var city = req.body.city;
    var state = req.body.state;
    var zip = req.body.zip;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    console.log("registerUser");
    console.log(fname);

    if(fname && lname && address && city && state && zip && email && username && password){
        con.query('INSERT INTO user_info (fname,lname,address,city,state,zip,email,username,password)\
        VALUES (?,?,?,?,?,?,?,?,?)',
        [fname, lname, address, city, state, zip, email, username, password],function(error, results, fields){
            if(error){
                res.json({message:'The input you provided is not valid'});

            }else{
                res.json({message:fname + ' was registered successfully'});
            }
        });
    }else{
        res.json({message:'The input you provided is not valid'});
    }
});


app.post('/login', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    console.log("login");
    console.log("username");
    if(username && password){
        con.query('SELECT * FROM user_info WHERE username = ? AND password = ? ',
        [username, password], function(error, results, fields){
            if(results.length>0){
                req.session.loggedin = true;
                req.session.username = results[0].username;
                if(username == 'jadmin'){
                    req.session.isadmin = true;
                }else{
                    req.session.isadmin = false;
                }
                res.json({message:'Welcome ' + results[0].fname});
            }else{
                res.json({message:'There seems to be an issue with the username/password combination that you entered'});
            }
        });
    }else{
        res.json({message:'There seems to be an issue with the username/password combination that you entered'});
        // res.end();
    }
});

app.post('/logout', function(req, res){
    console.log("logout");

    if(req.session.loggedin){
        req.session.loggedin = false;
        // req.session.destroy();
        res.json({message:'You have been successfully logged out'});
    }else{
        res.json({message:'You are not currently logged in'});
    }


});

app.post('/updateInfo', function(req, res){
    var fname = req.body.fname;
    var lname = req.body.lname;
    var address = req.body.address;
    var city = req.body.city;
    var state = req.body.state;
    var zip = req.body.zip;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var paraList = [fname, lname, address, city, state, zip, email, username, password];
    var paraName = ['fname', 'lname', 'address', 'city', 'state', 'zip', 'email', 'username','password'];
    console.log("updateInfo");
    if(req.session.loggedin){
        // if(username != req.session.username){
        //     res.json({message:'The input you provided is not valid'});
        // }else{
            for(var i=0; i<paraList.length;i++){
                if(paraList[i]&& paraList[i].length>0){
                    con.query('UPDATE user_info SET '+paraName[i]+' = ? WHERE username = ?',
                    [paraList[i], req.session.username], function(error, results, fields){
                        if(error){
                            res.json({message:'The input you provided is not valid'});
                        }
                    });
                }
            }
            if(username && username.length>0){
                req.session.username = username;
            }
            console.log(req.session.username);
            con.query('SELECT * FROM user_info WHERE username = ?',
            [req.session.username], function(error, results, fields){
                if(results.length>0){
                    res.json({message:results[0].fname + ' your information was successfully updated'});
                }else{
                    res.json({message:'The input you provided is not valid'});
                }
            });

        // }
    }else{
        res.json({message:'You are not currently logged in'});
    }
    
});

app.post('/addProducts', function(req, res){
    var asin = req.body.asin;
    var productName = req.body.productName;
    var productDescription = req.body.productDescription;
    var group = req.body.group;

    console.log("addProducts");
    console.log(group);

    if(req.session.loggedin){
        if(req.session.isadmin){
            if(asin && productName && productDescription && group){
                con.query('INSERT INTO product_table (asin,productName,productDescription,groupName)\
                VALUES (?,?,?,?)',
                [asin, productName, productDescription, group],function(error, results, fields){
                    if(error){
                        res.json({message: productName + ' was successfully added to the system'});

                    }else{
                        res.json({message: productName + ' was successfully added to the system'});
                    }
                });
            }else{
                res.json({message:'The input you provided is not valid'});
            }
        }
        else{
            res.json({message:'You must be an admin to perform this action'});
        }
    }else{
        res.json({message:'You are not currently logged in'});
    }
});

app.post('/modifyProduct', function(req, res){
    var asin = req.body.asin;
    var productName = req.body.productName;
    var productDescription = req.body.productDescription;
    var group = req.body.group;
    var paraList = [productName, productDescription, group];
    console.log("addProducts");
    var paraName = ['productName', 'productDescription', 'groupName'];
        if(req.session.loggedin){
        if(req.session.isadmin){
            if(asin.length<=0){
                res.json({message:'The input you provided is not valid'});
            }else{
                for(var i=0; i<paraList.length;i++){
                    if(paraList[i].length>0){
                        // console.log("***********"+paraName[i]);
                        // console.log("@@@@@@@@@@@"+paraList[i]);
                        con.query('UPDATE product_table SET '+paraName[i]+' = ? WHERE asin = ?',
                        [paraList[i], asin], function(error, results, fields){
                            if(error){
                                res.json({message:'The input you provided is not valid'});
                            }
                        });
                    }
                }
                con.query('SELECT * FROM product_table WHERE asin = ?',
                [asin], function(error, results, fields){
                    if(results.length>0){
                        res.json({message:results[0].productName + ' was successfully updated'});
                    }else{
                        res.json({message:'The input you provided is not valid'});
                    }
                });
            }
        }else{
            res.json({message:'You must be an admin to perform this action'});
        }
    }else{
        res.json({message:'You are not currently logged in'});
    }
    
});

app.post('/viewUsers', function(req,res){
    var fname = req.body.fname;
    var lname = req.body.lname;
    var queryString;
    console.log("viewUsers");

    if(req.session.loggedin){
        if(req.session.isadmin){
            if(fname && lname){
                console.log("fname and lname:"+fname+lname);
                queryString = 'SELECT fname, lname, userId FROM user_info WHERE fname = ? AND lname = ?';
                con.query(queryString,[fname, lname], function(error, results, fields){
                    if(results && results.length>0){
                        res.send('{"message":"The action was successful", "user":' + JSON.stringify(results)+'}');
                    }else{
                        res.json({message: 'There are no users that match that criteria'});
                    }
                });
            }else if(fname && !lname){
                queryString = 'SELECT fname, lname, userId FROM user_info WHERE fname = ?';
                con.query(queryString,[fname], function(error, results, fields){
                    if(results && results.length>0){
                        res.send('{"message":"The action was successful", "user":' + JSON.stringify(results)+'}');
                    }else{
                        res.json({message: 'There are no users that match that criteria'});
                    }
                });
            }else if(!fname && lname){
                queryString = 'SELECT fname, lname, userId FROM user_info WHERE lname = ?';
                con.query(queryString,[lname], function(error, results, fields){
                    if(results && results.length>0){
                        res.send('{"message":"The action was successful", "user":' + JSON.stringify(results)+'}');
                    }else{
                        res.json({message: 'There are no users that match that criteria'});
                    }
                });
            }else{
                queryString = 'SELECT fname, lname, userId FROM user_info';
                con.query(queryString,[],function(error, results, fields){
                    if(results && results.length>0){
                        res.send('{"message":"The action was successful", "user":' + JSON.stringify(results)+'}');
                    }else{
                        res.json({message: 'There are no users that match that criteria'});
                    }
                });   
            }

        }else{
            res.json({message:'You must be an admin to perform this action'});
        }
    }else{
        res.json({message:'You are not currently logged in'});

    }
});

app.post('/viewProducts', function(req, res){
    var asin = req.body.asin;
    var keyword = req.body.keyword;
    var group = req.body.group;
    console.log("viewProducts");
    var queryString;
    if(asin){
        if(keyword && group){
            queryString = 'SELECT asin,productName FROM product_table WHERE (productName LIKE ? OR productDescription \
            LIKE ? ) AND groupName = ? AND asin = ?';
            con.query(queryString,['%'+keyword+'%', '%'+keyword+'%', group, asin], function(error, results, fields){
                if(results && results.length>0){
                    res.send('{"product":'+JSON.stringify(results)+'}');
                }else{
                    res.json({message: 'There are no products that match that criteria'});
                }
            }); 
        }else if(keyword && !group){
            queryString = 'SELECT  asin,productName FROM product_table WHERE (productName LIKE ? OR productDescription \
            LIKE ?) AND asin = ?';
            con.query(queryString,['%'+keyword+'%', '%'+keyword+'%', asin], function(error, results, fields){
                if(results && results.length>0){
                    res.send('{"product":'+JSON.stringify(results)+'}');
                }else{
                    res.json({message: 'There are no products that match that criteria'});
                }
            }); 
        }else if(!keyword && group){
            queryString = 'SELECT  asin,productName FROM product_table WHERE groupName = ? AND asin = ?';
            con.query(queryString,[group, asin], function(error, results, fields){
                if(results && results.length>0){
                    res.send('{"product":'+JSON.stringify(results)+'}');
                }else{
                    res.json({message: 'There are no products that match that criteria'});
                }
            });
        }else{
            queryString = 'SELECT asin, productName FROM product_table WHERE asin = ?';
            con.query(queryString,[asin], function(error, results, fields){
                if(results && results.length>0){
                    res.send('{"product":'+JSON.stringify(results)+'}');
                }else{
                    res.json({message: 'There are no products that match that criteria'});
                }
            });  
        }
    }else{
        if(keyword && group){
            queryString = 'SELECT asin,productName FROM product_table WHERE (productName LIKE ? OR productDescription \
            LIKE ? ) AND groupName = ?';
            con.query(queryString,['%'+keyword+'%', '%'+keyword+'%', group], function(error, results, fields){
                if(results && results.length>0){
                    res.send('{"product":'+JSON.stringify(results)+'}');
                }else{
                    res.json({message: 'There are no products that match that criteria'});
                }
            }); 
        }else if(keyword && !group){
            queryString = 'SELECT  asin,productName FROM product_table WHERE productName LIKE ? OR productDescription \
            LIKE ?';
            con.query(queryString,['%'+keyword+'%', '%'+keyword+'%'], function(error, results, fields){
                if(results && results.length>0){
                    res.send('{"product":'+JSON.stringify(results)+'}');
                }else{
                    res.json({message: 'There are no products that match that criteria'});
                }
            }); 
        }else if(!keyword && group){
            queryString = 'SELECT asin,productName FROM product_table WHERE groupName = ?';
            con.query(queryString,[group], function(error, results, fields){
                if(results && results.length>0){
                    res.send('{"product":'+JSON.stringify(results)+'}');
                }else{
                    res.json({message: 'There are no products that match that criteria'});
                }
            });
        }else{
            queryString = 'SELECT asin,productName FROM product_table';
            con.query(queryString,[], function(error, results, fields){
                if(results && results.length>0){
                    res.send('{"product":'+JSON.stringify(results)+'}');
                }else{
                    res.json({message: 'There are no products that match that criteria'});
                }
            });
        }
    }
});

app.post('/buyProducts', function(req, res){
    if(req.session.loggedin){
        var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        var orderID = date+ req.session.username;
        var length = req.body.products.length;
        var isSuccess = 1;
        req.body.products.forEach(element => {
            var queryString = 'SELECT productName FROM product_table WHERE asin = ?';
            con.query(queryString, [element.asin], function(error, results, fields){
                if(results && results.length>0){
                    var queryString2 = 'INSERT INTO order_info (uname, oid, asin, productName) VALUES (?,?,?,?)';
                    con.query(queryString2, [req.session.username, orderID, element.asin, results[0].productName], function(error, results, fields){
                        if(error){
                            console.log("insert successful");
                        }else{
                            isSuccess = 0;
                        }
                    });
                }else{
                    isSuccess = 0;
                }

            });

        });
        if(isSuccess){
            res.json({message:'The action was successful'});
        }else{
            res.json({message: 'There are no products that match that criteria'});
        }
    }else{
        res.json({message:'You are not currently logged in'});
    }

});


app.post('/productsPurchased', function(req, res){
    if(req.session.loggedin){
        if(req.session.isadmin){
            var uname = req.session.username;
            var queryString = 'SELECT productName, count(*) AS quantity FROM order_info WHERE uname = ? GROUP BY productName';
            con.query(queryString,[req.session.username], function(error, results, fields){
                if(results && results.length>0){
                    res.send('{"products":'+JSON.stringify(results)+'}');
                }else{
                    res.json({message: 'There are no products that match that criteria'});
                }
            });
        }else{
            res.json({message:'You must be an admin to perform this action'});
        }
    }else{
        res.json({message:'You are not currently logged in'});
    }
});

app.post('/getRecommendations', function(req, res){
    if(req.session.loggedin){
        var queryString = 'SELECT order_info.asin  FROM order_info, ( SELECT asin, oid FROM order_info WHERE asin = ? )  AS selectInfo WHERE order_info.oid = selectInfo.oid AND order_info.asin <> ? GROUP BY order_info.asin ORDER BY count(order_info.asin) DESC';
        con.query(queryString, [req.body.asin, req.body.asin], function(error, results, fields){
            if(results && results.length>0){
                res.send('{"products":'+JSON.stringify(results)+'}');
            }else{
                res.json({message: 'There are no recommendations for that product'});
            }
        });
    }else{
        res.json({message:'You are not currently logged in'});
    }
});

app.listen(3000, function () {
  console.log('ECommerce app listening on port 3000!')
});
