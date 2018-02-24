// kiwi/relva/modules/db.js - Created February 6th, 2018

// NPM Modules
const redis = require('redis');
// https://github.com/NodeRedis/node_redis

// Custom Modules
const log = require('../util/log');

class RedisConnection {
	/**
     * Builds a Redis cache connection
     * @param {Object} options connection options
     * @param {string} options.host db host to connect to
     * @param {int} options.port db port to connect to
     * @param {string} options.password db auth password
     * @param {string} options.db database to use
     */
	constructor(options) {
		this.connection = redis.createClient(options);

		this.connection.on('error', function(err) {
			log(`[cache] Error: ${err}`);
			process.exit(1);
		});

		this.connection.on('connect', function() {
			log('[cache] Connection established');
		});

		this.connection.on('ready', function() {
			// this.connection.auth(options.password);
			log('[cache] Cache ready');
		});
	}

	conn() {
		return this.connection;
	}
}

module.exports = RedisConnection;