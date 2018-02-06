// kiwi/relva/modules/db.js - Created February 6th, 2018

// NPM Modules
const mysql = require('mysql');

// Custom Modules
const log = require('../util/log.js');

class DatabaseConnection {
    /**
     * options:
     *  - host (string: db host address)
     *  - port (int: db host listen port)
     *  - user (string: db auth username)
     *  - password (string: db auth password)
     *  - database (string: database to use within db)
     */
    constructor(options) {
        this.connection = mysql.createConnection(options);

        this.connection.connect(function(err) {
            if (err) {
                log(`DB Connection Error -> \n${err.stack}`);
                process.exit(1);
            }

            log(`DB Connected -> id: ${this.connection.threadId}`);
        });
    }

    conn() {
        return this.connection;
    }
}

module.exports = DatabaseConnection;