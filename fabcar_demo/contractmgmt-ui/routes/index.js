const express = require('express');
const router = express.Router();
const User = require('../models/user');
//
const { kStringMaxLength } = require('buffer');

bodyparser = require("body-parser"),
mongoose = require("mongoose");
//
var url = 'mongodb://localhost:27017/ManualAuth';


var check =0;

//


router.get('/admin', (req, res, next) => {
    User.find({}, function(err, data) {
        res.render('admin.ejs', {
            list: data
        })
    })
});



  //


router.get('/', (req, res, next) => {
	return res.render('index.ejs');
});

router.post('/', (req, res, next) => {
		User.findOne({ email: req.body.email }, (err, data) => {
			if(req.body.email == "admin@admin.com"){
				check =1;
			}
				if (data){
				if (data.password == req.body.password) {
					if(check ==1){
						req.session.userId2 = data.unique_id;
					}
					else{
					req.session.userId = data.unique_id;
					}
				res.send({ "Success": "Success!" });
				} 
			
			else {
				res.send({ "Success": "Wrong password!" });
			}
		} else {
			res.send({ "Success": "This Email Is not regestered!" });
		}
	});
});


router.get('/signup', (req, res, next) => {
	return res.render('login.ejs');
});


router.post('/signup', (req, res, next) => {
	let personInfo = req.body;

	if (!personInfo.firstname ||!personInfo.lastname ||!personInfo.email ||!personInfo.password || !personInfo.passwordConf) {
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({ email: personInfo.email }, (err, data) => {
				if (!data) {
					let c;
					User.findOne({}, (err, data) => {

						if (data) {
							c = data.unique_id + 1;
						} else {
							c = 1;
						}

						let newPerson = new User({
							role:"user",
							unique_id: c,
							firstname: personInfo.firstname,
							lastname: personInfo.lastname,
							email: personInfo.email,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save((err, Person) => {
							if (err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({ _id: -1 }).limit(1);
					res.send({ "Success": "You are regestered,You can login now." });
				} else {
					res.send({ "Success": "Email is already used." });
				}

			});
		} else {
			res.send({ "Success": "password is not matched" });
		}
	}
});


router.get('/profile', (req, res, next) => {
	if(check == 0){
	User.findOne({ unique_id: req.session.userId}, (err, data) => {
		if (!data) {
			res.redirect('/');
		}
		else {
			return res.render('index1.jade');
		}
	});
	}
	else{
		User.findOne({ unique_id: req.session.userId2}, (err, data) => {
			if (!data) {
				res.redirect('/');
			}
			else {
				check =0;
				User.find({}, function(err, data) {
					return res.render('admin.ejs', {
						list: data
					})
				})
			}
		});
	}
});

router.get('/popup', (req, res, next) => {
			User.find( {_id: req.body.id}, (err, data) => {
				return res.render('popitpop.ejs',{
					play: data
				})
		})
	});

router.get('/logout', (req, res, next) => {
	if (req.session) {
		// delete session object
		req.session.destroy((err) => {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/');
			}
		});
	}
});

router.post('/update', function(req, res, next) {
	var item = {
	  role: req.body.role
  
	};
	var email = req.body.email;
  
	mongo.connect(url, function(err, db) {
	  assert.equal(null, err);
	  db.collection('users').updateOne({"email": email}, {$set: item}, function(err, result) {
		assert.equal(null, err);
		console.log('Item updated');
		db.close();
	  });
	});
  });


router.get('/forgetpass', (req, res, next) => {
	res.render("forget.ejs");
});
router.post('/forgetpass', (req, res, next) => {
	User.findOne({ email: req.body.email }, (err, data) => {
		if (!data) {
			res.send({ "Success": "This Email Is not regestered!" });
		} else {
			if (req.body.password == req.body.passwordConf) {
				data.password = req.body.password;
				data.passwordConf = req.body.passwordConf;

				data.save((err, Person) => {
					if (err)
						console.log(err);
					else
						console.log('Success');
					res.send({ "Success": "Password changed!" });
				});
			} else {
				res.send({ "Success": "Password does not matched! Both Password should be same." });
			}
		}
	});

});

router.get('/scopeup', (req, res, next) => {
	return res.render('update.ejs');
});


module.exports = router;