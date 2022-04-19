
/*in game Stat Tracker*/
const gameStatus = {
    since: Date.now() /* since we keep it simple and in-memory, keep track of when this object was created */,
    gamesInitialized: 0 /* number of games ongoing*/,
    usersOnline: 0,
    gamesCompleted: 0 /* number of games successfully completed */
    
};

module.exports = gameStatus;