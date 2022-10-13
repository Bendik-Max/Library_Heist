/**
 * @jest-environment jsdom
 */

//the upper comment is needed s.t. the document is not null


import Terminal from "../scripts/terminal.js";

let terminal;
let environment; //the document

/**
 * Setup before each test
 */

beforeEach(() => {
    terminal = new Terminal();
    environment = terminal.getEnvironment();
    let parent = environment.createElement("table"); //fake version of the table
    let insertBefore = environment.createElement("tr"); //a fake version of the insertBeforePlace
    insertBefore.setAttribute("id", "insertBeforePlace");
    insertBefore.innerHTML = "<td>Some text here</td>";
    parent.appendChild(insertBefore);
    terminal.setInsertBeforePlace(insertBefore);
})

/**
 * Test the printText function of the Terminal class
 */

test('printText disabled', () => {
    //insertBeforePlace should have no siblings above it
    terminal.setDisabled(true);
    terminal.printText("This should not print");
    expect(terminal.getInsertBeforePlace().previousSibling).toBe(null);
});

test('printText once', () => {
    //insertBeforePlace should have two siblings above it
    terminal.setDisabled(false);
    terminal.printText("This should print");
    expect(terminal.getInsertBeforePlace().previousSibling.innerHTML).toBe("<td>This should print</td><td></td>");
    expect(terminal.getInsertBeforePlace().previousSibling.previousSibling.innerHTML).toBe("<td><br></td>");
    expect(terminal.getInsertBeforePlace().previousSibling.previousSibling.previousSibling).toBe(null);
})

test('printText twice', () => {
    //insertBeforePlace should have four siblings above it
    terminal.setDisabled(false);
    terminal.printText("This should print first");
    terminal.printText("This should print after");
    expect(terminal.getInsertBeforePlace().previousSibling.innerHTML).toBe("<td>This should print after</td><td></td>");
    expect(terminal.getInsertBeforePlace().previousSibling.previousSibling.innerHTML).toBe("<td><br></td>");
    expect(terminal.getInsertBeforePlace().previousSibling.previousSibling.previousSibling.innerHTML).toBe("<td>This should print first</td><td></td>");
    expect(terminal.getInsertBeforePlace().previousSibling.previousSibling.previousSibling.previousSibling.innerHTML).toBe("<td><br></td>");
    expect(terminal.getInsertBeforePlace().previousSibling.previousSibling.previousSibling.previousSibling.previousSibling).toBe(null);
})

/**
 * Testing getters and setters
 */

test('isDisabled false', () => {
    terminal.setDisabled(false);
    expect(terminal.isDisabled()).not.toBeTruthy();
})

test('isDisabled true', () => {
    terminal.setDisabled(true);
    expect(terminal.isDisabled()).toBeTruthy();
})

test('insertBeforePlace getter/setter', () => {
    let place = environment.createElement("tr");
    terminal.setInsertBeforePlace(place);
    expect(terminal.getInsertBeforePlace()).toBe(place);
})

test('environment getter/setter', () => {
    let env = document;
    terminal.setEnvironment(env);
    expect(terminal.getEnvironment()).toBe(env);
})
