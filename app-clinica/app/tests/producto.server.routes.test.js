'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Producto = mongoose.model('Producto'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, producto;

/**
 * Producto routes tests
 */
describe('Producto CRUD tests', function() {
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

		// Save a user to the test db and create new Producto
		user.save(function() {
			producto = {
				name: 'Producto Name'
			};

			done();
		});
	});

	it('should be able to save Producto instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Producto
				agent.post('/productos')
					.send(producto)
					.expect(200)
					.end(function(productoSaveErr, productoSaveRes) {
						// Handle Producto save error
						if (productoSaveErr) done(productoSaveErr);

						// Get a list of Productos
						agent.get('/productos')
							.end(function(productosGetErr, productosGetRes) {
								// Handle Producto save error
								if (productosGetErr) done(productosGetErr);

								// Get Productos list
								var productos = productosGetRes.body;

								// Set assertions
								(productos[0].user._id).should.equal(userId);
								(productos[0].name).should.match('Producto Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Producto instance if not logged in', function(done) {
		agent.post('/productos')
			.send(producto)
			.expect(401)
			.end(function(productoSaveErr, productoSaveRes) {
				// Call the assertion callback
				done(productoSaveErr);
			});
	});

	it('should not be able to save Producto instance if no name is provided', function(done) {
		// Invalidate name field
		producto.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Producto
				agent.post('/productos')
					.send(producto)
					.expect(400)
					.end(function(productoSaveErr, productoSaveRes) {
						// Set message assertion
						(productoSaveRes.body.message).should.match('Please fill Producto name');
						
						// Handle Producto save error
						done(productoSaveErr);
					});
			});
	});

	it('should be able to update Producto instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Producto
				agent.post('/productos')
					.send(producto)
					.expect(200)
					.end(function(productoSaveErr, productoSaveRes) {
						// Handle Producto save error
						if (productoSaveErr) done(productoSaveErr);

						// Update Producto name
						producto.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Producto
						agent.put('/productos/' + productoSaveRes.body._id)
							.send(producto)
							.expect(200)
							.end(function(productoUpdateErr, productoUpdateRes) {
								// Handle Producto update error
								if (productoUpdateErr) done(productoUpdateErr);

								// Set assertions
								(productoUpdateRes.body._id).should.equal(productoSaveRes.body._id);
								(productoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Productos if not signed in', function(done) {
		// Create new Producto model instance
		var productoObj = new Producto(producto);

		// Save the Producto
		productoObj.save(function() {
			// Request Productos
			request(app).get('/productos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Producto if not signed in', function(done) {
		// Create new Producto model instance
		var productoObj = new Producto(producto);

		// Save the Producto
		productoObj.save(function() {
			request(app).get('/productos/' + productoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', producto.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Producto instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Producto
				agent.post('/productos')
					.send(producto)
					.expect(200)
					.end(function(productoSaveErr, productoSaveRes) {
						// Handle Producto save error
						if (productoSaveErr) done(productoSaveErr);

						// Delete existing Producto
						agent.delete('/productos/' + productoSaveRes.body._id)
							.send(producto)
							.expect(200)
							.end(function(productoDeleteErr, productoDeleteRes) {
								// Handle Producto error error
								if (productoDeleteErr) done(productoDeleteErr);

								// Set assertions
								(productoDeleteRes.body._id).should.equal(productoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Producto instance if not signed in', function(done) {
		// Set Producto user 
		producto.user = user;

		// Create new Producto model instance
		var productoObj = new Producto(producto);

		// Save the Producto
		productoObj.save(function() {
			// Try deleting Producto
			request(app).delete('/productos/' + productoObj._id)
			.expect(401)
			.end(function(productoDeleteErr, productoDeleteRes) {
				// Set message assertion
				(productoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Producto error error
				done(productoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Producto.remove().exec();
		done();
	});
});