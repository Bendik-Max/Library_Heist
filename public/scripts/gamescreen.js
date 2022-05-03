const GameState = function(socket){
    this.socket = socket; //websocket*/
    let colours = ["red", "orange", "yellow", "green", "blue", "purple", "white"];
    for(let bool of [this.codeMade, this.guessMade, this.tryConfirmCode, this.tryConfirmGuess, this.disable, this.hackerWon]) bool = false;
    this.code = [];
    this.guess = [];
    this.data = [];
    this.currentTyping = document.getElementById("currentTyping");
    this.roleTurn = "Encryptor"; //the role of the player who has the turn
    this.turn = 0; //current turn of hacker
    this.confirmButton = document.getElementById("confirmButton");
    for(let i = 0; i < colours.length; i++) {
        this[colours[i]] = document.getElementById(`${colours[i]}`);
    }
    this.player = null;
};

GameState.prototype.setupRed = function() {
    this.red.onclick = function() {
        this.makeCodeOrGuess.bind(this)("red");
    }.bind(this);
}

GameState.prototype.setupRoleTurn = function(w) {
    this.roleTurn = w;
}.bind(this);

GameState.prototype.setupOrange = function() {
    this.orange.onclick = function() {
        this.makeCodeOrGuess.bind(this)("orange");
    }.bind(this);
}

GameState.prototype.setupYellow = function() {
    this.yellow.onclick = function() {
        this.makeCodeOrGuess.bind(this)("yellow");
    }.bind(this);
}

GameState.prototype.setupGreen = function() {
    this.green.onclick = function() {
        this.makeCodeOrGuess.bind(this)("green");
    }.bind(this);
}

GameState.prototype.setupBlue = function() {
    this.blue.onclick = function() {
        this.makeCodeOrGuess.bind(this)("blue");
    }.bind(this);
}

GameState.prototype.setupPurple = function() {
    this.purple.onclick = function() {
        this.makeCodeOrGuess.bind(this)("purple");
    }.bind(this);
}

GameState.prototype.setupWhite = function() {
    this.white.onclick = function() {
        this.makeCodeOrGuess.bind(this)("white");
    }.bind(this);
}

GameState.prototype.confirmButtonSetup = function() {
    this.confirmButton.onclick = this.confirmCodeOrGuess.bind(this);
};

GameState.prototype.updateRoles = function (hackerPar, encryptorPar) {
    const hacker = document.getElementById("hacker");
    const encryptor = document.getElementById("encryptor");
    hacker.innerHTML = `Hacker: ${hackerPar}`;
    encryptor.innerHTML = `Encryptor: ${encryptorPar}`;
}

//print text to cmd
GameState.prototype.printText = function(toPrint) {
    const insertBeforePlace = document.getElementById("insertBeforePlace");
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = "<td><br></td>";
    const row = document.createElement("tr");
    row.setAttribute("class", "cmdBody");
    row.innerHTML = `<td>${toPrint}<td>`;
    insertBeforePlace.parentNode.insertBefore(emptyRow, insertBeforePlace)
    insertBeforePlace.parentNode.insertBefore(row, insertBeforePlace);
};


GameState.prototype.terminalSetup = function() {
    const execute = (e) => {
        if(this.disable) return;
        let key = e.key;
        if(key == "Enter") { //submit the data
            let str = "";
            for(let i = 0; i < this.data.length; i++) {
                str += this.data[i];
            }
            this.printText(str); //print whatever you typed
            if(this.tryConfirmCode) {
                if(str === "yes") {
                    this.confirmCode.bind(this)();
                } else {
                    this.printText.bind(this)("It looks like you didn't enter \"yes\", try again later.");
                }
            } else if(this.tryConfirmGuess){
                if(str === "yes") {
                    this.confirmGuess.bind(this)();
                } else {
                    this.printText.bind(this)("It looks like you didn't enter \"yes\", try again later.");
                }
            } else {
                this.makeCodeOrGuess.bind(this)(str);
            }
            while(this.data.length > 0) {
                this.data.pop();
            }
            this.updateCurrentTyping.bind(this)()
        } else if(key == "Backspace") { //remove character if possible
            if(this.data.length > 0) {
                this.data.pop();
                this.updateCurrentTyping.bind(this)();
            }
        } else {
            if(String(key).length === 1) { //only add to data if valid character
                this.data.push(String(key));
                this.updateCurrentTyping.bind(this)();
            }
        }
    };
    const executeBound = execute.bind(this);
    document.addEventListener("keydown", function(e) {
        executeBound(e);
    });
};

 //turns code into html with images, used in updateCodeOrGuess
