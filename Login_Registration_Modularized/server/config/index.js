const users = require('../controllers/users.js');

module.exports = function Route(app){

	// getting homepage
	app.get('/', function(req, res){
		res.render('index');
	})

	//posting a data
	app.post('/add', function(req, res){

		users.register(req, res);
	})

	//login user
	app.post('/login', function(req, res){
		users.login(req, res);
	})
};