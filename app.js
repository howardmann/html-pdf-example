// Express boilerplate
var express = require('express');
var path = require('path');
var http = require('http');
var exphbs = require('express-handlebars');

// html-pdf
var fs = require('fs');
var pdf = require('html-pdf');

var app = express();

app.use(express.static(path.resolve(__dirname, "public")));
app.engine('hbs', exphbs());
app.set('view engine', 'hbs');

app.get('/', function(req, res, next){

  res.render('index', {
    name: 'Howie Burger',
    age: 21,
    color: 'purple'
  });
});

app.get('/pdf', function(req, res, next){
  fs.readFile(__dirname + '/sample.html', 'utf8', function(err, html){
    pdf.create(html).toStream((err, pdfStream) => {
      if (err) {   
        // handle error and return a error response code
        console.log(err)
        return res.sendStatus(500)
      } else {
        // send a status code of 200 OK
        res.statusCode = 200             

        // once we are done reading end the response
        pdfStream.on('end', () => {
          // done reading
          return res.end()
        })

        // pipe the contents of the PDF directly to the response
        pdfStream.pipe(res)
      }
    })
  });

});

app.use(function(req, res){
  res.status(404).send('No location');
});

http.createServer(app).listen(3000, function(){
  console.log('Listening on localhost:3000');
});

module.exports = app;

