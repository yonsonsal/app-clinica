'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Persona = mongoose.model('Persona'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, persona;

/**
 * Persona routes tests
 */
describe('Persona CRUD tests', function() {
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

		// Save a user to the test db and create new Persona
		user.save(function() {
			persona = {
				name: 'Persona Name'
			};

			done();
		});
	});

	it('should be able to save Persona instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Persona
				agent.post('/personas')
					.send(persona)
					.expect(200)
					.end(function(personaSaveErr, personaSaveRes) {
						// Handle Persona save error
						if (personaSaveErr) done(personaSaveErr);

						// Get a list of Personas
						agent.get('/personas')
							.end(function(personasGetErr, personasGetRes) {
								// Handle Persona save error
								if (personasGetErr) done(personasGetErr);

								// Get Personas list
								var personas = personasGetRes.body;

								// Set assertions
								(personas[0].user._id).should.equal(userId);
								(personas[0].name).should.match('Persona Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Persona instance if not logged in', function(done) {
		agent.post('/personas')
			.send(persona)
			.expect(401)
			.end(function(personaSaveErr, personaSaveRes) {
				// Call the assertion callback
				done(personaSaveErr);
			});
	});

	it('should not be able to save Persona instance if no name is provided', function(done) {
		// Invalidate name field
		persona.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Persona
				agent.post('/personas')
					.send(persona)
					.expect(400)
					.end(function(personaSaveErr, personaSaveRes) {
						// Set message assertion
						(personaSaveRes.body.message).should.match('Please fill Persona name');
						
						// Handle Persona save error
						done(personaSaveErr);
					});
			});
	});

	it('should be able to update Persona instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Persona
				agent.post('/personas')
					.send(persona)
					.expect(200)
					.end(function(personaSaveErr, personaSaveRes) {
						// Handle Persona save error
						if (personaSaveErr) done(personaSaveErr);

						// Update Persona name
						persona.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Persona
						agent.put('/personas/' + personaSaveRes.body._id)
							.send(persona)
							.expect(200)
							.end(function(personaUpdateErr, personaUpdateRes) {
								// Handle Persona update error
								if (personaUpdateErr) done(personaUpdateErr);

								// Set assertions
								(personaUpdateRes.body._id).should.equal(personaSaveRes.body._id);
								(personaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Personas if not signed in', function(done) {
		// Create new Persona model instance
		var personaObj = new Persona(persona);

		// Save the Persona
		personaObj.save(function() {
			// Request Personas
			request(app).get('/personas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Persona if not signed in', function(done) {
		// Create new Persona model instance
		var personaObj = new Persona(persona);

		// Save the Persona
		personaObj.save(function() {
			request(app).get('/personas/' + personaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', persona.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Persona instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Persona
				agent.post('/personas')
					.send(persona)
					.expect(200)
					.end(function(personaSaveErr, personaSaveRes) {
						// Handle Persona save error
						if (personaSaveErr) done(personaSaveErr);

						// Delete existing Persona
						agent.delete('/personas/' + personaSaveRes.body._id)
							.send(persona)
							.expect(200)
							.end(function(personaDeleteErr, personaDeleteRes) {
								// Handle Persona error error
								if (personaDeleteErr) done(personaDeleteErr);

								// Set assertions
								(personaDeleteRes.body._id).should.equal(personaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Persona instance if not signed in', function(done) {
		// Set Persona user 
		persona.user = user;

		// Create new Persona model instance
		var personaObj = new Persona(persona);

		// Save the Persona
		personaObj.save(function() {
			// Try deleting Persona
			request(app).delete('/personas/' + personaObj._id)
			.expect(401)
			.end(function(personaDeleteErr, personaDeleteRes) {
				// Set message assertion
				(personaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Persona error error
				done(personaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Persona.remove().exec();
		done();
	});
});