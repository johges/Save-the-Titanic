class Game {
    constructor () {
        this.ship = new Ship
    }
    start() {

        // attach event listener
        this.attachEventListener();
    }
    attachEventListener() {
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowDown") {
                this.ship.moveDown();
            } else if (event.key === "ArrowUp") {
                this.ship.moveUp();
            }
        })
    }
    }

class Ship {
    constructor() {
        this.width = 20;
        this.height = 10;
        this.positionX = 0;
        this.positionY = 50 - (this.height / 2);
        this.domElement = null;

        this.createDomElement();
    }
    createDomElement() {
        // create dom element
        this.domElement = document.createElement("div");

        // set id 
        this.domElement.id = "ship";
        this.domElement.style.width = this.width + "vw";
        this.domElement.style.height = this.height + "vh";
        this.domElement.style.left = this.positionX + "vw";
        this.domElement.style.bottom = this.positionY + "vh";

        // append to the dom
        const parentElm = document.getElementById("ocean");
        parentElm.appendChild(this.domElement);
    }
    moveUp() {
        if (this.positionY < 100 -this.height) {
        this.positionY++;
        this.domElement.style.bottom = this.positionY + "vh";
        }
    }
    moveDown() {
        if (this.positionY > 0) {
        this.positionY--;
        this.domElement.style.bottom = this.positionY + "vh";
        }
    }
}

const game = new Game();
game.start();