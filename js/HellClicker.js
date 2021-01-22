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


//==============================
//------CLASS DEFINITIONS-------
//==============================

class minion
{
    //type: name of the minion
    //buttonId: ID of the store button used to buy this minion
    //amount: owned amount of this minion
    //basePrice: how much does this minion cost by default
    //price: actual store price based on base price and amount of minions owned

    constructor(type, buttonId, button, amount, basePrice, price) {
        this.type = type;
        this.buttonId = buttonId;
        this.button = button;
        this.amount = amount;
        this.basePrice = basePrice;
        this.price = price;
    }
}

//===============================
//-----END CLASS DEFINITIONS-----
//===============================

//BUTTON REFERENCES:
let clickerBtn = document.getElementById("clickerBtn");

let cheatAgony1KBtn = document.getElementById("cheatAgony1K");
let cheatAgony1MilBtn = document.getElementById("cheatAgony1M");

//DISPLAY ELEMENT REFERENCES:
let agonyDsp = document.getElementById("agonyDisplay");
let soulsDsp = document.getElementById("soulsDisplay");
let devilsDsp = document.getElementById("devilsDisplay");
let succubiDsp = document.getElementById("succubiDisplay");

//MENU REFERENCES (fill these through usage of script)
let StoreList = document.getElementById("storeItemList");

//INVENTORY VALUES
let agony = 0;
//LEGACY VALUES
let souls = 1;
let devils = 0;
let succubi = 0;

//better to define these in the init?
let minions = [
    new minion("soul", "soulBtn", 0,1,10,0),
    new minion("imp", "impBtn", 0,0,10,0),
    new minion("devil", "devilBtn", 0,0,20,0),
    new minion("jezebel", "jezebelBtn", 0,0,30,0),
    new minion("beguiler", "beguilerBtn", 0,0,40,0),
]

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

//---CHEATY, CHEATY BUTTONS
cheatAgony1KBtn.addEventListener("click", () =>
{
    agony += 1000;
    UpdateDisplay()
});
cheatAgony1MilBtn.addEventListener("click", () =>
{
    agony += 1000000;
    UpdateDisplay()
});

//=============================
//FUNCTIONS TO MAKE LIFE EASIER
//=============================
function Init() {
    //Initialize script functions
    //iterate through minions array and generate store buttons for all of them.

    //SETUP ALL STORE BUTTONS
    minions.forEach(function (minion)
    {
        minion.price = CalculatePrice(minion.basePrice, minion.amount, 1);
        CreateStoreButton("storeItemList", minion);
    });

    UpdateStore();
    UpdateDisplay();
    // CreateStoreButton("storeItemList", minions[0].type, minions[0].price, minions[0].buttonId);
}

function UpdateDisplay() {
    //update agony display
    agonyDsp.innerHTML = SimpleNumber(agony).toString();

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

    minions.forEach(function (minion)
    {
        minion.button.disabled = (agony < minion.price);
        minion.button.innerHTML = minion.type.toUpperCase() + ": " + SimpleNumber(minion.price) + " agony";
        //maybe don't run this test every time? find alternative that only runs once then never again.
        if (agony >= minion.price) {
            document.getElementById(minion.buttonId).hidden = false;
        }
    });
}

//this function will generate a button automatically
//it will then also add a listener to the button
//WORK IN PROGRESS: add functionality
//CONSIDERATION: right now, function takes a minion object as an argument
//this means the function might malfunction if it is forced to take something else as an argument
//so, perhaps look into how we can handle this function by implementing some classes?
function CreateStoreButton(locationId, minion) {

    //ONLY RUN IF MINION EXISTS
    //OTHERWISE, GENERATE ERROR
    if (minion != null) {
        //create unique array per minion
        minion.buttonId = minion.type + "-btn";

        //create button
        document.getElementById(locationId).insertAdjacentHTML("beforeend",
            "<li>" +
            "<button id=" +
            minion.buttonId +
            " class='btn-store tooltip padding-3 w-100 rounded-top margin-b' disabled>" +
            minion.type.toUpperCase() + ": " + SimpleNumber(minion.price) + " agony" +
            "</button>" +
            "</li>");

        //store button in minions array
        minion.button = document.getElementById(minion.buttonId);

        //add listener
        minion.button.addEventListener("click", () =>
        {
            minion.amount++;
            console.log("bought " + minion.type + ", total amount now " + minion.amount);
            agony -= minion.price;

            //update price
            minion.price = CalculatePrice(minion.basePrice, minion.amount, 1);

            //run update functions
            UpdateStore();
        });
    }
    else {
        console.error("Something went wrong with generating a button!")
    }

}

//SimplifyNumber will simplify large numbers into smaller numbers
//when the number is over 1 million, it will be presented as 1.000 mil
//when the number is over 1 billion, it will be represented as 1.000 bil
//etc.
//maybe also see about putting in periods to separate big numbers below 1000000
function SimpleNumber(number) {
    let i = 0.0;
    if (number >= 1000000) {
        i = Math.floor(number / 1000) / 1000 + " mil";
    }
    else if (number >= 1000000000) {
        i = Math.floor(number / 1000000) / 1000 + " bil";
    }
    else {
        i = number.toString();
    }

    return i;
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

//calculates price of an object based on the base cost, the owned amount of said item, and the cost multiplier
function CalculatePrice(basePrice, amount, priceMultiplier) {
    return basePrice + Math.floor(Math.pow(amount, 2 * priceMultiplier));
}


//==============================
//-------HELPER FUNCTIONS-------
//==============================
