/**
 * @jest-environment jsdom
 */

//the upper comment is needed s.t. the document is not null

import Terminal from "../scripts/terminal.js";
import GameState from "../scripts/gamestate.js";

let g1;
let terminal;
let printMock;
const Messages = require('../scripts/messages.js');

beforeEach(() => {
    terminal = new Terminal();
    printMock = jest.fn();
    terminal.printText = printMock; //mocking printText function of terminal
    g1 = new GameState(null, terminal);
})

test('amountColours one colour', () => {
    const input = ["red"];
    expect(g1.amountColours(input)).toEqual([1,0,0,0,0,0,0]);
})

test('amountColours all colours', () => {
    const input = ["red", "orange", "yellow", "green", "blue", "purple", "white"];
    expect(g1.amountColours(input)).toEqual([1,1,1,1,1,1,1]);
})

test('amountColours empty', () => {
    expect(g1.amountColours([])).toEqual([0,0,0,0,0,0,0]);
})

test('amountColours not real colour', () => {
    expect(g1.amountColours(["notreal"])).toEqual([0,0,0,0,0,0,0]);
})

test('inCorrectPlace guess not length 6', () => {
    expect(() => {
        g1.inCorrectPlace(["red"], 
        ["red", "red", "red", "red", "red", "red"], 
        [1,0,0,0,0,0,0])
    }).toThrow('Guess must be 6 colours');
})

test('inCorrectPlace code not length 6', () => {
    expect(() => {
        g1.inCorrectPlace(["red", "red", "red", "red", "red", "red"], 
        ["red"],
        [1,0,0,0,0,0,0])
    }).toThrow('Code must be 6 colours');
})

test('inCorrectPlace all correct', () => {
    let guess = ["red", "orange", "yellow", "green", "blue", "purple"];
    let code = ["red", "orange", "yellow", "green", "blue", "purple"];
    let counts = g1.amountColours(code);
    expect(g1.inCorrectPlace(guess, code, counts)).toBe(6);
})

test('inCorrectPlace one correct', () => {
    let guess = ["white", "white", "white", "white", "white", "white"];
    let code = ["white", "orange", "yellow", "green", "blue", "purple"];
    let counts = g1.amountColours(code);
    expect(g1.inCorrectPlace(guess, code, counts)).toBe(1);
})

test('inCorrectPlace no correct', () => {
    let guess = ["red", "orange", "yellow", "green", "blue", "purple"];
    let code = ["orange", "yellow", "green", "blue", "purple", "red"];
    let counts = g1.amountColours(code)
    expect(g1.inCorrectPlace(guess, code, counts)).toBe(0);
})

test('rightColourWrongPlace guess not length 6', () => {
    expect(() => {
        g1.rightColourWrongPlace(["red"], [1,0,0,0,0,0,0])
    }).toThrow('Guess must be 6 colours');
})

test('rightColourWrongPlace none', () => {
    //input is [white, white, white, white, white, white]
    expect(g1.rightColourWrongPlace(["red", "orange", "yellow", "green", "blue", "purple"], [0,0,0,0,0,0,6])).toBe(0);
})

test('rightColourWrongPlace two, ignore colours not in there', () => {
    //input is [orange, red, red, white, white, white]
    const code = ["orange", "red", "red", "white", "white", "white"];
    const guess = ["red", "orange", "yellow", "green", "blue", "purple"];
    const counts = g1.amountColours(code);
    g1.inCorrectPlace(guess, code, counts);
    expect(g1.rightColourWrongPlace(guess, counts)).toBe(2);
})

test('rightColourWrongPlace all', () => {
    const code = ["red", "orange", "yellow", "green", "blue", "white"];
    const guess = ["orange", "yellow", "green", "blue", "white", "red"];
    const counts = g1.amountColours(code);
    g1.inCorrectPlace(guess, code, counts);
    expect(g1.rightColourWrongPlace(guess, counts)).toBe(6);
})

