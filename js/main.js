class Game {
    constructor () {
        this.ship = new Ship
        this.icebergsArr = [];
        this.numberOfIcebergsPassed = 0;
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

            game.icebergsPassed(); // counts passed icebergs
        }
    }
    icebergsPassed() {
        this.numberOfIcebergsPassed++;
        if (this.numberOfIcebergsPassed >= 3) {
            location.href = "./winningpage.html";
        }
    }

    detectCollision(iceberg) {
            const shipLeft = this.ship.positionX;
            const shipRight = this.ship.positionX + this.ship.width;
            const shipTop = this.ship.positionY;
            const shipBottom = this.ship.positionY + this.ship.height;
        
            const icebergLeft = iceberg.positionX;
            const icebergRight = iceberg.positionX + iceberg.size;
            const icebergTop = iceberg.positionY;
            const icebergBottom = iceberg.positionY + iceberg.size;
        
            if (
                shipLeft < icebergRight &&
                shipRight > icebergLeft &&
                shipTop < icebergBottom &&
                shipBottom > icebergTop
                || // Oder-Bedingung hinzufügen für untere Kollision
                shipTop < icebergBottom &&
                shipBottom > icebergBottom &&
                shipLeft < icebergRight &&
                shipRight > icebergLeft
        ) {
            // Collision detected!
            location.href = "./gameover.html";
        }
    }
}

class Ship {
    constructor() {
        this.width = 17;
        this.height = 12;
        this.positionX = 0;
        this.positionY = 50 - (this.height / 2);
        this.domElement = null;

        this.createDomElement();
    }
    createDomElement() {
        // create dom element ship
        this.domElement = document.createElement("img");

        // set id ship
        this.domElement.src = "./images/titanic.png"
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