var width;
var height;
var snake;
var centreX;
var centreY;
var squareSize = 25;
var apple;
var columns;
var rows;
var rightMargin;
var bottomMargin;
var started = false;
var dead = false;

function setup() {
    width = $(window).width();
    height = $(window).height();

    started = false;
    dead = false;

    createCanvas(width, height);

    centreX = ceil((width / 2) / squareSize) * squareSize;
    centreY = ceil((height / 2) / squareSize) * squareSize;

    columns = floor(width / squareSize);
    rows = floor(height / squareSize);

    snake = new Snake();
    frameRate(10);

    rightMargin = Math.ceil((width/squareSize) % 1 * squareSize);
    bottomMargin = Math.ceil((height/squareSize) % 1 * squareSize);

    createApple(rightMargin, bottomMargin)
}

function createApple() {
    apple = createVector(Math.floor(random(1, columns-(rightMargin/squareSize)-1)), Math.floor(random(1, rows-(bottomMargin/squareSize)-1)));
    apple.mult(squareSize);
}

function draw() {
    background(51);

    for(var x = 0; x < width; x+= squareSize) {
        line(x, 0, x, height);
    }
    for(var y = 0; y < height; y+= squareSize) {
        line(0, y, width, y);
    }

    //Borders
    fill(66, 134, 244);
    rect(0, 0, squareSize, height);
    rect((width-squareSize)-rightMargin, 0, width, height);
    rect(0, 0, width, squareSize);
    rect(0, (height-squareSize)-bottomMargin, width, height);

    //Apple
    fill(183, 0, 0);
    rect(apple.x, apple.y, squareSize, Math.floor(squareSize));

    if(snake.x < squareSize) snake.x = width-rightMargin-(squareSize);
    else if(snake.x > width-rightMargin-(squareSize*2)) snake.x = squareSize;
    else if(snake.y < squareSize) snake.y = height-bottomMargin-squareSize;
    else if(snake.y >= height-bottomMargin-squareSize) snake.y = squareSize;

    snake.update();
    snake.show();
}

function keyPressed() {
    if(keyCode === UP_ARROW || keyCode === 87) snake.dir(0,-1);
    else if(keyCode === DOWN_ARROW || keyCode === 83) snake.dir(0, 1);
    else if(keyCode === LEFT_ARROW || keyCode === 65) snake.dir(-1, 0);
    else if(keyCode === RIGHT_ARROW || keyCode === 68) snake.dir(1, 0);
}

function Snake() {
    this.x = centreX;
    this.y = centreY;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.locations = [];
    this.previousLoc = createVector(0, 0);

    this.dir = function (x, y) {
        if(this.locations.length === 1 || this.xSpeed * -1 !== x) this.xSpeed = x;
        if(this.locations.length === 1 || this.ySpeed * -1 !== y) this.ySpeed = y;

        if(!started) started = true;
    };

    this.update = function() {
        this.previousLoc = createVector(this.x, this.y);

        this.x+=this.xSpeed*squareSize;
        this.y+=this.ySpeed*squareSize;

        for(var i = 0; i < this.locations.length; i++) {
            var vector = this.locations[i];
            if(this.x === vector.x && this.y === vector.y && started) this.die();
        }

        this.locations.unshift(createVector(this.x, this.y));
        if(this.locations.length > 1) this.locations.splice(-1, 1);

        this.eat();
    };

    this.show = function() {
        fill(0, 102, 30);

        for(var i = 0; i < this.locations.length; i++) {
            var vector = this.locations[i];
            rect(vector.x, vector.y, 25, 25);
        }
    };

    this.eat = function() {
        if(dist(this.x, this.y, apple.x, apple.y) < 25) {
            this.locations.push(this.previousLoc);
            createApple();
        }
    };

    this.die = function() {
        dead = true;

        if(confirm("You died!\n\nPress OK to play again, or CANCEL to go back.") === true) setup(); else window.history.back();
    };
}