test('rightColourWrongPlace duplicates', () => { 
    const code = ["red", "red", "orange", "orange", "blue", "blue"];
    const guess = ["orange", "correct", "correct", "green", "correct", "orange"];
    const counts = g1.amountColours(code);
    g1.inCorrectPlace(guess, code, counts);
    expect(g1.rightColourWrongPlace(guess, counts)).toBe(2);
})

test('checkGuess code not made', () => {
    g1.codeMade = false;
    g1.checkGuess();
    //expect printText to be called once
    expect(printMock.mock.calls.length).toBe(1); 
    //expect printText to be called with correct text
    expect(printMock.mock.calls[0][0]).toBe("You can't check a guess if the code hasn't been made!");
})

test('checkGuess guess not made', () => {
    g1.codeMade = true;
    g1.guessMade = false;
    g1.checkGuess();
    //expect printText to be called once
    expect(printMock.mock.calls.length).toBe(1); 
    //expect printText to be called with correct text
    expect(printMock.mock.calls[0][0]).toBe("The guess isn't valid to be checked!");
})


//breaks!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
test('checkGuess 2 correct, 2 wrong place', () => {
    g1.codeMade = true;
    g1.guessMade = true;
    g1.turn = 0;
    g1.code = ["red", "red", "red", "red", "orange", "orange"];
    g1.guess = ["red", "red", "orange", "orange", "yellow", "yellow"];
    const guessToHtml = "<img src = \"imgs/red.png\" alt = \"red\" width = 20 heigth = 20><img src = \"imgs/red.png\" alt = \"red\" width = 20 heigth = 20><img src = \"imgs/orange.png\" alt = \"orange\" width = 20 heigth = 20><img src = \"imgs/orange.png\" alt = \"orange\" width = 20 heigth = 20><img src = \"imgs/yellow.png\" alt = \"yellow\" width = 20 heigth = 20><img src = \"imgs/yellow.png\" alt = \"yellow\" width = 20 heigth = 20>"
    let turnMock = jest.fn();
    g1.updateTurnTable = turnMock;
    g1.checkGuess();

    //expect printText to be called with turn 1 first
    expect(printMock.mock.calls[0][0]).toBe("Turn 1: " + guessToHtml);
    //expect printText to be called with proper amounts of correct colours after
    expect(printMock.mock.calls[1][0]).toBe("You got 2 colours correct but in the wrong place and 2 completely correct");
    //expect printText to be called twice
    expect(printMock.mock.calls.length).toBe(2);
    
     
    expect(g1.guessMade).toBeFalsy();
    expect(g1.turn).toBe(1);
    //updateTurnTable should be called once
    expect(turnMock.mock.calls.length).toBe(1);
})

//breaks!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
test('checkGuess 2 correct, 1 wrong place', () => {
    g1.codeMade = true;
    g1.guessMade = true;
    g1.turn = 0;
    g1.code = ["red", "red", "red", "red", "orange", "orange"];
    g1.guess = ["red", "red", "yellow", "orange", "yellow", "yellow"];
    const guessToHtml = "<img src = \"imgs/red.png\" alt = \"red\" width = 20 heigth = 20><img src = \"imgs/red.png\" alt = \"red\" width = 20 heigth = 20><img src = \"imgs/yellow.png\" alt = \"yellow\" width = 20 heigth = 20><img src = \"imgs/orange.png\" alt = \"orange\" width = 20 heigth = 20><img src = \"imgs/yellow.png\" alt = \"yellow\" width = 20 heigth = 20><img src = \"imgs/yellow.png\" alt = \"yellow\" width = 20 heigth = 20>"
    let turnMock = jest.fn();
    g1.updateTurnTable = turnMock;
    g1.checkGuess();

    //expect printText to be called with turn 1 first
    expect(printMock.mock.calls[0][0]).toBe("Turn 1: " + guessToHtml);
    //expect printText to be called with proper amounts of correct colours after
    expect(printMock.mock.calls[1][0]).toBe("You got 1 colour correct but in the wrong place and 2 completely correct");
    //expect printText to be called twice
    expect(printMock.mock.calls.length).toBe(2);
    
     
    expect(g1.guessMade).toBeFalsy();
    expect(g1.turn).toBe(1);
    //updateTurnTable should be called once
    expect(turnMock.mock.calls.length).toBe(1);
})

