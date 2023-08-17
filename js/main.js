const timerElement = document.getElementById("timer");
let backgroundPosition = 100;

class Game {
    constructor() {
        this.ship = new Ship
        this.icebergsArr = [];
        this.octopusArr = [];
        this.coalIslandArr = [];
        this.numberOfIcebergsPassed = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.updateTimer = this.updateTimer.bind(this);
        this.startBackgroundMovement();
        this.bgSound = new Audio("./sounds/ocean-background-sound.mp3");
        this.bgSound.loop = true;
        this.startBackgroundSound();
        this.coalIslandCollisionSound = new Audio("./sounds/boat-horn.mp3");
        this.octopusCollisionSound = new Audio("./sounds/octopus-sound.mp3");
    }

    startBackgroundMovement() {
        this.moveBackground();
    }

    start() {
        this.startBackgroundSound();
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

        // make coal islands appear
        setInterval(() => {
            const newCoalIsland = new CoalIsland(this.isAccelerated);
            this.coalIslandArr.push(newCoalIsland);
        }, 3000);

        // make octopuses appear
        setInterval(() => {
            const newOctopus = new Octopus(this.isAccelerated);
            this.octopusArr.push(newOctopus);
        }, 2000);

        // move icebergs to the left 
        setInterval(() => {
            this.icebergsArr.forEach((iceberg, i) => {
                this.removeIcebergsIfOutside(iceberg, i);
                iceberg.moveLeft(); 
                this.detectCollision(iceberg);
                this.icebergsPassed();
            })
        }, 75);

        // move coal islands to the left 
        setInterval(() => {
            this.coalIslandArr.forEach((coalIsland, i) => {
                this.removeCoalIslandIfOutside(coalIsland, i);
                coalIsland.moveLeft();
                this.detectCoalIslandCollision(coalIsland);
            })
        }, 50);

        // move octopuses to the left 
        setInterval(() => {
            this.octopusArr.forEach((octopus, i) => {
                this.removeOctopusIfOutside(octopus, i);
                octopus.moveLeft();
                this.detectOctopusCollision(octopus);
            });
        }, 50)
    }

    startBackgroundSound() {
        this.bgSound.play();
    }

    moveBackground() {
        const oceanElement = document.getElementById("ocean");
        backgroundPosition -= this.isAccelerated ? 0.4 : 0.2;
        oceanElement.style.backgroundPosition = `${backgroundPosition}vw 0`;
        requestAnimationFrame(() => this.moveBackground());
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
                this.switchToAcceleration();
            }
        })
    }

    switchToAcceleration() {
        this.isAccelerated = true;
        this.accelerateVisibleIcebergs();
        setTimeout(() => {
            this.isAccelerated = false;
        }, 6000);

        this.accelerateVisibleCoalIsland();
        setTimeout(() => {
            this.isAccelerated = false;
        }, 6000);

        this.accelerateVisibleOctopus();
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
    }

    accelerateVisibleCoalIsland() {
        this.coalIslandArr.forEach((coalIsland) => {
            if (coalIsland.positionX <= 100) {
                coalIsland.isAccelerated = true;
            }
        });
    }

    accelerateVisibleOctopus() {
        this.octopusArr.forEach((octopus) => {
            if (octopus.positionX <= 100) {
                octopus.isAccelerated = true;
            }
        });
    }

    removeIcebergsIfOutside(iceberg, i) {
        if (iceberg.positionX < 0) {
            iceberg.domElement.remove();
            this.icebergsArr.splice(i, 1);
            this.numberOfIcebergsPassed++
        }
    }

    removeCoalIslandIfOutside(coalIsland, i) {
        if (coalIsland.positionX < 0) {
            coalIsland.domElement.remove();
            this.coalIslandArr.splice(i, 1);
        }
    }

    removeOctopusIfOutside(octopus, i) {
        if (octopus.positionX < 0) {
            octopus.domElement.remove();
            this.octopusArr.splice(i, 1);
        }
    }

    icebergsPassed() {
        if (this.numberOfIcebergsPassed >= 20) {
            // all icebergs passed - you won!
            const currentTime = Date.now();
            const elapsedTime = Math.floor((currentTime - this.startTime) / 1000);
            localStorage.setItem("playTime", elapsedTime);
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
            // Collision detected! - you lost!
            location.href = "./gameover.html";
        }
    }

    detectCoalIslandCollision(coalIsland) {
        const shipLeft = this.ship.positionX;
        const shipRight = this.ship.positionX + this.ship.width;
        const shipTop = this.ship.positionY + this.ship.height;
        const shipBottom = this.ship.positionY;

        const coalIslandLeft = coalIsland.positionX;
        const coalIslandRight = coalIsland.positionX + coalIsland.size;
        const coalIslandTop = coalIsland.positionY + coalIsland.size;
        const coalIslandBottom = coalIsland.positionY;

        if (
            shipLeft < coalIslandRight &&
            shipRight > coalIslandLeft &&
            shipTop > coalIslandBottom &&
            shipBottom < coalIslandTop
        ) {
            this.handleCoalIslandCollision(coalIsland)
        }
    }

    handleCoalIslandCollision(coalIsland) {
        this.coalIslandCollisionSound.currentTime = 0;
        this.coalIslandCollisionSound.play();

        coalIsland.domElement.remove();
        this.coalIslandArr.splice(coalIsland.index, 1);

        const currentTime = Date.now();
        const elapsedTime = (currentTime - this.startTime) / 1000;
        const newTime = elapsedTime - 5;
        this.startTime = currentTime - newTime * 1000;
        this.updateTimer();
    }

    detectOctopusCollision(octopus) {
        const shipLeft = this.ship.positionX;
        const shipRight = this.ship.positionX + this.ship.width;
        const shipTop = this.ship.positionY + this.ship.height;
        const shipBottom = this.ship.positionY;

        const octopusLeft = octopus.positionX;
        const octopusRight = octopus.positionX + octopus.radius * 2;
        const octopusTop = octopus.positionY + octopus.radius * 2;
        const octopusBottom = octopus.positionY;

        if (
            shipLeft < octopusRight &&
            shipRight > octopusLeft &&
            shipTop > octopusBottom &&
            shipBottom < octopusTop
        ) {
            this.handleOctopusCollision(octopus);
        }
    }

    handleOctopusCollision(octopus) {
        this.octopusCollisionSound.currentTime = 0;
        this.octopusCollisionSound.play();

        octopus.domElement.remove();
        this.octopusArr.splice(octopus.index, 1);

        const currentTime = Date.now();
        const elapsedTime = (currentTime - this.startTime) / 1000;
        const newTime = elapsedTime + 5;
        this.startTime = currentTime - newTime * 1000;
        this.updateTimer();
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
        
        this.domElement = document.createElement("img");
        
        this.domElement.src = "./images/titanic.png"
        this.domElement.id = "ship";
        this.domElement.style.width = this.width + "vw";
        this.domElement.style.height = this.height + "vh";
        this.domElement.style.left = this.positionX + "vw";
        this.domElement.style.bottom = this.positionY + "vh";

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
        this.size = 7;
        this.positionX = 100;
        this.positionY = Math.floor(Math.random() * (100 - this.size + 1)); //
        this.domElement = null;

        this.isAccelerated = isAccelerated;

        this.createDomElement();
        this.createTriangle();
    }
    createDomElement() {
        this.domElement = document.createElement("div");

        this.domElement.id = "icebergs";
        this.domElement.style.left = this.positionX + "vw";
        this.domElement.style.bottom = this.positionY + "vh";

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
    // apply acceleration to move the iceberg to the left
    moveLeft() {
        if (this.positionX > 0 - this.size) {
            const speed = this.isAccelerated ? 4 : 2;
            this.positionX -= speed;
            this.domElement.style.left = this.positionX + "vw";
        }
    }
}

