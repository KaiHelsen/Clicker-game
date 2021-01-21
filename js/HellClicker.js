//***=================================***\\
//==============HELLCLICKER==============\\
//___a clicker game for tortured souls___\\
//***=================================***\\

// "In the midway of this, our mortal life
// I found me in a gloomy script, astray
// Gone form the path direct: and e'en to Javascript
// It were no easy task, how savage wild
// That file, how robust and rough its code,
// Which to remember only, my dismay
// Renews, in bitterness not far from death."
//
// -Dante Alighieri

//BUTTON REFERENCES:
let clickerBtn = document.getElementById("clickerBtn");
let buySoulBtn = document.getElementById("buySoulBtn");
let buyDevilBtn = document.getElementById("buyDevilBtn");
let buySuccubusBtn = document.getElementById("buySuccubusBtn");

let cheatAgony1KBtn = document.getElementById("cheatAgony1K");
let cheatAgony1MilBtn = document.getElementById("cheatAgony1M");

//DISPLAY ELEMENT REFERENCES:
let agonyDsp = document.getElementById("agonyDisplay");
let soulsDsp = document.getElementById("soulsDisplay");
let devilsDsp = document.getElementById("devilsDisplay");
let succubiDsp = document.getElementById("succubiDisplay");


//INVENTORY VALUES
let agony = 0;
let souls = 1;
let devils = 0;
let succubi = 0;

//MULTIPLIERS
let agonyMultiplier = 1;
let agonyPerSecond = 0;
let soulsPerSecond = 0;

//BASE PRICES
let soulBasePrice = 10;
let devilBasePrice = 20;
let succubusBasePrice = 30;

//CURRENT PRICES
let soulPrice = soulBasePrice;
let devilPrice = devilBasePrice;
let succubusPrice = succubusBasePrice;

let succubiTimer = 0;
let succubiInterval = 20;

//DANGER ZONE
let areWeCheating = true;//END DANGER ZONE

//======================
//----STUFF TO RUN------
//======================

Init();

//TICK INTERVAL
setInterval(Tick, 1000);

//======================
//BUTTON LISTENER EVENTS
//======================

//---MAIN CLICKER BUTTON
clickerBtn.addEventListener("click", () =>
{
    //on click, torment souls to gain agony.
    //1 soul generates 1 agony per click by default

    agony += souls;
    UpdateStore();
    UpdateDisplay();
});

//---BUY SOULS BUTTON
buySoulBtn.addEventListener("click", () =>
{
    souls++;
    agony -= soulPrice;

    //update soul price
    //soul prices should go up a LOT
    soulPrice = Math.floor(soulBasePrice + Math.pow(2, souls) - 1);

    //run update functions
    UpdateStore();
    UpdateDisplay();
});

//---BUY DEVIL BUTTON
buyDevilBtn.addEventListener("click", () =>
{
    devils++;
    agony -= devilPrice;

    devilPrice = Math.floor(devilBasePrice + Math.pow(4, devils) - 4);

    UpdateStore();
    UpdateDisplay();

});

//---BUY SUCCUBUS BUTTON
buySuccubusBtn.addEventListener("click", () =>
{
    succubi++;
    agony -= succubusPrice;

    succubusPrice = Math.floor(succubusBasePrice + Math.pow(10, succubi) - 10)

    UpdateStore();
    UpdateDisplay();
});


//---CHEATY, CHEATY BUTTONS
cheatAgony1KBtn.addEventListener("click", ()=>{agony += 1000; UpdateDisplay()});
cheatAgony1MilBtn.addEventListener("click", () =>{agony +=1000000; UpdateDisplay()});

//=============================
//FUNCTIONS TO MAKE LIFE EASIER
//=============================
function Init() {
    //Initialize script functions
    UpdateStore();
    UpdateDisplay();
}

function UpdateDisplay() {
    //update agony display
    agonyDsp.innerHTML = agony;

    //update souls display
    soulsDsp.innerHTML = "SOULS: " + souls;

    //update devils display
    devilsDsp.innerHTML = "DEVILS: " + devils;

    //update Succubi display
    succubiDsp.innerHTML = "SUCCUBI: " + succubi;
}

function UpdateStore() {
    //update store buttons if the player has enough agony to buy something,
    //as well as updating the displayed prices
    StoreButton("SOUL", soulPrice, buySoulBtn);
    StoreButton("DEVIL", devilPrice, buyDevilBtn);
    StoreButton("SUCCUBUS", succubusPrice, buySuccubusBtn);
}

//handles store buttons
//expanding on this function will affect all default store buttons
//that's insight that is.
function StoreButton(tag, price, buttonID) {
    buttonID.disabled = (agony < price);
    buttonID.innerHTML = tag + ": " + price + " agony";
    //maybe don't run this test every time? find alternative that only runs once then never again.
    if (agony >= price) {
        buttonID.hidden = false;
    }
}

//SimplifyNumber will simplify large numbers into smaller numbers
//when the number is over 1 million, it will be presented as 1.000 mil
//when the number is over 1 billion, it will be represented as 1.000 bil
//etc.
function SimpleNumber(number)
{
    let numberText = '' + number;
}

function Tick() {
    //add agony based on Devils
    agony += devils * 3;

    //Succubus timer
    succubiTimer += 1000;

    if (succubiTimer >= succubiInterval * 1000) {
        souls += 1 * succubi;
        succubiTimer = 0;
    }
    //over time, succubi will acquire more souls for you
    UpdateStore();
    UpdateDisplay();

}


//==============================
//-------HELPER FUNCTIONS-------
//==============================
