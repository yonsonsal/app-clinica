'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Fabricante = mongoose.model('Fabricante'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, fabricante;

/**
 * Fabricante routes tests
 */
describe('Fabricante CRUD tests', function() {
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

		// Save a user to the test db and create new Fabricante
		user.save(function() {
			fabricante = {
				name: 'Fabricante Name'
			};

			done();
		});
	});

	it('should be able to save Fabricante instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fabricante
				agent.post('/fabricantes')
					.send(fabricante)
					.expect(200)
					.end(function(fabricanteSaveErr, fabricanteSaveRes) {
						// Handle Fabricante save error
						if (fabricanteSaveErr) done(fabricanteSaveErr);

						// Get a list of Fabricantes
						agent.get('/fabricantes')
							.end(function(fabricantesGetErr, fabricantesGetRes) {
								// Handle Fabricante save error
								if (fabricantesGetErr) done(fabricantesGetErr);

								// Get Fabricantes list
								var fabricantes = fabricantesGetRes.body;

								// Set assertions
								(fabricantes[0].user._id).should.equal(userId);
								(fabricantes[0].name).should.match('Fabricante Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Fabricante instance if not logged in', function(done) {
		agent.post('/fabricantes')
			.send(fabricante)
			.expect(401)
			.end(function(fabricanteSaveErr, fabricanteSaveRes) {
				// Call the assertion callback
				done(fabricanteSaveErr);
			});
	});

	it('should not be able to save Fabricante instance if no name is provided', function(done) {
		// Invalidate name field
		fabricante.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fabricante
				agent.post('/fabricantes')
					.send(fabricante)
					.expect(400)
					.end(function(fabricanteSaveErr, fabricanteSaveRes) {
						// Set message assertion
						(fabricanteSaveRes.body.message).should.match('Please fill Fabricante name');
						
						// Handle Fabricante save error
						done(fabricanteSaveErr);
					});
			});
	});

	it('should be able to update Fabricante instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fabricante
				agent.post('/fabricantes')
					.send(fabricante)
					.expect(200)
					.end(function(fabricanteSaveErr, fabricanteSaveRes) {
						// Handle Fabricante save error
						if (fabricanteSaveErr) done(fabricanteSaveErr);

						// Update Fabricante name
						fabricante.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Fabricante
						agent.put('/fabricantes/' + fabricanteSaveRes.body._id)
							.send(fabricante)
							.expect(200)
							.end(function(fabricanteUpdateErr, fabricanteUpdateRes) {
								// Handle Fabricante update error
								if (fabricanteUpdateErr) done(fabricanteUpdateErr);

								// Set assertions
								(fabricanteUpdateRes.body._id).should.equal(fabricanteSaveRes.body._id);
								(fabricanteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Fabricantes if not signed in', function(done) {
		// Create new Fabricante model instance
		var fabricanteObj = new Fabricante(fabricante);

		// Save the Fabricante
		fabricanteObj.save(function() {
			// Request Fabricantes
			request(app).get('/fabricantes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Fabricante if not signed in', function(done) {
		// Create new Fabricante model instance
		var fabricanteObj = new Fabricante(fabricante);

		// Save the Fabricante
		fabricanteObj.save(function() {
			request(app).get('/fabricantes/' + fabricanteObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', fabricante.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Fabricante instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fabricante
				agent.post('/fabricantes')
					.send(fabricante)
					.expect(200)
					.end(function(fabricanteSaveErr, fabricanteSaveRes) {
						// Handle Fabricante save error
						if (fabricanteSaveErr) done(fabricanteSaveErr);

						// Delete existing Fabricante
						agent.delete('/fabricantes/' + fabricanteSaveRes.body._id)
							.send(fabricante)
							.expect(200)
							.end(function(fabricanteDeleteErr, fabricanteDeleteRes) {
								// Handle Fabricante error error
								if (fabricanteDeleteErr) done(fabricanteDeleteErr);

								// Set assertions
								(fabricanteDeleteRes.body._id).should.equal(fabricanteSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Fabricante instance if not signed in', function(done) {
		// Set Fabricante user 
		fabricante.user = user;

		// Create new Fabricante model instance
		var fabricanteObj = new Fabricante(fabricante);

		// Save the Fabricante
		fabricanteObj.save(function() {
			// Try deleting Fabricante
			request(app).delete('/fabricantes/' + fabricanteObj._id)
			.expect(401)
			.end(function(fabricanteDeleteErr, fabricanteDeleteRes) {
				// Set message assertion
				(fabricanteDeleteRes.body.message).should.match('User is not logged in');

				// Handle Fabricante error error
				done(fabricanteDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Fabricante.remove().exec();
		done();
	});
});