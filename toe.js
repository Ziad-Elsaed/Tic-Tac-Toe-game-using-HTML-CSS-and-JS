const boxes = document.querySelectorAll(".box");
const next = document.querySelector(".turn");
const restart = document.querySelector(".restart");
const setting = document.querySelector(".change-names");

let turn = "X"; // variable hold x then o then x then ...
let activeGame = true; // variable to tell us if game ended or not
let playerX = "playerX";
let playerO = "playerO";

// if new names exist in session storage change players names after click restart button
if (sessionStorage.playerX) playerX = sessionStorage.playerX;
if (sessionStorage.playerO) playerO = sessionStorage.playerO;

// inital value for next message (display message)
next.innerHTML = `it's ${playerX}'s turn`;

// function updated the next message to last player played 
function updateNext() {
    next.innerHTML = `it's ${turn === "X" ? playerX : playerO}'s turn`;
}

const winInd = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
]

boxes.forEach((box) => {
    box.addEventListener("click", function () {
        // [1] if box is empty (first time click) and game not end add turn to the box and change it's opcity
        if (this.innerHTML === "" && activeGame) {
            this.style.opacity = "0.9";
            this.innerHTML = turn;
            // [2] check if anyone won show a message in next box and make game end
            if (winCheck()) {
                next.innerHTML = `${turn === "X" ? playerX : playerO} has won!`;
                activeGame = false;
                // [3] if all boxes are full without a win then there is a draw 
            } else if ([...boxes].every((box) => box.innerHTML.length === 1)) {
                next.innerHTML = `draw!`;
                activeGame = false;
            } else {
                // [4] change the next turn value
                turn === "X" ? turn = "O" : turn = "X";
                // [5] update message box for next player turn
                updateNext();
            }
        }

    })
})

function winCheck() {
    let result = false;
    winInd.forEach((match) => {
        // filter boxes (note that we used spread operator bec we cannot use filter method on nodelist bec it is not considered as array)
        let check3 = [...boxes].filter((box, ind) => match.includes(ind));
        // change boxes to their content 
        let check3Content = check3.map((box) => box.innerHTML);
        // change 3 boxes content to string then check them for a win
        if (check3Content.join("") === "XXX" || check3Content.join("") === "OOO") result = true;
    })
    return result;
}

// restart button 
restart.addEventListener("click", function () {
    location.reload();
})

// setting buuton 
setting.addEventListener("click", function () {
    const settPopUp = document.createElement("div");
    const closeBtn = document.createElement("button");
    const overlay = document.createElement("div");

    // html
    settPopUp.innerHTML = `
                <form action="">
                    <h3>change players names</h3>
                    <label for="">
                        playerX:
                        <input type="text" name="" placeholder="playerX's new name">
                    </label>
                    <label for="">
                        playerY:
                        <input type="text" name="" placeholder="playerO's new name">
                    </label>
                </form>
    `
    closeBtn.innerHTML = "x";

    // style
    settPopUp.style.cssText = `
    background-color: rgb(245, 243, 244);
    border: 2px solid #8c52ff;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px 30px 50px;
    width: 400px;
    text-align: center;
    color: #8c52ff;
    border-radius: 10px
    `

    closeBtn.style.cssText = `
    background-color: red;
    border-radius: 50%;
    color: white;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    border: none;
    width: 35px;
    height: 35px;
    `;

    overlay.style.cssText = `
    width: 100%;
    height: 100%;
    position: fixed;
    inset: 0;
    background-color: rgb(0 0 0 / 60%);
    `;

    // appending 
    settPopUp.append(closeBtn);
    document.body.append(overlay, settPopUp);

    // styling elements after appending it to avoid error 
    document.querySelector("form").style.cssText = `
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 5px;
    `;

    document.querySelectorAll("input").forEach((input) => { input.style.padding = "3px" })

    // logic after changing names 
    // take the new names and store or update them in session storage to avoid changing them in each game (same names all session)
    document.querySelectorAll("input")[0].addEventListener("change", function () {
        let newName = this.value;
        if (newName.trim() !== "") { // some validation
            playerX = newName; // this line allows the next messages to change with new players names
            updateNext(); // this line allows the current message to change to new name
            sessionStorage.setItem("playerX", newName); // for next game in same session
        }
    })
    document.querySelectorAll("input")[1].addEventListener("change", function () {
        let newName = this.value;
        if (newName.trim() !== "") { // some validation
            playerO = newName;// this line allows the next messages to change with new players names
            updateNext(); // this line allows the current message to change to new name
            sessionStorage.setItem("playerO", newName);
        }
    })

    // close-btn popup
    closeBtn.onclick = function () {
        settPopUp.remove();
        overlay.remove();
    }
})

