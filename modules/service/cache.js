// kiwi/relva/modules/db.js - Created February 6th, 2018

// NPM Modules
const redis = require('redis'); //https://github.com/NodeRedis/node_redis

// Custom Modules
const log = require('../util/log.js');

class RedisConnection {
    /**
     * options:
     *  - host (string: redis host address)
     *  - port (int: redis host listen port)
     *  - password (string: redis auth password)
     *  - db (string: database to use within redis)
     */
    constructor(options) {
        this.connection = redis.createClient(options);

        this.connection.on("error", function(err) {
            log(`[cache] Error: ${err}`);
            process.exit(1);
        });

        this.connection.on("connect", function() {
            log(`[cache] Connection established`);
        });

        this.connection.on("ready", function() {
            //this.connection.auth(options.password);
            log(`[cache] Ready`);
        });
    }

    conn() {
        return this.connection;
    }
}

module.exports = RedisConnection;