GameState.prototype.codeOrGuessToHTML = function(cg) {
    if(cg === "code") {
        result = "";
        for(let i = 0; i < this.code.length; i++) {
            result += `<img src = "imgs/${this.code[i]}.png" alt = "${this.code[i]}" width = 20 heigth = 20>`;
        }
        return result;
    } else {
        result = "";
        for(let i = 0; i < this.guess.length; i++) {
            result += `<img src = "imgs/${this.guess[i]}.png" alt = "${this.guess[i]}" width = 20 heigth = 20>`;
        }
        return result;
    }
};

//updates the table row in the terminal displaying the current code or guess
GameState.prototype.updateCodeOrGuess = function(type) {
    const dataNew = document.getElementById("codeOrGuess");
    if(type === "code") {
        let images = "code: " + this.codeOrGuessToHTML("code");
        dataNew.innerHTML = images
    } else {
        let images = "current guess: " + this.codeOrGuessToHTML("guess");
        dataNew.innerHTML = images
    }
}

//update turntable depending on whose turn it is
GameState.prototype.updateTurnTable = function(role) {
    const turnTable = document.getElementById("turn");
    if(role == "Encryptor") {
        turnTable.innerHTML = "Encryptor is making a code...";
    } else {
        turnTable.innerHTML = `Hacker has ${String(10-this.turn)} guesses left`;
    }
};

//confirm button, functions as confirm for code or guess
GameState.prototype.confirmCodeOrGuess = function() {
    if(this.codeMade) {
        this.confirmGuess();
    } else {
        this.confirmCode();
    }
};

//code or guess is made with input
GameState.prototype.makeCodeOrGuess = function(colour) {
    if(!this.codeMade) {
        this.addToCode(colour);
    } else {
        this.addToGuess(colour);
    }
};

//resets the code if the code hasn't already been made
GameState.prototype.resetCode = function() {
    if(this.codeMade) {
        this.printText("You can't reset the code when it's already been confirmed.");
    } else {
        while(this.code.length > 0) {
        this.code.pop();
        }
    }
};

//resets the guess if possible
GameState.prototype.resetGuess = function() {
   if(this.guessMade) {
       this.printText("You can't reset a guess that has already been made.");
   } else {
       while(this.guess.length > 0) {
           this.guess.pop();
       }
   }
};

//make the player confirm the code if it has 6 colours
GameState.prototype.confirmCode = function() {
    if(this.code.length < 6) {
        this.printText("You can only confirm a code with 6 colours!");
    } else {
        this.tryConfirmCode = false;
        this.roleTurn = "Hacker";
        this.updateTurnTable(this.roleTurn);
        this.updateCodeOrGuess("guess");
        this.printText("Code has been confirmed!");

        /*relay the information to the server with the socket*/
        let setCode = Messages.O_TARGET_CODE;
        setCode.data = this.code;
        this.disable = true;
        this.socket.send(JSON.stringify(setCode));
    }
};

//make the player confirm the guess if it has 6 colours
GameState.prototype.confirmGuess = function() {
    if(this.disable) return;
    if(this.guess.length < 6) {
        this.printText("You can only confirm a guess with 6 colours!");
    } else {
        this.tryConfirmGuess = false;
        this.guessMade = true;
        
        /*send to socket before we check guess*/
        let setGuess = Messages.O_MAKE_A_GUESS;
        setGuess.data = this.guess;
        this.socket.send(JSON.stringify(setGuess));

        this.checkGuess();
    }
};

