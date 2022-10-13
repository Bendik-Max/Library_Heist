import Terminal from './terminal.js';
import GameState from './gamestate.js';

const socket = new WebSocket(Setup.WEB_SOCKET_URL);

const gs = new GameState(socket, new Terminal());

socket.onmessage = function(event){
    let incomingMSG = JSON.parse(event.data);
        
    if(incomingMSG.type == Messages.T_GAME_OVER)  {
        gs.printText("You've won by a forfeit or a loss of connection! Consider yourself lucky!");
        this.disable = true;
    }

    if (incomingMSG.type == Messages.T_PLAYER_TYPE) {
        console.log("message has been accepted");
        if(incomingMSG.data == 1){
            console.log("message has been decrypted");
            gs.roleTurn = "Encryptor";
            gs.updateRoles("other player", "you");
            gs.updateCodeOrGuess("code"); 
            gs.updateTurnTable(gs.roleTurn); //sets it to Encryptor
            gs.terminal.printText("Please enter a code using the coloured buttons or by entering the colours: red, orange, yellow, green, blue, purple or white:");
            gs.terminalSetup();
            gs.confirmButtonSetup();    
            gs.setupRed();
            gs.setupOrange();
            gs.setupYellow();
            gs.setupGreen();
            gs.setupBlue();
            gs.setupPurple();
            gs.setupWhite();
            gs.setPlayer(1);
            console.log("all the functions have been called");
        }
        if(incomingMSG.data == 2){
            gs.updateRoles("you", "other player");
            gs.terminal.printText("You are the hacker! It's your job to crack the code.")
            gs.terminal.printText("Wait for the Encryptor to make the code...");
        }
        };

    //Player B receives code, empty code is now defined
    if(incomingMSG.type == Messages.T_TARGET_CODE){
        gs.roleTurn = "Hacker";
        gs.code = incomingMSG.data;
        gs.disable = false;
        gs.codeMade = true;
        gs.terminal.printText("Code made by encryptor!");
        gs.updateCodeOrGuess("guess"); 
        gs.updateTurnTable(gs.roleTurn); //sets it to Hacker
        gs.terminalSetup();
        gs.confirmButtonSetup();    
        gs.setupRed();
        gs.setupOrange();
        gs.setupYellow();
        gs.setupGreen();
        gs.setupBlue();
        gs.setupPurple();
        gs.setupWhite();
        gs.setPlayer(1);
    }
        
    if(incomingMSG.type == Messages.T_MAKE_A_GUESS){   
        gs.setGuess(incomingMSG.data);
        gs.terminal.printText(`Turn ${gs.turn++ + 1}: ${gs.codeOrGuessToHTML("guess")}`);
        gs.updateTurnTable(gs.roleTurn);
    }
    
    //Player A: wait for guesses and update the board ...
    if (incomingMSG.type == Messages.T_GAME_WON_BY) {
        if(incomingMSG.data == 1){
            gs.terminal.printText("You Win!!! The hacker was not able to decrypt your incredible code.");
        } else{
            gs.terminal.printText("You Lose!! The hacker outsmarted you and stole the sacred texts!");
        }
    }     
}; 

socket.onerror = function () {};

