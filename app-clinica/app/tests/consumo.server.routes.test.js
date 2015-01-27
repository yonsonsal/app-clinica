'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Consumo = mongoose.model('Consumo'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, consumo;

/**
 * Consumo routes tests
 */
describe('Consumo CRUD tests', function() {
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

		// Save a user to the test db and create new Consumo
		user.save(function() {
			consumo = {
				name: 'Consumo Name'
			};

			done();
		});
	});

	it('should be able to save Consumo instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Consumo
				agent.post('/consumos')
					.send(consumo)
					.expect(200)
					.end(function(consumoSaveErr, consumoSaveRes) {
						// Handle Consumo save error
						if (consumoSaveErr) done(consumoSaveErr);

						// Get a list of Consumos
						agent.get('/consumos')
							.end(function(consumosGetErr, consumosGetRes) {
								// Handle Consumo save error
								if (consumosGetErr) done(consumosGetErr);

								// Get Consumos list
								var consumos = consumosGetRes.body;

								// Set assertions
								(consumos[0].user._id).should.equal(userId);
								(consumos[0].name).should.match('Consumo Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Consumo instance if not logged in', function(done) {
		agent.post('/consumos')
			.send(consumo)
			.expect(401)
			.end(function(consumoSaveErr, consumoSaveRes) {
				// Call the assertion callback
				done(consumoSaveErr);
			});
	});

	it('should not be able to save Consumo instance if no name is provided', function(done) {
		// Invalidate name field
		consumo.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Consumo
				agent.post('/consumos')
					.send(consumo)
					.expect(400)
					.end(function(consumoSaveErr, consumoSaveRes) {
						// Set message assertion
						(consumoSaveRes.body.message).should.match('Please fill Consumo name');
						
						// Handle Consumo save error
						done(consumoSaveErr);
					});
			});
	});

	it('should be able to update Consumo instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Consumo
				agent.post('/consumos')
					.send(consumo)
					.expect(200)
					.end(function(consumoSaveErr, consumoSaveRes) {
						// Handle Consumo save error
						if (consumoSaveErr) done(consumoSaveErr);

						// Update Consumo name
						consumo.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Consumo
						agent.put('/consumos/' + consumoSaveRes.body._id)
							.send(consumo)
							.expect(200)
							.end(function(consumoUpdateErr, consumoUpdateRes) {
								// Handle Consumo update error
								if (consumoUpdateErr) done(consumoUpdateErr);

								// Set assertions
								(consumoUpdateRes.body._id).should.equal(consumoSaveRes.body._id);
								(consumoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Consumos if not signed in', function(done) {
		// Create new Consumo model instance
		var consumoObj = new Consumo(consumo);

		// Save the Consumo
		consumoObj.save(function() {
			// Request Consumos
			request(app).get('/consumos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Consumo if not signed in', function(done) {
		// Create new Consumo model instance
		var consumoObj = new Consumo(consumo);

		// Save the Consumo
		consumoObj.save(function() {
			request(app).get('/consumos/' + consumoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', consumo.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Consumo instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Consumo
				agent.post('/consumos')
					.send(consumo)
					.expect(200)
					.end(function(consumoSaveErr, consumoSaveRes) {
						// Handle Consumo save error
						if (consumoSaveErr) done(consumoSaveErr);

						// Delete existing Consumo
						agent.delete('/consumos/' + consumoSaveRes.body._id)
							.send(consumo)
							.expect(200)
							.end(function(consumoDeleteErr, consumoDeleteRes) {
								// Handle Consumo error error
								if (consumoDeleteErr) done(consumoDeleteErr);

								// Set assertions
								(consumoDeleteRes.body._id).should.equal(consumoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Consumo instance if not signed in', function(done) {
		// Set Consumo user 
		consumo.user = user;

		// Create new Consumo model instance
		var consumoObj = new Consumo(consumo);

		// Save the Consumo
		consumoObj.save(function() {
			// Try deleting Consumo
			request(app).delete('/consumos/' + consumoObj._id)
			.expect(401)
			.end(function(consumoDeleteErr, consumoDeleteRes) {
				// Set message assertion
				(consumoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Consumo error error
				done(consumoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Consumo.remove().exec();
		done();
	});
});