class CoalIsland {
    constructor(isAccelerated) {
        this.size = 9;
        this.positionX = 100;
        this.positionY = Math.floor(Math.random() * (100 - this.size + 1)); //
        this.domElement = null;

        this.isAccelerated = isAccelerated;

        this.createDomElement();
        this.createTriangle();
    }
    createDomElement() {
        this.domElement = document.createElement("div");

        this.domElement.id = "coalIsland";
        this.domElement.style.left = this.positionX + "vw";
        this.domElement.style.bottom = this.positionY + "vh";

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

        const centerX = this.size / 2;
        const centerY = this.size;

        const coalIslandImage = document.createElement("img");
        coalIslandImage.src = "./images/coal-island.png";
        coalIslandImage.style.width = this.size + "vw";
        coalIslandImage.style.height = this.size + "vh";
        coalIslandImage.style.position = "absolute";
        coalIslandImage.style.left = `calc(50% - ${centerX}vw)`;
        coalIslandImage.style.bottom = `calc(100% - ${centerY}vh)`;

        const speed = this.isAccelerated ? 4 : 2;
        this.positionX -= speed;

        triangle.appendChild(coalIslandImage);

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

class Octopus {
    constructor(isAccelerated) {
        this.radius = 5;
        this.positionX = 100;
        this.positionY = Math.floor(Math.random() * (100 - this.radius * 2 + 1)); //
        this.domElement = null;

        this.isAccelerated = isAccelerated;

        this.createDomElement();
        this.createCircle();
    }
    createDomElement() {
        this.domElement = document.createElement("div");

        this.domElement.id = "octopus";
        this.domElement.style.left = this.positionX + "vw";
        this.domElement.style.bottom = this.positionY + "vh";

        const parentElm = document.getElementById("ocean");
        parentElm.appendChild(this.domElement);
    }
    createCircle() {
        const circle = document.createElement("div");
        circle.style.width = "0";
        circle.style.height = "0";
        circle.style.borderRadius = `${this.radius}vw`;
        circle.style.position = "relative";

        // image positioning in centre of circle
        const centerX = this.radius;
        const centerY = this.radius;

        const octopusImage = document.createElement("img");
        octopusImage.src = "./images/octopus.png";
        octopusImage.style.width = this.radius * 2 + "vw";
        octopusImage.style.height = this.radius * 2 + "vh";
        octopusImage.style.position = "absolute";
        octopusImage.style.left = `calc(50% - ${centerX}vw)`;
        octopusImage.style.bottom = `calc(100% - ${centerY}vh)`;

        const speed = this.isAccelerated ? 4 : 2;
        this.positionX -= speed;

        circle.appendChild(octopusImage);

        this.domElement.appendChild(circle);
    }
    moveLeft() {
        if (this.positionX > 0 - this.radius * 2) {
            const speed = this.isAccelerated ? 4 : 2;
            this.positionX -= speed;
            this.domElement.style.left = this.positionX + "vw";
        }
    }
}

const game = new Game();
game.start();