GameState.prototype.setPlayer = function(w) {
    this.player = w;
}

//checks if the guess is equal to the code if both the guess and code are valid
GameState.prototype.checkGuess = function() {
    let copycode = this.code.slice();
    if(!this.codeMade) {
        this.printText("You can't check a guess if the code hasn't been made!");
    } else if(!this.guessMade) {
        this.printText("The guess isn't valid to be checked");
    } else {
        this.printText(`Turn ${String(this.turn + 1)}: ${this.codeOrGuessToHTML("guess")}`);
        this.guessMade = false;
        //figure out how many completely correct and right colours
        let counts = this.amountColours();
        let correctPlace = 0;
        let correctColours = 0;
        for(let i = 0; i < this.guess.length; i++) { //take care of correct place
            const col = this.guess[i];
            if(copycode[i] === col) {
                correctPlace++;
                switch(col) {
                    case "red": counts[0] = counts[0] - 1; break;
                    case "orange": counts[1] = counts[1] - 1; break;
                    case "yellow": counts[2] = counts[2] -1;; break;
                    case "green": counts[3] = counts[3] - 1; break;
                    case "blue": counts[4] = counts[4] - 1; break;
                    case "purple": counts[5] = counts[5] - 1; break;
                    case "white": counts[6] = counts[6] - 1; break;
                }
                copycode[i] = "correct";
            }
        }
        for(let col of this.guess) { //take care of wrong place 
            if(col === "correct") continue;
            let shouldAdd = false;
            switch(col) {
                case "red": 
                    if(counts[0] > 0){
                        counts[0]--;
                        shouldAdd = true;
                    } 
                    break;
                case "orange": 
                    if(counts[1] > 0){
                        counts[1]--;
                        shouldAdd = true;
                    } 
                    
                    break;
                case "yellow":
                    if(counts[2] > 0){
                        counts[2]--;
                        shouldAdd = true;
                    }
                    break;
                case "green":
                    if(counts[3] > 0){
                        counts[3]--;
                        shouldAdd = true;
                    }
                    break;
                case "blue":
                    if(counts[4] > 0){
                        counts[4]--;
                        shouldAdd = true;
                    }
                    break;
                case "purple":
                    if(counts[5] > 0){
                        counts[5]--;
                        shouldAdd = true;
                    }
                    break;
                case "white":
                    if(counts[6] > 0){
                        counts[6]--;
                        shouldAdd = true;
                    }
                    break;
            }
            if(shouldAdd) correctColours++;
        }
        if(correctPlace === 6) {
            this.printText("You cracked the code!");
            this.hackerWon = true;
            /*send this to the server*/
            let win = Messages.O_GAME_WON_BY;
            win.data = 2;
            this.disable = true;
            this.socket.send(JSON.stringify(win));
        } else if(correctColours === 1) {
            this.printText(`You got ${correctColours} colour correct but in the wrong place and ${correctPlace} completely correct`);
        } else {
            this.printText(`You got ${correctColours} colours correct but in the wrong place and ${correctPlace} completely correct`);
        }
        this.turn++;
        if(this.turn > 9){
            this.printText("You lose evil hacker scum!");
            this.disable = true;
            let lose = Messages.O_GAME_WON_BY;
            lose.data = 1;
            this.roleTurn = "Hacker"; //might not be neccessary
            this.updateTurnTable(this.roleTurn)
            this.socket.send(JSON.stringify(lose));
        }
        this.updateTurnTable(this.roleTurn)
    }
}


//determines the amount of appearances for each colour in the code or guess
GameState.prototype.amountColours = function() {
    let colours = [0, 0, 0, 0, 0, 0, 0] //red, orange, yellow, green, blue, purple, white 
    for(let i = 0; i < this.code.length; i++) {
        switch(this.code[i]) {
            case "red": colours[0]++; break;
            case "orange": colours[1]++; break;
            case "yellow": colours[2]++; break;
            case "green": colours[3]++; break;
            case "blue": colours[4]++; break;
            case "purple": colours[5]++; break;
            case "white": colours[6]++; break;
            default: break;
        }
    }
    return colours;
};