/* These tests don't work yet because Messages is undefined
test('checkGuess 6 correct', () => {
    g1.codeMade = true;
    g1.guessMade = true;
    g1.turn = 0;
    g1.code =  ["red", "red", "yellow", "orange", "yellow", "yellow"];
    g1.guess = ["red", "red", "yellow", "orange", "yellow", "yellow"];
    const guessToHtml = "<img src = \"imgs/red.png\" alt = \"red\" width = 20 heigth = 20><img src = \"imgs/red.png\" alt = \"red\" width = 20 heigth = 20><img src = \"imgs/yellow.png\" alt = \"yellow\" width = 20 heigth = 20><img src = \"imgs/orange.png\" alt = \"orange\" width = 20 heigth = 20><img src = \"imgs/yellow.png\" alt = \"yellow\" width = 20 heigth = 20><img src = \"imgs/yellow.png\" alt = \"yellow\" width = 20 heigth = 20>"
    let turnMock = jest.fn();
    g1.updateTurnTable = turnMock;
    g1.socket = {emit: jest.fn()};
    g1.checkGuess();
    
    //expect printText to be called with turn 1 first
    expect(printMock.mock.calls[0][0]).toBe("Turn 1: " + guessToHtml);
    //expect printText to be called with win message
    expect(printMock.mock.calls[1][0]).toBe("You cracked the code!");
    //expect printText to be called twice
    expect(printMock.mock.calls.length).toBe(2);

    expect(g1.hacker).toBeTruthy();
    expect(g1.disable).toBeTruthy();
    expect(g1.turn).toBe(1);
    //updateTurnTable should be called once
    expect(turnMock.mock.calls.length).toBe(1);

    //socket stuff here
})


test('checkGuess 0 correct, 0 wrong place, hacker loses', () => {
    g1.codeMade = true;
    g1.guessMade = true;
    g1.turn = 9;
    g1.code = ["red", "red", "red", "red", "red", "red"];
    g1.guess = ["purple", "purple", "purple", "purple", "purple", "purple"];
    const guessToHtml = "<img src = \"imgs/purple.png\" alt = \"purple\" width = 20 heigth = 20><img src = \"imgs/purple.png\" alt = \"purple\" width = 20 heigth = 20><img src = \"imgs/purple.png\" alt = \"purple\" width = 20 heigth = 20><img src = \"imgs/purple.png\" alt = \"purple\" width = 20 heigth = 20><img src = \"imgs/purple.png\" alt = \"purple\" width = 20 heigth = 20><img src = \"imgs/purple.png\" alt = \"purple\" width = 20 heigth = 20>"
    let turnMock = jest.fn();
    g1.updateTurnTable = turnMock;
    g1.socket = {emit: jest.fn()};
    g1.checkGuess();

    //expect printText to be called with turn 1 first
    expect(printMock.mock.calls[0][0]).toBe("Turn 1: " + guessToHtml);
    //expect printText to be called with proper amounts of correct colours after
    expect(printMock.mock.calls[1][0]).toBe("You got 0 colours correct but in the wrong place and 0 completely correct");
    //expect hacker lose message
    expect(printMock.mock.calls[2][0]).toBe("You lose evil hacker scum!");
    //expect printText to be called three times
    expect(printMock.mock.calls.length).toBe(3);

    expect(g1.guessMade).toBeFalsy();
    expect(g1.turn).toBe(10);
    expect(g1.disable).toBeTruthy();
    //updateTurnTable should be called once
    expect(turnMock.mock.calls.length).toBe(1);

    //socket stuff here
})
*/