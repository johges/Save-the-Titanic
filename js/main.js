class Game {
    constructor () {
        this.ship = new Ship
        this.icebergsArr = [];
    }
    start() {

        // attach event listener
        this.attachEventListener();

        // make icebergs appear
        setInterval(() => {
            const newIcebergs = new Icebergs();
            this.icebergsArr.push(newIcebergs);
        }, 3000);

        // move icebergs to the left 
        setInterval(() => {
            this.icebergsArr.forEach((iceberg)=> {
                iceberg.moveLeft(); // move
                this.removeIcebergsIfOutside(iceberg); // remove if outside
                this.detectCollision(iceberg); // detect collision
            })
        }, 100);
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
    removeIcebergsIfOutside (iceberg) {
        if(iceberg.positionX < 0 - iceberg.size) {
            iceberg.domElement.remove(); // remove from the dom
            this.icebergsArr.shift(); // remove from the array
        }
    }
    detectCollision(iceberg) {
        if (
            this.ship.positionX < iceberg.positionX + iceberg.size &&
            this.ship.positionX + this.ship.height > iceberg.positionX &&
            this.ship.positionY < iceberg.positionY + iceberg.size &&
            this.ship.positionY + this.ship.width > iceberg.positionY 
        ) {
            // Collision detected!
            console.log("game over")
        }
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
        // create dom element ship
        this.domElement = document.createElement("div");

        // set id ship
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

class Icebergs {
    constructor () {
        this.size = 20;
        this.positionX = 100;
        this.positionY = Math.floor(Math.random() * (100 - this.size + 1)); //
        this.domElement = null;

        this.createDomElement();
        this.createTriangle();
    }
    createDomElement() {
        // create dom element icebergs
        this.domElement = document.createElement("div");

        // set id icebergs
        this.domElement.id = "icebergs";
        this.domElement.style.left = this.positionX + "vw";
        this.domElement.style.bottom = this.positionY + "vh";

        // append to the dom
        const parentElm = document.getElementById("ocean");
        parentElm.appendChild(this.domElement);
    }
    createTriangle() {
        const triangle = document.createElement("div");
        triangle.id = "triangle";
        triangle.style.width = "0";
        triangle.style.height = "0";
        triangle.style.borderLeft = this.size / 2 + "vw solid transparent";
        triangle.style.borderRight = this.size / 2 + "vw solid transparent";
        triangle.style.borderBottom = this.size + "vh solid white";

        // append triangle to iceberg div 
        this.domElement.appendChild(triangle);
    }
    moveLeft() {
        this.positionX -= 2;
        this.domElement.style.left= this.positionX + "vw";
    }
}

const game = new Game();
game.start();