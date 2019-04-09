module.exports = function Route(app, m){
	
	const bcrypt = require('bcryptjs');
	
	const usersSchema = new m.Schema({
		email: {
			type: String,
			required: [true, 'Email field is required'],
			trim: true
		},
		first_name: {
			type: String,
			required: [true, 'First Name field is required'],
			trim: true
		},
		last_name:{
			type: String,
			required: [true, 'Last Name field is required'],
			trim: true
		},
		password: {
			type: String,
			required: [true, 'Password field is required'],
			trim: true
		},
		birthday: {
			type: Date,
			required: [true, 'Birthday field is required'],
			trim: true
		}
	});

    const SecretSchema = new m.Schema({
        text: {
            type: String, 
            require: [true, 'Secret field can not be blank.'], 
            minlength: [5, 'Have to be more than 5 character.'],
            trim: true
        }, 
        _comments: [{ type: m.Schema.Types.ObjectId, ref: 'Comment' }], 
        _users: [{ type: m.Schema.Types.ObjectId, ref: 'User' }]
    });

    const CommentSchema = new m.Schema({
        comment: {
            type: String, 
            require: [true, 'Secret field can not be blank.'], 
            minlength: [1, 'Have to be more than 1 character.'],
            trim: true
        }, 
        _secret: [{ type: m.Schema.Types.ObjectId, ref: 'Secret' }]
    });


    const User = m.model('User', usersSchema);
    const Secret = m.model('Secret', SecretSchema);
    const Comment = m.model('Comment', CommentSchema);
	
	// getting homepage
	app.get('/', function(req, res){
		res.render('index');
	})

	//posting a data
	app.post('/add', function(req, res){
		
		const currentPassword = req.body.password;
		const confirmPassword = req.body.cw_password;
		User.findOne({email: req.body.email}, function(err, user){
			if(user)
			{
				req.flash('PasswordMissMatch', 'Email address already exist.');
				res.redirect('/');
			}else{
				console.log('user not found');
				if( currentPassword == confirmPassword){
					const hashedPassword = bcrypt.hashSync(currentPassword, 10);
					
					User.create({
							email: req.body.email,
							first_name: req.body.first_name,
							last_name: req.body.last_name,
							password: hashedPassword,
							birthday: req.body.birthday
						}
					)
					.then(new_user =>{
						console.log(new_user);
						req.flash('success', 'Congrats! you have successfully registered.');
						res.redirect('/');
					})
					.catch(error =>{
						console.log(error);
						for(let err in error.errors){
							req.flash('errors', error.errors[err].message);
					}
					res.redirect('/');
					})
				}else{
					req.flash('PasswordMissMatch', 'Your password did not match!');
					res.redirect('/');
				}
			}
			
			if(err){
				console.log(err);
			}
		});
	})
	
	//login user
	app.post('/login', function(req, res){
		const user_email = req.body.login_email;
		const user_password = req.body.login_password;
		if(user_email == ''|| user_password == '')
		{
			req.flash('PasswordMissMatch', 'All fields cannot be empty.');
			res.redirect('/');
		}else{
			User.findOne({email:req.body.login_email}, (err, user) => {
				if (user) {
					bcrypt.compare(user_password, user.password)
					.then( result => {
						if(result)
						{
							req.session.user_id = user._id;
							req.flash('success', 'Successfully logged in.');
							res.redirect('/secret');
						}else{
							req.flash('PasswordMissMatch', 'Password is wrong.');
							res.render('index');
						}
					})
					.catch( error => {
						console.log(error);
						for(let err in error.errors){
							req.flash('errors', error.errors[err].message);
						}
						res.render('index');	
					})
				}else{
					req.flash('PasswordMissMatch', 'Email address does not exist.');
					res.redirect('/');
				}
			});
		}
	})
	// getting dashboard
	app.get('/secret', function(req, res){
		const user = req.session.user_id;
		Secret.find({}, (err, result) =>{
			if(result){
				console.log(result);
			}
			res.render('secrets', {result:result, user:user});
		})
	})
	app.post('/secret', function(req, res){
		const secret = req.body.my_secret;
		const userId = req.session.user_id;
		if(secret){
			User.findOne({_id: userId}, (err, data) =>{
				if(data){
					console.log(userId);
					console.log(data);
					Secret.create({
						text: req.body.my_secret,
						_users: data
					}).then(result =>{
						console.log(result);
						res.redirect('/secret');
					}).catch(error =>{
						console.log(error);
						res.render('secrets');
					})
				}else{
					res.redirect('/secret');
				}
				if(err){
					console.log(err);
					res.redirect('/secret');
				}
			});
		}else{
			req.flash('PasswordMissMatch', 'My Secret field cannot be blank');
			res.redirect('/secret');
		}
	})

	app.get('/details/:id', function(req, res){
		const secret_id = req.params.id;
		Secret.findOne({ _id: secret_id })
		.then(message =>{
			Comment.find({ _secret: message }, (err, data) =>{
				if(data){
					console.log('data found ', data);
					res.render('details', { msg: message, data:data });
				}else{
					res.redirect('/details/'+secret_id);
				}
			})
		})
		.catch(error =>{
			console.log(error);
			for(let err in error.errors){
				req.flash('errors', error.errors[err].message);
			}
			res.redirect('/details/'+secret_id);
		})
	})

	app.post('/comment/:id', function(req, res){
		const messageID = req.params.id;
		Secret.findOne({ _id: req.params.id })
		.then(c => {
			Comment.create({
				comment: req.body.comment,
				_secret: c
			})
			req.flash('success', 'Your comment successfully added.')
			res.redirect('/details/'+messageID);
		})
		.catch(error => {
			console.log(error);
			for(let err in error.errors){
				req.flash('errors', error.errors[err].message);
			}
			res.redirect('/details/'+messageID);
		})
	})

	//Destroy
	app.get('/destroy/:id', function(req, res){
		Secret.remove({_id: req.params.id}, function(err){
			req.flash('success', 'Record removed successfully.')
			res.redirect('/secret');
		})
	})

	app.get('/clear', function(req, res){
		req.session.destroy();
		res.redirect('/');
	})
};