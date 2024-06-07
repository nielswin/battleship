//console log to check if js is correctly loaded
console.log("main loaded");

//loading DOM content
document.addEventListener("DOMContentLoaded", () => {

  //load elements from DOM
  const userGrid = document.querySelector(".grid-user");
  const computerGrid = document.querySelector(".grid-computer");
  const displayGrid = document.querySelector(".grid-display");
  const ships = document.querySelectorAll(".ship");
  const destroyer = document.querySelector(".destroyer-container");
  const submarine = document.querySelector(".submarine-container");
  const cruiser = document.querySelector(".cruiser-container");
  const battleship = document.querySelector(".battleship-container");
  const carrier = document.querySelector(".carrier-container");
  const startButton = document.querySelector("#start");
  const rotateButton = document.querySelector("#rotate");
  const turnDisplay = document.querySelector("#whose-go");
  const infoDisplay = document.querySelector("#info");
  const setupButtons = document.getElementById("setup-buttons");
  const userSquares = [];
  const computerSquares = [];
  let isHorizontal = true;
  let isGameOver = false;
  let currentPlayer = "user";
  const width = 10;
  let playerNum = 0;
  let ready = false;
  let enemyReady = false;
  let allShipsPlaced = false;
  let shotFired = -1;

  //Define width of ships
  const shipArray = [
    {
      name: "destroyer",
      directions: [
        [0, 1],
        [0, width],
      ],
    },
    {
      name: "submarine",
      directions: [
        [0, 1, 2],
        [0, width, width * 2],
      ],
    },
    {
      name: "cruiser",
      directions: [
        [0, 1, 2],
        [0, width, width * 2],
      ],
    },
    {
      name: "battleship",
      directions: [
        [0, 1, 2, 3],
        [0, width, width * 2, width * 3],
      ],
    },
    {
      name: "carrier",
      directions: [
        [0, 1, 2, 3, 4],
        [0, width, width * 2, width * 3, width * 4],
      ],
    },
  ];

  //determine the grid for the user and the computer
  createBoard(userGrid, userSquares);
  createBoard(computerGrid, computerSquares);

  // Select Player Mode and make it start the right one
  if (gameMode === "singlePlayer") {
    startSinglePlayer();
  } else {
    startMultiPlayer();
  }

  // Function to start Single Player
  function startSinglePlayer() {
    generate(shipArray[0]);
    generate(shipArray[1]);
    generate(shipArray[2]);
    generate(shipArray[3]);
    generate(shipArray[4]);

    startButton.addEventListener("click", () => {
      setupButtons.style.display = "none";
      playGameSingle();
    });
  }

  // function to Create Board
  function createBoard(grid, squares) {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.dataset.id = i;
      grid.appendChild(square);
      squares.push(square);
    }
  }

  startButton.addEventListener("click", () => {
    if (allShipsPlaced) {
      // Check if all ships are placed before starting the game
      setupButtons.style.display = "none";
      playGameSingle();
    } else {
      // Show an alert if not all ships are placed
      alert("Please place all ships before starting the game!");
      location.reload();
    }
  });

  //Draw the computers ships in random locations for the computer
  function generate(ship) {
    let randomDirection = Math.floor(Math.random() * ship.directions.length);
    let current = ship.directions[randomDirection];
    if (randomDirection === 0) direction = 1;
    if (randomDirection === 1) direction = 10;
    let randomStart = Math.abs(
      Math.floor(
        Math.random() * computerSquares.length -
        ship.directions[0].length * direction
      )
    );

    const isTaken = current.some((index) =>
      computerSquares[randomStart + index].classList.contains("taken")
    );
    const isAtRightEdge = current.some(
      (index) => (randomStart + index) % width === width - 1
    );
    const isAtLeftEdge = current.some(
      (index) => (randomStart + index) % width === 0
    );

    if (!isTaken && !isAtRightEdge && !isAtLeftEdge)
      current.forEach((index) =>
        computerSquares[randomStart + index].classList.add("taken", ship.name)
      );
    else generate(ship);
  }

  //Rotate the ships for the user
  function rotate() {
    if (isHorizontal) {
      destroyer.classList.toggle("destroyer-container-vertical");
      submarine.classList.toggle("submarine-container-vertical");
      cruiser.classList.toggle("cruiser-container-vertical");
      battleship.classList.toggle("battleship-container-vertical");
      carrier.classList.toggle("carrier-container-vertical");
      isHorizontal = false;
      return;
    }
    if (!isHorizontal) {
      destroyer.classList.toggle("destroyer-container-vertical");
      submarine.classList.toggle("submarine-container-vertical");
      cruiser.classList.toggle("cruiser-container-vertical");
      battleship.classList.toggle("battleship-container-vertical");
      carrier.classList.toggle("carrier-container-vertical");
      isHorizontal = true;
      return;
    }
  }
  rotateButton.addEventListener("click", rotate);

  //move around user ship
  ships.forEach((ship) => ship.addEventListener("dragstart", dragStart));
  userSquares.forEach((square) =>
    square.addEventListener("dragstart", dragStart)
  );
  userSquares.forEach((square) =>
    square.addEventListener("dragover", dragOver)
  );
  userSquares.forEach((square) =>
    square.addEventListener("dragenter", dragEnter)
  );
  userSquares.forEach((square) =>
    square.addEventListener("dragleave", dragLeave)
  );
  userSquares.forEach((square) => square.addEventListener("drop", dragDrop));
  userSquares.forEach((square) => square.addEventListener("dragend", dragEnd));

  let selectedShipNameWithIndex;
  let draggedShip;
  let draggedShipLength;

  ships.forEach((ship) =>
    ship.addEventListener("mousedown", (e) => {
      selectedShipNameWithIndex = e.target.id;
    })
  );

  function dragStart() {
    draggedShip = this;
    draggedShipLength = this.childNodes.length;
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dragEnter(e) {
    e.preventDefault();
  }

  function dragLeave() {
  }

  function dragDrop() {
    let shipNameWithLastId = draggedShip.lastChild.id;
    let shipClass = shipNameWithLastId.slice(0, -2);
    let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
    let shipLastId = lastShipIndex + parseInt(this.dataset.id);
    const notAllowedHorizontal = [
      0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 1, 11, 21, 31, 41, 51, 61, 71, 81,
      91, 2, 22, 32, 42, 52, 62, 72, 82, 92, 3, 13, 23, 33, 43, 53, 63, 73, 83,
      93,
    ];
    const notAllowedVertical = [
      99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82,
      81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64,
      63, 62, 61, 60,
    ];

    let newNotAllowedHorizontal = notAllowedHorizontal.splice(
      0,
      10 * lastShipIndex
    );
    let newNotAllowedVertical = notAllowedVertical.splice(
      0,
      10 * lastShipIndex
    );

    selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));

    shipLastId = shipLastId - selectedShipIndex;

    if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
      for (let i = 0; i < draggedShipLength; i++) {
        let directionClass;
        if (i === 0) directionClass = "start";
        if (i === draggedShipLength - 1) directionClass = "end";
        userSquares[
          parseInt(this.dataset.id) - selectedShipIndex + i
        ].classList.add("taken", "horizontal", directionClass, shipClass);
      }
      
    } else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
      for (let i = 0; i < draggedShipLength; i++) {
        let directionClass;
        if (i === 0) directionClass = "start";
        if (i === draggedShipLength - 1) directionClass = "end";
        userSquares[
          parseInt(this.dataset.id) - selectedShipIndex + width * i
        ].classList.add("taken", "vertical", directionClass, shipClass);
      }
    } else return;

    displayGrid.removeChild(draggedShip);
    if (!displayGrid.querySelector(".ship")) allShipsPlaced = true;
  }

  function dragEnd() {

  }

  // Game Logic for Single Player
  function playGameSingle() {
    if (isGameOver) return;
    if (currentPlayer === "user") {
      turnDisplay.innerHTML = "Your Go";
      computerSquares.forEach((square) =>
        square.addEventListener("click", function (e) {
          shotFired = square.dataset.id;
          revealSquare(square.classList);
        })
      );
    }
    if (currentPlayer === "enemy") {
      turnDisplay.innerHTML = "Computers Go";
      setTimeout(enemyGo, 1000);
    }
  }

  let destroyerCount = 0;
  let submarineCount = 0;
  let cruiserCount = 0;
  let battleshipCount = 0;
  let carrierCount = 0;

  function revealSquare(classList) {
    const enemySquare = computerGrid.querySelector(
      `div[data-id='${shotFired}']`
    );

    // Check if the square has already been shot
    const obj = Object.values(classList);
    if (obj.includes("taken")) {
      // Square is not empty
      if (currentPlayer === "user" && !isGameOver) {
        let shipColor;

        if (obj.includes("destroyer")) {
          destroyerCount++;
          shipColor = "black";
        }
        if (obj.includes("submarine")) {
          submarineCount++;
          shipColor = "green";
        }
        if (obj.includes("cruiser")) {
          cruiserCount++;
          shipColor = "red";
        }
        if (obj.includes("battleship")) {
          battleshipCount++;
          shipColor = "purple";
        }
        if (obj.includes("carrier")) {
          carrierCount++;
          shipColor = "blue";
        }

        enemySquare.classList.add("boom");
        infoDisplay.innerHTML = `You hit the ${currentPlayer === "user" ? "enemy's" : "your"} ${obj[1]}!`;
        infoDisplay.style.color = shipColor; // Set color based on the ship

      }
    } else {
      // Square is empty
      enemySquare.classList.add("miss");
      infoDisplay.innerHTML = `You missed!`;
      infoDisplay.style.color = "black"; // Set color for miss
    }

    checkForWins();
    currentPlayer = "enemy";
    if (gameMode === "singlePlayer") playGameSingle();
  }

  let cpuDestroyerCount = 0;
  let cpuSubmarineCount = 0;
  let cpuCruiserCount = 0;
  let cpuBattleshipCount = 0;
  let cpuCarrierCount = 0;

  // Array to track used enemy squares
  let usedEnemySquares = [];

  function enemyGo(square) {
    if (gameMode === "singlePlayer")
      square = Math.floor(Math.random() * userSquares.length);

    // Check if the square has already been shot
    if (
      !usedEnemySquares.includes(square) &&
      !userSquares[square].classList.contains("boom")
    ) {
      const hit = userSquares[square].classList.contains("taken");
      userSquares[square].classList.add(hit ? "boom" : "miss");

      // Update counts based on ship type
      if (userSquares[square].classList.contains("destroyer"))
        cpuDestroyerCount++;
      if (userSquares[square].classList.contains("submarine"))
        cpuSubmarineCount++;
      if (userSquares[square].classList.contains("cruiser")) cpuCruiserCount++;
      if (userSquares[square].classList.contains("battleship"))
        cpuBattleshipCount++;
      if (userSquares[square].classList.contains("carrier")) cpuCarrierCount++;

      // Add the square to the usedEnemySquares array
      usedEnemySquares.push(square);

      // Check for wins and switch player turn
      checkForWins();
      currentPlayer = "user";
      turnDisplay.innerHTML = "Your Go";

      // Display appropriate message based on hit or miss
      if (hit) {
        infoDisplay.innerHTML = `The computer hit your ${userSquares[square].classList[1]}!`;
        infoDisplay.style.color = userSquares[square].style.color; // Set color based on the ship
      } else {
        infoDisplay.innerHTML = `The computer missed!`;
        infoDisplay.style.color = "black"; // Set color for miss
      }
    } else if (gameMode === "singlePlayer") {
      // If the square has already been shot or selected in singlePlayer mode, try again
      enemyGo();
    }
  }

  //function to check if a ship has been destroyed and checks if all ships have been shot
  function checkForWins() {
    let enemy = "computer";
    if (gameMode === "multiPlayer") enemy = "enemy";
    if (destroyerCount === 2) {
      infoDisplay.innerHTML = `You sunk the ${enemy}'s destroyer`;
      destroyerCount = 10;
    }
    if (submarineCount === 3) {
      infoDisplay.innerHTML = `You sunk the ${enemy}'s submarine`;
      submarineCount = 10;
    }
    if (cruiserCount === 3) {
      infoDisplay.innerHTML = `You sunk the ${enemy}'s cruiser`;
      cruiserCount = 10;
    }
    if (battleshipCount === 4) {
      infoDisplay.innerHTML = `You sunk the ${enemy}'s battleship`;
      battleshipCount = 10;
    }
    if (carrierCount === 5) {
      infoDisplay.innerHTML = `You sunk the ${enemy}'s carrier`;
      carrierCount = 10;
    }
    if (cpuDestroyerCount === 2) {
      infoDisplay.innerHTML = `${enemy} sunk your destroyer`;
      cpuDestroyerCount = 10;
    }
    if (cpuSubmarineCount === 3) {
      infoDisplay.innerHTML = `${enemy} sunk your submarine`;
      cpuSubmarineCount = 10;
    }
    if (cpuCruiserCount === 3) {
      infoDisplay.innerHTML = `${enemy} sunk your cruiser`;
      cpuCruiserCount = 10;
    }
    if (cpuBattleshipCount === 4) {
      infoDisplay.innerHTML = `${enemy} sunk your battleship`;
      cpuBattleshipCount = 10;
    }
    if (cpuCarrierCount === 5) {
      infoDisplay.innerHTML = `${enemy} sunk your carrier`;
      cpuCarrierCount = 10;
    }

    if (
      destroyerCount +
      submarineCount +
      cruiserCount +
      battleshipCount +
      carrierCount ===
      50
    ) {
      infoDisplay.innerHTML = "YOU WIN";
      gameOver();
    }
    if (
      cpuDestroyerCount +
      cpuSubmarineCount +
      cpuCruiserCount +
      cpuBattleshipCount +
      cpuCarrierCount ===
      50
    ) {
      infoDisplay.innerHTML = `${enemy.toUpperCase()} WINS`;
      gameOver();
    }

    // Hide turnDisplay when the game is over
    if (isGameOver) {
      turnDisplay.style.display = "none";
    }
  }

  function gameOver() {
    isGameOver = true;
    startButton.removeEventListener("click", playGameSingle);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const popupButton = document.querySelector(".popup-button");

  // Add click event listener to the button
  popupButton.addEventListener("click", () => {
    // Create the popup container
    const popupContainer = document.createElement("div");
    popupContainer.classList.add("popup-container");

    // Create the content for the popup
    const popupContent = document.createElement("div");
    popupContent.classList.add("popup-content");

    // Define the colors of the ships
    const destroyerColor = "black";
    const submarineColor = "green";
    const cruiserColor = "red";
    const battleshipColor = "purple";
    const carrierColor = "blue";

    // Display text in pop-up in innerHTML with correndsponding colors
    popupContent.innerHTML = `
      <p>The concept of battle-ship is simple.</p> 
      <p>set your ships up, vertically or horizontally</p>
      <p>when you placed all your ships you can start the game, click a sqaure to shoot and try to take all the ships down before the computer does!</p>
      <br>
      <p>Information about ships</p>
      <p>The Destroyer is 2 tiles and will be displayed as <span style="color: ${destroyerColor};">black</span> text when shot</p>
      <p>The submarine is 3 tiles and will be displayed as <span style="color: ${submarineColor};">green</span> text when shot</p>
      <p>The cruiser is also 3 tiles and will be displayed as <span style="color: ${cruiserColor};">red</span> text when shot</p>
      <p>The battleship is 4 tiles and will be displayed as <span style="color: ${battleshipColor};">purple</span> text when shot</p>
      <p>The carrier is 5 tiles and will be displayed as <span style="color: ${carrierColor};">blue</span> text when shot</p>
    `;

    // Create the close button
    const closeButton = document.createElement("button");
    closeButton.classList.add("popup-close-button");
    closeButton.innerText = "Close";

    // Add click event listener to the close button
    closeButton.addEventListener("click", () => {
      document.body.removeChild(popupContainer);
    });

    // Append the content and close button to the popup container
    popupContainer.appendChild(popupContent);
    popupContainer.appendChild(closeButton);

    // Append the popup container to the body
    document.body.appendChild(popupContainer);
  });
});

//reset button 
const resetButton = document.querySelector('.reset-button')
resetButton.addEventListener("click", function () {
  location.reload();
});