//add a colour to the guess if it's a valid move
GameState.prototype.addToCode = function(input) {
    if(this.disable) return;
    if(this.codeMade) {
        this.printText("The code has already been made.");
    } else {
        input = `${input}`.toLowerCase();
        if(input === "red" || input === "orange" || input === "yellow" || input === "green" || input === "blue" || 
        input === "purple" || input === "white") {
            if(this.code.length === 6) {
                this.resetCode();
                this.printText("Code has been reset because the length was already six colours.");
            }
            this.code.push(`${input}`);
            this.updateCodeOrGuess("code");
            if(this.code.length === 6) { //ask for confirm
                this.printText("Enter \"yes\" or press the confirm button if you wish to confirm your code.");
                this.tryConfirmCode = true;
            } else {
                this.tryConfirmCode = false;
            }
        } else {
            this.printText("Please enter a valid colour.");
        }      
    }
};

//add input to guess if possible
GameState.prototype.addToGuess = function(input) {
    if(this.disable) return;
    if(!this.codeMade) {
        this.printText("The code has to be made before you can add to your guess");
    } else if(this.guessMade){
        this.printText("This guess has already been made.")
    } else {
        input = `${input}`.toLowerCase();
        if(input === "red" || input === "orange" || input === "yellow" || input === "green" || input === "blue" || 
        input === "purple" || input === "white") {
            if(this.guess.length === 6) {
                this.resetGuess();
                this.printText("Guess has been reset because the length was already six colours.");
            }
            this.guess.push(`${input}`);
            if(this.guess.length === 6) { //ask for confirmation
                this.printText("Enter \"yes\" or press the confirm button if you wish to confirm your guess.");
                this.tryConfirmGuess = true;
            } else {
                this.tryConfirmGuess = false;
            }
            this.updateCodeOrGuess("guess");
        } else {
            this.printText("Please enter a valid colour.");
        }   
    }
};

//updates the currentTyping td
GameState.prototype.updateCurrentTyping = function() {
    if(this.disable) return;
    let str = "";
    for(let i = 0; i < this.data.length; i++) {
        str += this.data[i];
    }
    this.currentTyping.innerHTML = str;
};


(function setup() {
    const socket = new WebSocket(Setup.WEB_SOCKET_URL);

    const gs = new GameState(socket);

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
                gs.printText("Please enter a code using the coloured buttons or by entering the colours: red, orange, yellow, green, blue, purple or white:");
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
                gs.printText("You are the hacker! It's your job to crack the code.")
                gs.printText("Wait for the Encryptor to make the code...");
            }
        };

        //Player B receives code, empty code is now defined
        if(incomingMSG.type == Messages.T_TARGET_CODE){
            gs.roleTurn = "Hacker";
            gs.code = incomingMSG.data;
            gs.disable = false;
            gs.codeMade = true;
            console.log("code received by player 2");
            console.log(this.code);
            gs.printText("Code made by encryptor!");
            gs.updateCodeOrGuess("guess"); 
            gs.updateTurnTable(gs.roleTurn); //sets it to Hacker
            console.log(this.disable);
            gs.terminalSetup();
            gs.confirmButtonSetup();    
            gs.setupRed();
            gs.setupOrange();
            gs.setupYellow();
            gs.setupGreen();
            gs.setupBlue();
            gs.setupPurple();
            gs.setupWhite();
        }
        
        if(incomingMSG.type == Messages.T_MAKE_A_GUESS){   
            gs.printText(`Hacker is on turn ${gs.turn++ + 1}`);
            gs.updateTurnTable(gs.roleTurn);
        }
        //Player A: wait for guesses and update the board ...
        if (incomingMSG.type == Messages.T_GAME_WON_BY) {
            if(incomingMSG.data == 1){
                gs.printText("You Win!!! The hacker was not able to decrypt your incredible code.");
            } else{
                gs.printText("You Lose!! The hacker outsmarted you and stole the sacred texts!");
            }
          }
        
        socket.onerror = function () {};
      }; //execute immediately
    })();


