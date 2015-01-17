'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Tipoproducto = mongoose.model('Tipoproducto'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, tipoproducto;

/**
 * Tipoproducto routes tests
 */
describe('Tipoproducto CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Tipoproducto
		user.save(function() {
			tipoproducto = {
				name: 'Tipoproducto Name'
			};

			done();
		});
	});

	it('should be able to save Tipoproducto instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tipoproducto
				agent.post('/tipoproductos')
					.send(tipoproducto)
					.expect(200)
					.end(function(tipoproductoSaveErr, tipoproductoSaveRes) {
						// Handle Tipoproducto save error
						if (tipoproductoSaveErr) done(tipoproductoSaveErr);

						// Get a list of Tipoproductos
						agent.get('/tipoproductos')
							.end(function(tipoproductosGetErr, tipoproductosGetRes) {
								// Handle Tipoproducto save error
								if (tipoproductosGetErr) done(tipoproductosGetErr);

								// Get Tipoproductos list
								var tipoproductos = tipoproductosGetRes.body;

								// Set assertions
								(tipoproductos[0].user._id).should.equal(userId);
								(tipoproductos[0].name).should.match('Tipoproducto Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Tipoproducto instance if not logged in', function(done) {
		agent.post('/tipoproductos')
			.send(tipoproducto)
			.expect(401)
			.end(function(tipoproductoSaveErr, tipoproductoSaveRes) {
				// Call the assertion callback
				done(tipoproductoSaveErr);
			});
	});

	it('should not be able to save Tipoproducto instance if no name is provided', function(done) {
		// Invalidate name field
		tipoproducto.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tipoproducto
				agent.post('/tipoproductos')
					.send(tipoproducto)
					.expect(400)
					.end(function(tipoproductoSaveErr, tipoproductoSaveRes) {
						// Set message assertion
						(tipoproductoSaveRes.body.message).should.match('Please fill Tipoproducto name');
						
						// Handle Tipoproducto save error
						done(tipoproductoSaveErr);
					});
			});
	});

	it('should be able to update Tipoproducto instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tipoproducto
				agent.post('/tipoproductos')
					.send(tipoproducto)
					.expect(200)
					.end(function(tipoproductoSaveErr, tipoproductoSaveRes) {
						// Handle Tipoproducto save error
						if (tipoproductoSaveErr) done(tipoproductoSaveErr);

						// Update Tipoproducto name
						tipoproducto.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Tipoproducto
						agent.put('/tipoproductos/' + tipoproductoSaveRes.body._id)
							.send(tipoproducto)
							.expect(200)
							.end(function(tipoproductoUpdateErr, tipoproductoUpdateRes) {
								// Handle Tipoproducto update error
								if (tipoproductoUpdateErr) done(tipoproductoUpdateErr);

								// Set assertions
								(tipoproductoUpdateRes.body._id).should.equal(tipoproductoSaveRes.body._id);
								(tipoproductoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Tipoproductos if not signed in', function(done) {
		// Create new Tipoproducto model instance
		var tipoproductoObj = new Tipoproducto(tipoproducto);

		// Save the Tipoproducto
		tipoproductoObj.save(function() {
			// Request Tipoproductos
			request(app).get('/tipoproductos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Tipoproducto if not signed in', function(done) {
		// Create new Tipoproducto model instance
		var tipoproductoObj = new Tipoproducto(tipoproducto);

		// Save the Tipoproducto
		tipoproductoObj.save(function() {
			request(app).get('/tipoproductos/' + tipoproductoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', tipoproducto.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Tipoproducto instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tipoproducto
				agent.post('/tipoproductos')
					.send(tipoproducto)
					.expect(200)
					.end(function(tipoproductoSaveErr, tipoproductoSaveRes) {
						// Handle Tipoproducto save error
						if (tipoproductoSaveErr) done(tipoproductoSaveErr);

						// Delete existing Tipoproducto
						agent.delete('/tipoproductos/' + tipoproductoSaveRes.body._id)
							.send(tipoproducto)
							.expect(200)
							.end(function(tipoproductoDeleteErr, tipoproductoDeleteRes) {
								// Handle Tipoproducto error error
								if (tipoproductoDeleteErr) done(tipoproductoDeleteErr);

								// Set assertions
								(tipoproductoDeleteRes.body._id).should.equal(tipoproductoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Tipoproducto instance if not signed in', function(done) {
		// Set Tipoproducto user 
		tipoproducto.user = user;

		// Create new Tipoproducto model instance
		var tipoproductoObj = new Tipoproducto(tipoproducto);

		// Save the Tipoproducto
		tipoproductoObj.save(function() {
			// Try deleting Tipoproducto
			request(app).delete('/tipoproductos/' + tipoproductoObj._id)
			.expect(401)
			.end(function(tipoproductoDeleteErr, tipoproductoDeleteRes) {
				// Set message assertion
				(tipoproductoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Tipoproducto error error
				done(tipoproductoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Tipoproducto.remove().exec();
		done();
	});
});