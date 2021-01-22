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

/* TODO: -create functions to easily generate the html content of the buttons and stat bars. no repetition.
         -implement functionality of different minions.
         -simplify & optimize updates.
         -more?
 */
HHellClicker = function ()
{
//==============================\\
//------CLASS DEFINITIONS-------\\
//==============================\\

    class Minion {
        //MinionsArray are your basic units
        //more advanced units inherit from the minion class

        //type: name of the minion
        //amount: owned amount of this minion
        //basePrice: how much does this minion cost by default
        //price: actual store price based on base price and amount of MinionsArray owned

        constructor(type, button, statBar, amount, basePrice, price) {
            this.type = type;
            this.button = button;
            this.statBar = statBar;
            this.amount = amount;
            this.basePrice = basePrice;
            this.price = price;
        }

        DoJob() {
            // console.log(this.type + " does its job.");
        }
    }

    class Corruptor extends Minion {
        //corruptors generate additional agony over time

        DoJob() {
            // super.DoJob();
            //console.log(this.type + " corrupts the innocent.");
        }
    }

    class Tormentor extends Minion {
        //tormentors generate additional souls over time

        DoJob() {
            // super.DoJob();
            //console.log(this.type + " engages in torture.");

        }

    }

//===========================\\
//---------VARIABLES---------\\
//===========================\\


//BUTTON REFERENCES:
    let clickerBtn = document.getElementById("clickerBtn");

    let cheatAgony1KBtn = document.getElementById("cheatAgony1K");
    let cheatAgony1MilBtn = document.getElementById("cheatAgony1M");

//DISPLAY ELEMENT REFERENCES:
    let agonyDsp = document.getElementById("agonyDisplay");

//MENU REFERENCES (fill these through usage of script)
    let StoreList = document.getElementById("storeItemList");

//INVENTORY VALUES
    let agony = 0;

//FIXME: better to define these in the init?
    let MinionsArray = [
        new Minion("soul",null,null, 1, 10, 0),
        new Tormentor("imp",null,null, 0, 10, 0),
        new Tormentor("devil",null,null, 0, 20, 0),
        new Corruptor("jezebel",null,null, 0, 30, 0),
        new Corruptor("beguiler",null,null, 0, 40, 0),
    ]

//MULTIPLIERS
    let agonyMultiplier = 1;
    let agonyPerSecond = 0;
    let soulsPerSecond = 0;

    let succubiTimer = 0;
    let succubiInterval = 20;

//DANGER ZONE
    let areWeCheating = false;//END DANGER ZONE

//=======================\\
//---------GAME----------\\
//=======================\\

    //run on startup
    Init();

//TICK INTERVAL
    setInterval(Tick, 1000);

//======================\\
//-------END GAME-------\\
//======================\\

//============================\\
//---BUTTON LISTENER EVENTS---\\
//============================\\

//---MAIN CLICKER BUTTON
    clickerBtn.addEventListener("click", () =>
    {
        //on click, torment souls to gain agony.
        //1 soul generates 1 agony per click by default

        agony += MinionsArray[0].amount;
        UpdateDisplay();
    });

//---CHEATY, CHEATY BUTTONS
    cheatAgony1KBtn.addEventListener("click", () =>
    {
        agony += 1000;
        UpdateDisplay();
    });
    cheatAgony1MilBtn.addEventListener("click", () =>
    {
        agony += 1000000;
        UpdateDisplay();
    });

//=============================
//FUNCTIONS TO MAKE LIFE EASIER
//=============================

    function Init() {

        //INITIALIZE BUTTONS
        cheatAgony1KBtn.hidden = !areWeCheating;
        cheatAgony1MilBtn.hidden = !areWeCheating;

        
        clickerBtn = document.getElementById("clickerBtn");
        //Initialize script functions
        //iterate through MinionsArray array and generate store buttons for all of them.

        //SETUP ALL STORE BUTTONS
        //TODO: add stats display in same loop
        MinionsArray.forEach(function (minion)
        {
            minion.price = CalculatePrice(minion.basePrice, minion.amount, 1);
            CreateShopButton("storeItemList", minion);
            CreateStatBar("itemStatList", minion);
        });

        UpdateShop();
        UpdateStats();
        // CreateStoreButton("storeItemList", MinionsArray[0].type, MinionsArray[0].price, MinionsArray[0].buttonId);
    }

    function UpdateDisplay()
    {
        UpdateShop();
        UpdateStats();
    }

    function UpdateStats() {
        //update agony display
        agonyDsp.innerHTML = SimplifyNumber(agony).toString();

        //display information about owned MinionsArray
        MinionsArray.forEach(function(minion){
            minion.statBar.innerHTML =
                (minion.type + "s").toUpperCase().bold() + " : " + SimplifyNumber(minion.amount)
        });
    }

    function UpdateShop() {
        //update store buttons if the player has enough agony to buy something,
        //as well as updating the displayed prices

        MinionsArray.forEach(function (minion)
        {
            minion.button.disabled = (agony < minion.price);
            minion.button.innerHTML = minion.type.toUpperCase() + ": " + SimplifyNumber(minion.price) + " agony";
            //maybe don't run this test every time? find alternative that only runs once then never again.
            if (agony >= minion.price) {
                minion.button.hidden = false;
            }
        });
    }

    function CreateShopButton(locationId, minion) {
        //this function will generate a button automatically
        //it will then also add a listener to the button

        if (minion instanceof Minion) {

            //generate custom Id for button
            let tempId = "Buy" + minion.type;

            //create button
            document.getElementById(locationId).insertAdjacentHTML("beforeend",
                "<li>" +
                "<button id=" +
                tempId +
                " class='btn-store padding-3 w-100 rounded-top margin-b' disabled>" +
                minion.type.toUpperCase() + ": " + SimplifyNumber(minion.price) + " agony" +
                "</button>" +
                "</li>");

            //store button in StoreButtons Array
            //TODO: solution is messy, cleanup?
            minion.button = document.getElementById(tempId);

            //add eventListener to handle what happens when the button is clicked
            minion.button.addEventListener("click", () =>
            {
                minion.amount++;
                console.log("bought " + minion.type + ", total amount now " + minion.amount);
                agony -= minion.price;

                //update price
                minion.price = CalculatePrice(minion.basePrice, minion.amount, 1);

                //run update functions
                UpdateDisplay();
            });

            //add eventListener to handle the cursor hovering over the button
            minion.button.addEventListener("mouseOver", () =>
                {
                    /*
                    * TODO: - build container to host info about the minion
                    *       - store container location/id
                    *       - make this function put text inside the container for as long as it is being hovered over
                    *       - add tooltip string variable to minion and inherited classes
                    *       - write tooltips for variables
                     */


                }
            );
        }
        else {
            //TODO: write a proper error message
            console.error("Something went wrong with generating a button!")
        }

    }

    function CreateStatBar(locationId, minion) {
        //This function will create a single stat bar for the stat menu

        if(minion instanceof Minion)
        {
            //generate id reference for stat bar
            let tempId = minion.type + "Stat";

            //generate stat bar
            document.getElementById(locationId).insertAdjacentHTML("beforeend",
                "<li id=" +
                tempId + //give element custom ID
                " class='w-100 padding-3 text-light'>" +
                (minion.type + "s").toUpperCase().bold() + //for now, this way of generating a plural will work
                " : " +
                SimplifyNumber(minion.amount) + //simplified amount of specific item
                "</li>"
                );

            //Add stat bar to StatBars Array
            minion.statBar = document.getElementById(tempId);

        }
        else {
            //TODO: write a proper error message
            console.error("Something went wrong with generating a stat line")
        }

    }

    function SimplifyNumber(number) {
        //SimplifyNumber will simplify large numbers into smaller numbers
        //when the number is over 1 million, it will be presented as 1.000 million
        //when the number is over 1 billion, it will be represented as 1.000 billion
        //etc.
        //TODO: add support for higher values?
        //maybe also see about putting in periods to separate big numbers below 1000000

        if (number >= 1000000) {
            return Math.floor(number / 1000) / 1000 + " million";
        }
        else if (number >= 1000000000) {
            return Math.floor(number / 1000000) / 1000 + " billion";
        }
        else {
            return number.toString();
        }
    }

    function Tick() {
        //Tick function should be executed once every interval of the timer.
        //TODO: - how to iterate through the array and get every minion type to do its own function
        //      - every X ticks/X seconds, a succubus type minion should give new souls
        //      - every X ticks/X seconds, a devil type minion should give new agony
        //      - iterate through array and have every minion run its own function?
        //      - consider class inheritance to make things easier to iterate on.

        MinionsArray.forEach(function (minion)
        {
            if (minion.amount > 0) {
                minion.DoJob();
            }
        });

        UpdateShop();
        UpdateStats();

    }

    function CalculatePrice(basePrice, amount, priceMultiplier) {
        //calculates price of an object based on the base cost, the owned amount of said item, and the cost multiplier
        //TODO: figure out better price calculation
        return basePrice + Math.floor(Math.pow(amount, 2 * priceMultiplier));
    }


//==============================
//-------HELPER FUNCTIONS-------
//==============================

}();
