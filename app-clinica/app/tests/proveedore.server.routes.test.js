'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Proveedore = mongoose.model('Proveedore'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, proveedore;

/**
 * Proveedore routes tests
 */
describe('Proveedore CRUD tests', function() {
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

		// Save a user to the test db and create new Proveedore
		user.save(function() {
			proveedore = {
				name: 'Proveedore Name'
			};

			done();
		});
	});

	it('should be able to save Proveedore instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Proveedore
				agent.post('/proveedores')
					.send(proveedore)
					.expect(200)
					.end(function(proveedoreSaveErr, proveedoreSaveRes) {
						// Handle Proveedore save error
						if (proveedoreSaveErr) done(proveedoreSaveErr);

						// Get a list of Proveedores
						agent.get('/proveedores')
							.end(function(proveedoresGetErr, proveedoresGetRes) {
								// Handle Proveedore save error
								if (proveedoresGetErr) done(proveedoresGetErr);

								// Get Proveedores list
								var proveedores = proveedoresGetRes.body;

								// Set assertions
								(proveedores[0].user._id).should.equal(userId);
								(proveedores[0].name).should.match('Proveedore Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Proveedore instance if not logged in', function(done) {
		agent.post('/proveedores')
			.send(proveedore)
			.expect(401)
			.end(function(proveedoreSaveErr, proveedoreSaveRes) {
				// Call the assertion callback
				done(proveedoreSaveErr);
			});
	});

	it('should not be able to save Proveedore instance if no name is provided', function(done) {
		// Invalidate name field
		proveedore.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Proveedore
				agent.post('/proveedores')
					.send(proveedore)
					.expect(400)
					.end(function(proveedoreSaveErr, proveedoreSaveRes) {
						// Set message assertion
						(proveedoreSaveRes.body.message).should.match('Please fill Proveedore name');
						
						// Handle Proveedore save error
						done(proveedoreSaveErr);
					});
			});
	});

	it('should be able to update Proveedore instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Proveedore
				agent.post('/proveedores')
					.send(proveedore)
					.expect(200)
					.end(function(proveedoreSaveErr, proveedoreSaveRes) {
						// Handle Proveedore save error
						if (proveedoreSaveErr) done(proveedoreSaveErr);

						// Update Proveedore name
						proveedore.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Proveedore
						agent.put('/proveedores/' + proveedoreSaveRes.body._id)
							.send(proveedore)
							.expect(200)
							.end(function(proveedoreUpdateErr, proveedoreUpdateRes) {
								// Handle Proveedore update error
								if (proveedoreUpdateErr) done(proveedoreUpdateErr);

								// Set assertions
								(proveedoreUpdateRes.body._id).should.equal(proveedoreSaveRes.body._id);
								(proveedoreUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Proveedores if not signed in', function(done) {
		// Create new Proveedore model instance
		var proveedoreObj = new Proveedore(proveedore);

		// Save the Proveedore
		proveedoreObj.save(function() {
			// Request Proveedores
			request(app).get('/proveedores')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Proveedore if not signed in', function(done) {
		// Create new Proveedore model instance
		var proveedoreObj = new Proveedore(proveedore);

		// Save the Proveedore
		proveedoreObj.save(function() {
			request(app).get('/proveedores/' + proveedoreObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', proveedore.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Proveedore instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Proveedore
				agent.post('/proveedores')
					.send(proveedore)
					.expect(200)
					.end(function(proveedoreSaveErr, proveedoreSaveRes) {
						// Handle Proveedore save error
						if (proveedoreSaveErr) done(proveedoreSaveErr);

						// Delete existing Proveedore
						agent.delete('/proveedores/' + proveedoreSaveRes.body._id)
							.send(proveedore)
							.expect(200)
							.end(function(proveedoreDeleteErr, proveedoreDeleteRes) {
								// Handle Proveedore error error
								if (proveedoreDeleteErr) done(proveedoreDeleteErr);

								// Set assertions
								(proveedoreDeleteRes.body._id).should.equal(proveedoreSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Proveedore instance if not signed in', function(done) {
		// Set Proveedore user 
		proveedore.user = user;

		// Create new Proveedore model instance
		var proveedoreObj = new Proveedore(proveedore);

		// Save the Proveedore
		proveedoreObj.save(function() {
			// Try deleting Proveedore
			request(app).delete('/proveedores/' + proveedoreObj._id)
			.expect(401)
			.end(function(proveedoreDeleteErr, proveedoreDeleteRes) {
				// Set message assertion
				(proveedoreDeleteRes.body.message).should.match('User is not logged in');

				// Handle Proveedore error error
				done(proveedoreDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Proveedore.remove().exec();
		done();
	});
});