// kiwi/relva/modules/user.js - Created February 6th, 2018

class User {
    constructor(bot, dbOptions) {
        this.bot = bot;
        //this.dbc = new(require('./service/dbc.js'))(dbOptions);
    }

    isLinked(userID) {
        return this.checkLinked(userID);
    }

    checkLinked(userID) {
        // hit db
        return true;
    }

    linkAccount(userID, steamID) {
        console.log('hit linkAccount');
        return `Linked SteamID: ${steamID} to user ID: ${userID}`;
    }

    avatarAssoc(userID, avatarURL) {
        //this.dbc.conn().query("TODO");
    }
}

module.exports = User;