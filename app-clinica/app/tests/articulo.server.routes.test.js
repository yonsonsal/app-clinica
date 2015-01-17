'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Articulo = mongoose.model('Articulo'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, articulo;

/**
 * Articulo routes tests
 */
describe('Articulo CRUD tests', function() {
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

		// Save a user to the test db and create new Articulo
		user.save(function() {
			articulo = {
				name: 'Articulo Name'
			};

			done();
		});
	});

	it('should be able to save Articulo instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Articulo
				agent.post('/articulos')
					.send(articulo)
					.expect(200)
					.end(function(articuloSaveErr, articuloSaveRes) {
						// Handle Articulo save error
						if (articuloSaveErr) done(articuloSaveErr);

						// Get a list of Articulos
						agent.get('/articulos')
							.end(function(articulosGetErr, articulosGetRes) {
								// Handle Articulo save error
								if (articulosGetErr) done(articulosGetErr);

								// Get Articulos list
								var articulos = articulosGetRes.body;

								// Set assertions
								(articulos[0].user._id).should.equal(userId);
								(articulos[0].name).should.match('Articulo Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Articulo instance if not logged in', function(done) {
		agent.post('/articulos')
			.send(articulo)
			.expect(401)
			.end(function(articuloSaveErr, articuloSaveRes) {
				// Call the assertion callback
				done(articuloSaveErr);
			});
	});

	it('should not be able to save Articulo instance if no name is provided', function(done) {
		// Invalidate name field
		articulo.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Articulo
				agent.post('/articulos')
					.send(articulo)
					.expect(400)
					.end(function(articuloSaveErr, articuloSaveRes) {
						// Set message assertion
						(articuloSaveRes.body.message).should.match('Please fill Articulo name');
						
						// Handle Articulo save error
						done(articuloSaveErr);
					});
			});
	});

	it('should be able to update Articulo instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Articulo
				agent.post('/articulos')
					.send(articulo)
					.expect(200)
					.end(function(articuloSaveErr, articuloSaveRes) {
						// Handle Articulo save error
						if (articuloSaveErr) done(articuloSaveErr);

						// Update Articulo name
						articulo.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Articulo
						agent.put('/articulos/' + articuloSaveRes.body._id)
							.send(articulo)
							.expect(200)
							.end(function(articuloUpdateErr, articuloUpdateRes) {
								// Handle Articulo update error
								if (articuloUpdateErr) done(articuloUpdateErr);

								// Set assertions
								(articuloUpdateRes.body._id).should.equal(articuloSaveRes.body._id);
								(articuloUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Articulos if not signed in', function(done) {
		// Create new Articulo model instance
		var articuloObj = new Articulo(articulo);

		// Save the Articulo
		articuloObj.save(function() {
			// Request Articulos
			request(app).get('/articulos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Articulo if not signed in', function(done) {
		// Create new Articulo model instance
		var articuloObj = new Articulo(articulo);

		// Save the Articulo
		articuloObj.save(function() {
			request(app).get('/articulos/' + articuloObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', articulo.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Articulo instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Articulo
				agent.post('/articulos')
					.send(articulo)
					.expect(200)
					.end(function(articuloSaveErr, articuloSaveRes) {
						// Handle Articulo save error
						if (articuloSaveErr) done(articuloSaveErr);

						// Delete existing Articulo
						agent.delete('/articulos/' + articuloSaveRes.body._id)
							.send(articulo)
							.expect(200)
							.end(function(articuloDeleteErr, articuloDeleteRes) {
								// Handle Articulo error error
								if (articuloDeleteErr) done(articuloDeleteErr);

								// Set assertions
								(articuloDeleteRes.body._id).should.equal(articuloSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Articulo instance if not signed in', function(done) {
		// Set Articulo user 
		articulo.user = user;

		// Create new Articulo model instance
		var articuloObj = new Articulo(articulo);

		// Save the Articulo
		articuloObj.save(function() {
			// Try deleting Articulo
			request(app).delete('/articulos/' + articuloObj._id)
			.expect(401)
			.end(function(articuloDeleteErr, articuloDeleteRes) {
				// Set message assertion
				(articuloDeleteRes.body.message).should.match('User is not logged in');

				// Handle Articulo error error
				done(articuloDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Articulo.remove().exec();
		done();
	});
});