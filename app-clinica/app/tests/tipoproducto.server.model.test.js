'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Tipoproducto = mongoose.model('Tipoproducto');

/**
 * Globals
 */
var user, tipoproducto;

/**
 * Unit tests
 */
describe('Tipoproducto Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			tipoproducto = new Tipoproducto({
				name: 'Tipoproducto Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return tipoproducto.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			tipoproducto.name = '';

			return tipoproducto.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Tipoproducto.remove().exec();
		User.remove().exec();

		done();
	});
});