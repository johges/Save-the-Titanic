const timerElement = document.getElementById("timer");

class Game {
    constructor() {
        this.ship = new Ship
        this.icebergsArr = [];
        this.numberOfIcebergsPassed = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.updateTimer = this.updateTimer.bind(this);
        this.lastTime = 0;
    }

    start() {
        //start the timer
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);


        // attach event listener
        this.attachEventListener();

        // track acceleration state
        this.isAccelerated = false;

        // make icebergs appear
        setInterval(() => {
            const newIcebergs = new Icebergs(this.isAccelerated);
            this.icebergsArr.push(newIcebergs);
        }, 1000);

        // move icebergs to the left 
        setInterval(() => {
            this.icebergsArr.forEach((iceberg) => {
                iceberg.moveLeft(); // move
                this.removeIcebergsIfOutside(iceberg); // remove if outside
                this.detectCollision(iceberg); // detect collision
            })
        }, 100);
    }

    updateTimer() {
        const currentTime = Date.now();
        const elapsedTime = (currentTime - this.startTime) / 1000;
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = Math.floor(elapsedTime % 60);
        const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        timerElement.textContent = formattedTime;
    }

    attachEventListener() {
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowDown") {
                this.ship.moveDown();
            } else if (event.key === "ArrowUp") {
                this.ship.moveUp();
            } else if (event.key === "ArrowRight") {
                this.toggleAcceleration();
            }
        })
    }

    toggleAcceleration() {
        this.isAccelerated = true;
        this.accelerateVisibleIcebergs();
        setTimeout(() => {
            this.isAccelerated = false;
        }, 6000);
    }

    accelerateVisibleIcebergs() {
        this.icebergsArr.forEach((iceberg) => {
            if (iceberg.positionX <= 100) {
                iceberg.isAccelerated = true;
            }
        });

        setTimeout(() => {
            this.icebergsArr.forEach((iceberg) => {
                if (iceberg.positionX <= 100) {
                    iceberg.isAccelerated = false;
                }
            })
        }, 6000);
    }

    removeIcebergsIfOutside(iceberg) {
        if (iceberg.positionX < 0 - iceberg.size) {
            iceberg.domElement.remove(); // remove from the dom
            this.icebergsArr.shift(); // remove from the array
            game.icebergsPassed(); // counts passed icebergs
        }
    }

    icebergsPassed() {
        this.numberOfIcebergsPassed++;
        if (this.numberOfIcebergsPassed >= 10) {

            // all icebergs passed
            location.href = "./winningpage.html";
        }
    }

    detectCollision(iceberg) {
        const shipLeft = this.ship.positionX;
        const shipRight = this.ship.positionX + this.ship.width;
        const shipTop = this.ship.positionY + this.ship.height;
        const shipBottom = this.ship.positionY;

        const icebergLeft = iceberg.positionX;
        const icebergRight = iceberg.positionX + iceberg.size;
        const icebergTop = iceberg.positionY + iceberg.size;
        const icebergBottom = iceberg.positionY;

        if (
            shipLeft < icebergRight &&
            shipRight > icebergLeft &&
            shipTop > icebergBottom &&
            shipBottom < icebergTop
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
        if (this.positionY < 100 - this.height) {
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
    constructor(isAccelerated) {
        this.size = 10;
        this.positionX = 100;
        this.positionY = Math.floor(Math.random() * (100 - this.size + 1)); //
        this.domElement = null;

        this.isAccelerated = isAccelerated;

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
        triangle.style.width = "0";
        triangle.style.height = "0";
        triangle.style.borderLeft = this.size / 2 + "vw solid transparent";
        triangle.style.borderRight = this.size / 2 + "vw solid transparent";
        triangle.style.borderBottom = this.size + "vh solid transparent";
        triangle.style.position = "relative";

        // image positioning in centre of triangle
        const centerX = this.size / 2;
        const centerY = this.size;

        // add the iceberg image
        const icebergImage = document.createElement("img");
        icebergImage.src = "./images/iceberg.png";
        icebergImage.style.width = this.size + "vw";
        icebergImage.style.height = this.size + "vh";
        icebergImage.style.position = "absolute";
        icebergImage.style.left = `calc(50% - ${centerX}vw)`;
        icebergImage.style.bottom = `calc(100% - ${centerY}vh)`;

        // apply acceleration if it's currently active
        const speed = this.isAccelerated ? 4 : 2;
        this.positionX -= speed;

        // append image to triangle
        triangle.appendChild(icebergImage);

        // append triangle to iceberg div 
        this.domElement.appendChild(triangle);
    }
    moveLeft() {
        if (this.positionX > 0 - this.size) {
        const speed = this.isAccelerated ? 4 : 2;
        this.positionX -= speed;
        this.domElement.style.left = this.positionX + "vw";
        }
    }
}

const game = new Game();
game.start();