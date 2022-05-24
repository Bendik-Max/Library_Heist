export default class Terminal {
    
    /**
    * Constructor for the Terminal class
    */
    constructor() {
        this.disabled = false;
        this.insertBeforePlace = document.getElementById("insertBeforePlace");
    }

    /** Display text to print in the terminal
    * 
    * @param {*} toPrint - the text to print
    */
    printText(toPrint) {
        if(this.disabled) return;
        const emptyRow = document.createElement("tr");
        emptyRow.innerHTML = "<td><br></td>";
        const row = document.createElement("tr");
        row.setAttribute("class", "cmdBody");
        row.innerHTML = `<td>${toPrint}<td>`;
        this.insertBeforePlace.parentNode.insertBefore(emptyRow, this.insertBeforePlace)
        this.insertBeforePlace.parentNode.insertBefore(row, this.insertBeforePlace);
    }

    /**
    * Getters and setters, mainly used for testing
    */

    setDisabled(disabled) {
        this.disabled = disabled;
    }

    isDisabled() {
        return this.disabled;
    }

    getInsertBeforePlace() {
        return this.insertBeforePlace;
    }

    setInsertBeforePlace(place) {
        this.insertBeforePlace = place;
    }

    getEnvironment() {
        return document;
    }

    setEnvironment(environment) {
        this.environment = environment;
    }

}

