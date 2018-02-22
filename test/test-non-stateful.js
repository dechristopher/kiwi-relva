/* eslint-disable */

const assert = require('assert');

// Custom Modules
const grabSteamID = require('../modules/ops/grabSteamID.js');
const checkValidSteamURL = require('../modules/ops/checkValidSteamProfileURL.js');
const formatSteamURL = require('../modules/ops/formatSteamURL.js');
const checkUsernameValid = require('../modules/ops/checkUsernameValid.js');

describe('SteamID', function() {
	describe('#grabSteamID()', function() {
		it('should grab all steamIDs given the steam profile URL of an account', function() {
			grabSteamID('https://steamcommunity.com/id/dropisbae').then(nugget => {
				const testnugget = {};
				testnugget.ids = {
					steamid: 'STEAM_0:0:39990',
					steamid64: '76561197960345708',
					steamid3: '[U:1:79980]',
				};
				assert.equal(nugget.error, undefined);
				assert.equal(nugget.ids.steamid, testnugget.ids.steamid);
			});
		});
	});
});

describe('Steam Profile URL', function() {
	describe('#checkValidSteamProfileURL()', function() {
		it('should return true for valid Steam profile URLs', function() {
			checkValidSteamURL('https://steamcommunity.com/id/dropisbae').then(valid => {
				assert.equal(valid, true);
			});
		});
		it('should return false for invalid Steam profile URLs', function() {
			checkValidSteamURL('https://steamcornmunity.com/id/dropisbae').then(valid => {
				assert.equal(valid, false);
			});
		});
	});
	describe('#formatSteamURL()', function() {
		it('should return properly formatted steam profile url given any valid form', function() {
			formatSteamURL('https://steamcommunity.com/id/dropisbae').then(url => {
				assert.equal(url, 'https://steamcommunity.com/id/dropisbae');
			});
			formatSteamURL('http://steamcommunity.com/id/dropisbae').then(url => {
				assert.equal(url, 'https://steamcommunity.com/id/dropisbae');
			});
			formatSteamURL('https://www.steamcommunity.com/id/dropisbae').then(url => {
				assert.equal(url, 'https://steamcommunity.com/id/dropisbae');
			});
			formatSteamURL('http://www.steamcommunity.com/id/dropisbae').then(url => {
				assert.equal(url, 'https://steamcommunity.com/id/dropisbae');
			});
			formatSteamURL('steamcommunity.com/id/dropisbae').then(url => {
				assert.equal(url, 'https://steamcommunity.com/id/dropisbae');
			});
			formatSteamURL('www.steamcommunity.com/id/dropisbae').then(url => {
				assert.equal(url, 'https://steamcommunity.com/id/dropisbae');
			});
		});
	});
});

describe('Username', function() {
	describe('#indexOf()', function() {
		it('should return true for valid usernames', function() {
			checkUsernameValid('drop').then(valid => {
				assert.equal(valid, true);
			});
			checkUsernameValid('drop123').then(valid => {
				assert.equal(valid, true);
			});
			checkUsernameValid('drop-drop').then(valid => {
				assert.equal(valid, true);
			});
			checkUsernameValid('drop_drop').then(valid => {
				assert.equal(valid, true);
			});
			checkUsernameValid('drop-123').then(valid => {
				assert.equal(valid, true);
			});
			checkUsernameValid('drop_123').then(valid => {
				assert.equal(valid, true);
			});
			checkUsernameValid('Ve').then(valid => {
				assert.equal(valid, true);
			});
			checkUsernameValid('D-').then(valid => {
				assert.equal(valid, true);
			});
			checkUsernameValid('L_').then(valid => {
				assert.equal(valid, true);
			});
		});
		it('should return false for invalid usernames', function() {
			checkUsernameValid('drop!').then(valid => {
				assert.equal(valid, false);
			});
			checkUsernameValid('drop?').then(valid => {
				assert.equal(valid, false);
			});
			checkUsernameValid('R').then(valid => {
				assert.equal(valid, false);
			});
			checkUsernameValid('&').then(valid => {
				assert.equal(valid, false);
			});
			checkUsernameValid('V$').then(valid => {
				assert.equal(valid, false);
			});
		});
	});
});