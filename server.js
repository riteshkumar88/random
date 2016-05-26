var restify = require('restify');
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
//------------------Server-----------------------


var url = 'mongodb://localhost:27017/quiz';
MongoClient.connect(url, function(err, db){
    if(err) throw err;
    
    var users = db.collection('commonquestion');
    var query = { };
    var cursor = users.find(query);
    var total,random;
    
    users.count(function(err, count){
        
        random = Math.floor(Math.random()*count);
        cursor.sort({_id : -1});
        cursor.skip(random);
        cursor.limit(1);
        
        cursor.each(function(err, doc){
            if(err) throw err;
            if(doc == null){
                return db.close();
            }
            console.dir(doc);
        });
    });
});


var server = restify.createServer({
    name: 'myapp',
    version: '1.0.0'
});                                   //creating server of restify


server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

restify.CORS.ALLOW_HEADERS.push("authorization"   );
restify.CORS.ALLOW_HEADERS.push("withcredentials"   );
restify.CORS.ALLOW_HEADERS.push("x-requested-with"   );
restify.CORS.ALLOW_HEADERS.push("x-forwarded-for"   );
restify.CORS.ALLOW_HEADERS.push("x-real-ip"   );
restify.CORS.ALLOW_HEADERS.push("x-customheader"   );
restify.CORS.ALLOW_HEADERS.push("user-agent"   );
restify.CORS.ALLOW_HEADERS.push("keep-alive"   );
restify.CORS.ALLOW_HEADERS.push("host"   );
restify.CORS.ALLOW_HEADERS.push("accept"   );
restify.CORS.ALLOW_HEADERS.push("connection"   );
restify.CORS.ALLOW_HEADERS.push("upgrade"   );
restify.CORS.ALLOW_HEADERS.push("content-type"   );
restify.CORS.ALLOW_HEADERS.push("dnt"   );
restify.CORS.ALLOW_HEADERS.push("if-modified-since"   );
restify.CORS.ALLOW_HEADERS.push("cache-control"   );


server.on("MethodNotAllowed", function(request, response){
    if(request.method.toUpperCase() === "OPTIONS" ){
        
        //Send the CORS headers
        
        response.header("Access-Control-Allow-Credentials", true);
        response.header("Access-Control-Allow-Headers", restify.CORS.ALLOW_HEADER.join(", "));
        response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.header("Access-Control-Allow-Origin", request.headers.origin);
        response.header("Access-Control-Max-Age", 0);
        response.header("Content-type", "text/plain charset=UTF-8");
        response.header("Content-length", 0);
        
        response.send(204);
    }else{
        response.send(new restify.MethodNotAllowedError());
    }
});


server.get('/echo/:name', function(req, res, next){
    res.send(req.params);
    return next();
});


server.get('/products', function(req, res, next){
    res.send("You will see all the products in the collection with this end point");
    return next();
});


//getting data from mongodb database using //browser

server.get('/fetch', function(req, res, next){
    MongoClient.connect(url, function(err, db){
       if(err) throw err;
        var users = db.collection('commonquestion');
        var query = { };
        var cursor = users.find(query);
        var total,random;
        
        users.count(function(err, count){
            random = Math.floor(Math.random()*count);
            cursor.sort({_id : -1});
            cursor.skip(random);
            cursor.limit(1);
            
            cursor.each(function(err, doc){
                if(err) throw err;
                if(doc == null){
                    return db.close();
                }
                res.json(doc);
            });
        });
    });
});

server.get('/home', function(req, res, next){
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(JSON.stringify(users));
    return next();
});


server.listen(8080, function(){
    console.log('%s server is listening at port %s' , server.name, server.url);
});

server.listen(3000, function(){
    console.log("Server started @ 3000");
});

//---------------Client------------------------


var assert = require('assert');


var client = restify.createJsonClient({
    url: 'http://localhost:80',
    version: '~1.0'
});


/*client.get('/echo/mark', function(err, req, res, obj){
    assert.ifError(err);
    console.log('Server returned: %j', obj);
});*/