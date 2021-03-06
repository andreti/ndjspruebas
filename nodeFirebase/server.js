var express = require('express');
var mysql = require('mysql');
 
var app = express();

var Firebase = require('firebase');
var dataRef = new Firebase('https://pruebanodefirebase.firebaseIO.com/');

 
app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view options', { layout: false });
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/public'));
});


var client = mysql.createClient({
  host: 'localhost',
  user: 'root',
  password: '',
});

client.database = 'universidades';

app.get('/', function(req, res) {
	
	client.query('SELECT id, nombre, ciudad FROM universidades',
			function selectCb(err, results, fields) {
				if (err) {
					throw err;					
				}

				res.render('index.jade', { universidades: results , autor:"Andres Santacruz"});
			}
		);
});


app.post('/nueva', function(req, res) {

	client.query('INSERT INTO universidades (nombre, ciudad) VALUES (?, ?)', [req.body.nombre, req.body.ciudad],
			function() {
				res.redirect('/');
			}
		);

	
	dataRef.push({
		nombre:req.body.nombre,
		ciudad:req.body.ciudad,
		fecha: "1212",
		codigo:"2"
	});
});


app.get('/editar/:id', function(req, res) {
	client.query('SELECT id, nombre, ciudad FROM universidades WHERE id = ?', [req.params.id],
			function selectCb(err, results, fields) {
				if (err) {
					throw err;					
				}
				if(results.length > 0)
					res.render('editar.jade', { universidad: results[0] , vacio: false});
				else
					res.render('editar.jade', { vacio: true });
			}
		);
});

app.post('/actualizar', function(req, res) {
	client.query('UPDATE universidades SET nombre = ?, ciudad = ? WHERE id = ?', [req.body.nombre, req.body.ciudad, req.body.id],
			function() {			
				res.redirect('/');
			}
		);
});

app.get('/borrar/:id', function(req, res) {
	client.query('DELETE FROM universidades WHERE id = ?', [req.params.id],
		function() {
			res.redirect('/');
		}
	);
});

app.listen(3333);