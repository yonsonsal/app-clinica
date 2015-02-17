'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Servicio = mongoose.model('Servicio'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, servicio;

/**
 * Servicio routes tests
 */
describe('Servicio CRUD tests', function() {
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

		// Save a user to the test db and create new Servicio
		user.save(function() {
			servicio = {
				name: 'Servicio Name'
			};

			done();
		});
	});

	it('should be able to save Servicio instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Servicio
				agent.post('/servicios')
					.send(servicio)
					.expect(200)
					.end(function(servicioSaveErr, servicioSaveRes) {
						// Handle Servicio save error
						if (servicioSaveErr) done(servicioSaveErr);

						// Get a list of Servicios
						agent.get('/servicios')
							.end(function(serviciosGetErr, serviciosGetRes) {
								// Handle Servicio save error
								if (serviciosGetErr) done(serviciosGetErr);

								// Get Servicios list
								var servicios = serviciosGetRes.body;

								// Set assertions
								(servicios[0].user._id).should.equal(userId);
								(servicios[0].name).should.match('Servicio Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Servicio instance if not logged in', function(done) {
		agent.post('/servicios')
			.send(servicio)
			.expect(401)
			.end(function(servicioSaveErr, servicioSaveRes) {
				// Call the assertion callback
				done(servicioSaveErr);
			});
	});

	it('should not be able to save Servicio instance if no name is provided', function(done) {
		// Invalidate name field
		servicio.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Servicio
				agent.post('/servicios')
					.send(servicio)
					.expect(400)
					.end(function(servicioSaveErr, servicioSaveRes) {
						// Set message assertion
						(servicioSaveRes.body.message).should.match('Please fill Servicio name');
						
						// Handle Servicio save error
						done(servicioSaveErr);
					});
			});
	});

	it('should be able to update Servicio instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Servicio
				agent.post('/servicios')
					.send(servicio)
					.expect(200)
					.end(function(servicioSaveErr, servicioSaveRes) {
						// Handle Servicio save error
						if (servicioSaveErr) done(servicioSaveErr);

						// Update Servicio name
						servicio.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Servicio
						agent.put('/servicios/' + servicioSaveRes.body._id)
							.send(servicio)
							.expect(200)
							.end(function(servicioUpdateErr, servicioUpdateRes) {
								// Handle Servicio update error
								if (servicioUpdateErr) done(servicioUpdateErr);

								// Set assertions
								(servicioUpdateRes.body._id).should.equal(servicioSaveRes.body._id);
								(servicioUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Servicios if not signed in', function(done) {
		// Create new Servicio model instance
		var servicioObj = new Servicio(servicio);

		// Save the Servicio
		servicioObj.save(function() {
			// Request Servicios
			request(app).get('/servicios')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Servicio if not signed in', function(done) {
		// Create new Servicio model instance
		var servicioObj = new Servicio(servicio);

		// Save the Servicio
		servicioObj.save(function() {
			request(app).get('/servicios/' + servicioObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', servicio.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Servicio instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Servicio
				agent.post('/servicios')
					.send(servicio)
					.expect(200)
					.end(function(servicioSaveErr, servicioSaveRes) {
						// Handle Servicio save error
						if (servicioSaveErr) done(servicioSaveErr);

						// Delete existing Servicio
						agent.delete('/servicios/' + servicioSaveRes.body._id)
							.send(servicio)
							.expect(200)
							.end(function(servicioDeleteErr, servicioDeleteRes) {
								// Handle Servicio error error
								if (servicioDeleteErr) done(servicioDeleteErr);

								// Set assertions
								(servicioDeleteRes.body._id).should.equal(servicioSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Servicio instance if not signed in', function(done) {
		// Set Servicio user 
		servicio.user = user;

		// Create new Servicio model instance
		var servicioObj = new Servicio(servicio);

		// Save the Servicio
		servicioObj.save(function() {
			// Try deleting Servicio
			request(app).delete('/servicios/' + servicioObj._id)
			.expect(401)
			.end(function(servicioDeleteErr, servicioDeleteRes) {
				// Set message assertion
				(servicioDeleteRes.body.message).should.match('User is not logged in');

				// Handle Servicio error error
				done(servicioDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Servicio.remove().exec();
		done();
	});
});