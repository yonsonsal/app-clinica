'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Compra = mongoose.model('Compra'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, compra;

/**
 * Compra routes tests
 */
describe('Compra CRUD tests', function() {
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

		// Save a user to the test db and create new Compra
		user.save(function() {
			compra = {
				name: 'Compra Name'
			};

			done();
		});
	});

	it('should be able to save Compra instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Compra
				agent.post('/compras')
					.send(compra)
					.expect(200)
					.end(function(compraSaveErr, compraSaveRes) {
						// Handle Compra save error
						if (compraSaveErr) done(compraSaveErr);

						// Get a list of Compras
						agent.get('/compras')
							.end(function(comprasGetErr, comprasGetRes) {
								// Handle Compra save error
								if (comprasGetErr) done(comprasGetErr);

								// Get Compras list
								var compras = comprasGetRes.body;

								// Set assertions
								(compras[0].user._id).should.equal(userId);
								(compras[0].name).should.match('Compra Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Compra instance if not logged in', function(done) {
		agent.post('/compras')
			.send(compra)
			.expect(401)
			.end(function(compraSaveErr, compraSaveRes) {
				// Call the assertion callback
				done(compraSaveErr);
			});
	});

	it('should not be able to save Compra instance if no name is provided', function(done) {
		// Invalidate name field
		compra.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Compra
				agent.post('/compras')
					.send(compra)
					.expect(400)
					.end(function(compraSaveErr, compraSaveRes) {
						// Set message assertion
						(compraSaveRes.body.message).should.match('Please fill Compra name');
						
						// Handle Compra save error
						done(compraSaveErr);
					});
			});
	});

	it('should be able to update Compra instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Compra
				agent.post('/compras')
					.send(compra)
					.expect(200)
					.end(function(compraSaveErr, compraSaveRes) {
						// Handle Compra save error
						if (compraSaveErr) done(compraSaveErr);

						// Update Compra name
						compra.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Compra
						agent.put('/compras/' + compraSaveRes.body._id)
							.send(compra)
							.expect(200)
							.end(function(compraUpdateErr, compraUpdateRes) {
								// Handle Compra update error
								if (compraUpdateErr) done(compraUpdateErr);

								// Set assertions
								(compraUpdateRes.body._id).should.equal(compraSaveRes.body._id);
								(compraUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Compras if not signed in', function(done) {
		// Create new Compra model instance
		var compraObj = new Compra(compra);

		// Save the Compra
		compraObj.save(function() {
			// Request Compras
			request(app).get('/compras')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Compra if not signed in', function(done) {
		// Create new Compra model instance
		var compraObj = new Compra(compra);

		// Save the Compra
		compraObj.save(function() {
			request(app).get('/compras/' + compraObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', compra.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Compra instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Compra
				agent.post('/compras')
					.send(compra)
					.expect(200)
					.end(function(compraSaveErr, compraSaveRes) {
						// Handle Compra save error
						if (compraSaveErr) done(compraSaveErr);

						// Delete existing Compra
						agent.delete('/compras/' + compraSaveRes.body._id)
							.send(compra)
							.expect(200)
							.end(function(compraDeleteErr, compraDeleteRes) {
								// Handle Compra error error
								if (compraDeleteErr) done(compraDeleteErr);

								// Set assertions
								(compraDeleteRes.body._id).should.equal(compraSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Compra instance if not signed in', function(done) {
		// Set Compra user 
		compra.user = user;

		// Create new Compra model instance
		var compraObj = new Compra(compra);

		// Save the Compra
		compraObj.save(function() {
			// Try deleting Compra
			request(app).delete('/compras/' + compraObj._id)
			.expect(401)
			.end(function(compraDeleteErr, compraDeleteRes) {
				// Set message assertion
				(compraDeleteRes.body.message).should.match('User is not logged in');

				// Handle Compra error error
				done(compraDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Compra.remove().exec();
		done();
	});
});