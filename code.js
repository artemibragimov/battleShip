var view = {

    displayMessage: function (msg) {

        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    displayHit: function (location) {

        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },

    displayMiss: function (location) {

        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    },
};

var model = {

    boardSize: 7,
    numShips: 3,
    shipsSunk: 0,
    shipLength: 3,
    ships: [

        { locations: [null, null, null], hits: ["", "", ""] },
        { locations: [null, null, null], hits: ["", "", ""] },
        { locations: [null, null, null], hits: ["", "", ""] }

    ],

    fire: function (guess) {

        for (var i = 0; i < this.numShips; i++) {

            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);

            if (index >= 0) {

                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("Попал!");

                if (this.isSunk(ship)) {

                    view.displayMessage("Ты потопил мой корабль!");
                    this.shipsSunk++;
                };

                return true;
            };
        };

        view.displayMiss(guess);
        view.displayMessage("Ты промазал!");
        return false;

    },

    isSunk: function (ship) {

        for (var i = 0; i < this.shipLength; i++) {

            if (ship.hits[i] !== "hit") {

                return false;
            };
        };

        return true;
    },

    generateShipLocatoins: function () {

        var locations;

        for (var i = 0; i < this.numShips; i++) {

            do {

                locations = this.generateShip();

            } while (this.collision(locations));

            this.ships[i].locations = locations;
        };
    },

    generateShip: function () {

        var direction = Math.floor(Math.random() * 2);
        var row, col;

        if (direction === 1) {

            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));

        } else {

            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);

        };

        var newShipLocations = [];

        for (var i = 0; i < this.shipLength; i++) {

            if (direction === 1) {

                newShipLocations.push(row + "" + (col + i));

            } else {

                newShipLocations.push((row + i) + "" + col);
            };
        };

        return newShipLocations;
    },

    collision: function (locations) {

        for (var i = 0; i < this.numShips; i++) {

            var ship = model.ships[i];

            for (var j = 0; j < locations.length; j++) {

                if (ship.locations.indexOf(locations[j]) >= 0) {

                    return true;
                };
            };
        };

        return false;
    }
};

var controller = {

    guesses: 0,

    processGuess: function (guess) {

        var location = this.parseGuess(guess);
        if (location) {

            this.guesses++;
            var hit = model.fire(location);

            if (hit && model.shipsSunk === model.numShips) {

                view.displayMessage("Вы потопили все мои корабли за " + this.guesses + " выстрелов!");
            };
        };
    },

    parseGuess: function (guess) {

        var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

        if (guess == null || guess.length != 2) {

            alert("Пожалуйста введите корректные кооринаты игрового поля (буква+цифра) ");

        } else {

            firstChar = guess.charAt(0);
            var row = alphabet.indexOf(firstChar);
            var column = guess.charAt(1);

            if (isNaN(row) || isNaN(column)) {

                alert("Кажется вы ввели неверные координаты");

            } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {

                alert("Кажется вы ввели неверные координаты");

            } else {

                return row + column;
            };
        };

        return null;
    }
};

function init() {

    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;

    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocatoins ();
};

function handleFireButton() {

    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
};

function handleKeyPress(e) {

    if (e.keyCode === 13) {

        document.getElementById("fireButton").click();
        return false;
    };
};

window.onload = init;
