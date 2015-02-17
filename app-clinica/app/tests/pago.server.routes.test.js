'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Pago = mongoose.model('Pago'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, pago;

/**
 * Pago routes tests
 */
describe('Pago CRUD tests', function() {
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

		// Save a user to the test db and create new Pago
		user.save(function() {
			pago = {
				name: 'Pago Name'
			};

			done();
		});
	});

	it('should be able to save Pago instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pago
				agent.post('/pagos')
					.send(pago)
					.expect(200)
					.end(function(pagoSaveErr, pagoSaveRes) {
						// Handle Pago save error
						if (pagoSaveErr) done(pagoSaveErr);

						// Get a list of Pagos
						agent.get('/pagos')
							.end(function(pagosGetErr, pagosGetRes) {
								// Handle Pago save error
								if (pagosGetErr) done(pagosGetErr);

								// Get Pagos list
								var pagos = pagosGetRes.body;

								// Set assertions
								(pagos[0].user._id).should.equal(userId);
								(pagos[0].name).should.match('Pago Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Pago instance if not logged in', function(done) {
		agent.post('/pagos')
			.send(pago)
			.expect(401)
			.end(function(pagoSaveErr, pagoSaveRes) {
				// Call the assertion callback
				done(pagoSaveErr);
			});
	});

	it('should not be able to save Pago instance if no name is provided', function(done) {
		// Invalidate name field
		pago.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pago
				agent.post('/pagos')
					.send(pago)
					.expect(400)
					.end(function(pagoSaveErr, pagoSaveRes) {
						// Set message assertion
						(pagoSaveRes.body.message).should.match('Please fill Pago name');
						
						// Handle Pago save error
						done(pagoSaveErr);
					});
			});
	});

	it('should be able to update Pago instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pago
				agent.post('/pagos')
					.send(pago)
					.expect(200)
					.end(function(pagoSaveErr, pagoSaveRes) {
						// Handle Pago save error
						if (pagoSaveErr) done(pagoSaveErr);

						// Update Pago name
						pago.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Pago
						agent.put('/pagos/' + pagoSaveRes.body._id)
							.send(pago)
							.expect(200)
							.end(function(pagoUpdateErr, pagoUpdateRes) {
								// Handle Pago update error
								if (pagoUpdateErr) done(pagoUpdateErr);

								// Set assertions
								(pagoUpdateRes.body._id).should.equal(pagoSaveRes.body._id);
								(pagoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Pagos if not signed in', function(done) {
		// Create new Pago model instance
		var pagoObj = new Pago(pago);

		// Save the Pago
		pagoObj.save(function() {
			// Request Pagos
			request(app).get('/pagos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Pago if not signed in', function(done) {
		// Create new Pago model instance
		var pagoObj = new Pago(pago);

		// Save the Pago
		pagoObj.save(function() {
			request(app).get('/pagos/' + pagoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', pago.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Pago instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pago
				agent.post('/pagos')
					.send(pago)
					.expect(200)
					.end(function(pagoSaveErr, pagoSaveRes) {
						// Handle Pago save error
						if (pagoSaveErr) done(pagoSaveErr);

						// Delete existing Pago
						agent.delete('/pagos/' + pagoSaveRes.body._id)
							.send(pago)
							.expect(200)
							.end(function(pagoDeleteErr, pagoDeleteRes) {
								// Handle Pago error error
								if (pagoDeleteErr) done(pagoDeleteErr);

								// Set assertions
								(pagoDeleteRes.body._id).should.equal(pagoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Pago instance if not signed in', function(done) {
		// Set Pago user 
		pago.user = user;

		// Create new Pago model instance
		var pagoObj = new Pago(pago);

		// Save the Pago
		pagoObj.save(function() {
			// Try deleting Pago
			request(app).delete('/pagos/' + pagoObj._id)
			.expect(401)
			.end(function(pagoDeleteErr, pagoDeleteRes) {
				// Set message assertion
				(pagoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Pago error error
				done(pagoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Pago.remove().exec();
		done();
	});
});