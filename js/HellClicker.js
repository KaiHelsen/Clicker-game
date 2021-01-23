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

    class Item
    {
        //ItemArray are your basic units
        //more advanced units inherit from the minion class

        //type: name of the minion
        //amount: owned amount of this minion
        //basePrice: how much does this minion cost by default
        //price: actual store price based on base price and amount of ItemArray owned

        constructor(type, button, statBar, basePrice, price, priceMultiplier, description) {
            this.type = type;
            this.button = button;
            this.statBar = statBar;
            this.amount = 0;
            this.basePrice = basePrice;
            this.price = price;
            this.priceMultiplier = priceMultiplier;
            this.tooltipText = description;
        }

        DoJob() {
            // console.log(this.type + " does its job.");
        }
    }

    class Corruptor extends Item
    {
        //corruptors generate additional agony over time
        constructor(type, button, statBar, basePrice, price, priceMultiplier, description){
            super(type, button, statBar, basePrice, price, priceMultiplier, description);
        }

        DoJob() {
            // super.DoJob();
            //console.log(this.type + " corrupts the innocent.");
        }
    }

    class Tormentor extends Item
    {
        //tormentors generate additional souls over time
        constructor(type, agonyPerSec, button, statBar, basePrice, price, priceMultiplier, description){
            super(type, button, statBar, basePrice, price, priceMultiplier, description);
            this.agonyPerSec = agonyPerSec;

        }

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

    let ShopButtonTemplate;
    let StatBarTemplate;

    //TODO: create system to store HTML templates and sort through them on the fly
    // let HTMLTemplates = [];

//DISPLAY ELEMENT REFERENCES:
    let agonyDsp = document.getElementById("agonyDisplay");
    let ToolTipDsp = document.getElementById("tooltipText");

//MENU REFERENCES
    let ShopList = document.getElementById("shopItemList");
    let StatList = document.getElementById("itemStatList");

//INVENTORY VALUES
    let agony = 0;

    //CURRENCY ARRAY
    //
    let currency = [
        {type: "agony", amount: 0},
        {type: "souls", amount: 0},
    ]

//FIXME: better to define these in the init?
    /*TODO: Rebuild array/inventory system
    what we want to do is  rework the inventory system to allow for different currencies
    ie. we want the store to allow you to buy souls, but also use souls to buy specific units.
    so, every "minion" needs a currency. however, since souls are minions, that makes things somewhat complicated.
    look into enumerators?
     */
    let ItemArray = [
        new Item(
            "soul",
            null,
            null,
            10,
            0,
            1,
            "The souls of the wretched, cursed beings. their pain fuels your economy."),
        new Tormentor(
            "imp",
            1,
            null,
            null,
            15,
            0,
            1,
            "Lowest of the low, imps take great pleasure in causing grief, through pranks or pain."),
        new Tormentor(
            "devil",
            2,
            null,
            null,
            35,
            0,
            1,
            "These denizens of the pit will work day and night to wring every last bit of agony from the damned."),
        new Corruptor(
            "jezebel",
            null,
            null,
            30,
            0,
            1,
            "Theirs is to walk the realm of mortals, and to drive mortals to sin and damnation"),
        new Corruptor(
            "beguiler",
            null,
            null,
            40,
            0,
            1,
            "Like moths to a flame, come the impure to the corruptor, and damnation their reward."),
    ]

//MULTIPLIERS
    let agonyMultiplier = 1;
    let agonyPerSecond = 0;
    let soulsPerSecond = 0;

    let succubiTimer = 0;
    let succubiInterval = 20;

//DANGER ZONE
    let areWeCheating = true;//END DANGER ZONE

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

        agony += ItemArray[0].amount;
        UpdateEverything();
    });

//---CHEATY, CHEATY BUTTONS
    cheatAgony1KBtn.addEventListener("click", () =>
    {
        agony += 1000;
        UpdateEverything();
    });
    cheatAgony1MilBtn.addEventListener("click", () =>
    {
        agony += 1000000;
        UpdateEverything();
    });

//=============================
//FUNCTIONS TO MAKE LIFE EASIER
//=============================

    function Init() {

        //INITIALIZE BUTTONS
        cheatAgony1KBtn.hidden = !areWeCheating;
        cheatAgony1MilBtn.hidden = !areWeCheating;

        clickerBtn = document.getElementById("clickerBtn");

        //GET HTML TEMPLATES FROM HTML
        //DANGER: EXPERIMENTAL!!!
        if("content" in document.createElement("template"))
        {
            //collect specific templates from the document
            ShopButtonTemplate = document.getElementById("shopTemplate");
            StatBarTemplate = document.getElementById("StatTemplate");
        }
        else
        {
            //throw error if HTML template is not supported
            console.error("Browser does not seem to support HTML template tag")
        }



        //Initialize script functions
        //iterate through ItemArray array and generate store buttons for all of them.

        //SETUP ALL STORE BUTTONS
        //TODO: add stats display in same loop

        ItemArray.forEach(function (item)
        {
            item.price = CalculatePrice(item.basePrice, item.amount, 1);
            CreateShopButton(ShopList, item);
            CreateStatBarExp(StatList, item);
        });

        UpdateEverything();
        // CreateStoreButton("storeItemList", ItemArray[0].type, ItemArray[0].price, ItemArray[0].buttonId);
    }

    function Tick() {
        //Tick function should be executed once every interval of the timer.
        //TODO: - how to iterate through the array and get every minion type to do its own function
        //      - every X ticks/X seconds, a succubus type minion should give new souls
        //      - every X ticks/X seconds, a devil type minion should give new agony
        //      - iterate through array and have every minion run its own function?
        //      - consider class inheritance to make things easier to iterate on.

        let TormentorAgony = 0;
        ItemArray.forEach(function (minion)
        {
            if(minion instanceof Tormentor)
            {
                TormentorAgony += minion.amount * minion.agonyPerSec;
            }
        });
        agony += TormentorAgony;

        UpdateShop();
        UpdateStats();

    }

    function UpdateEverything() {
        //When in doubt
        //UPDATE EVERYTHING
        UpdateShop();
        UpdateStats();
    }

    function UpdateStats() {
        //update agony display
        agonyDsp.innerHTML = SimplifyNumber(agony).toString();

        //update information about owned Items
        ItemArray.forEach(function (minion)
        {
            minion.statBar.innerHTML =
                minion.type.toUpperCase().bold() + " : " + SimplifyNumber(minion.amount)
        });
    }

    function UpdateShop() {
        //update store buttons if the player has enough agony to buy something,
        //as well as updating the displayed prices

        ItemArray.forEach(function (item)
        {
            item.button.disabled = (agony < item.price);
            item.button.innerHTML = item.type.toUpperCase() + ": " + SimplifyNumber(item.price) + " agony";
            //maybe don't run this test every time? find alternative that only runs once then never again.
            if (agony >= item.price) {
                item.button.hidden = false;
            }
        });
    }

    function CreateShopButton(location, item){
        if(item instanceof Item)
        {
            //TODO: clean up this function, I think there's too much repetition.
            //generate unique ID for button
            //generate specific content for button
            let myID = item.type + "Btn";
            let content = item.type.toUpperCase() + ": " + SimplifyNumber(item.price) + " agony";

            //create button from template
            let node = ShopButtonTemplate.content.cloneNode(true);

            //change id and content of button
            node.querySelector("button").id = myID;
            node.querySelector("button").textContent = content;

            //append button to document
            location.appendChild(node);
            item.button = document.getElementById(myID);

                //add event listeners to button
            item.button.addEventListener("click", () =>
            {
                item.amount++;
                console.log("bought " + item.type + ", total amount now " + item.amount);
                agony -= item.price;

                //update price
                item.price = CalculatePrice(item.basePrice, item.amount, 1);

                //run update functions
                UpdateEverything();
            });

            item.button.addEventListener("mouseover", () =>
            {
                /*
                * TODO: - build container to host info about the minion
                        - store container location/id
                        - make this function put text inside the container for as long as it is being hovered over
                        - add tooltip string variable to minion and inherited classes
                        - write tooltips for variables
                 */

                ToolTipDsp.innerHTML = item.tooltipText;
                ToolTipDsp.hidden = false;
            });

            item.button.addEventListener("mouseleave", () =>
            {
                /*TODO: - same as the previous function
                        - this function should tell the tooltip container that its services are no longer required
                */

                ToolTipDsp.innerHTML = "";
                ToolTipDsp.hidden = true;

            });
        }
    }

    function CreateStatBarExp(location, item) {
        //This function will create a single stat bar for the stat menu (experimental version)

        if(item instanceof Item){

            //TODO: clean up this function, I think there's too much repetition.
            //generate unique ID for button
            //generate specific content for button
            let myID = item.type + "Stats";
            let content = item.type.toUpperCase().bold() + " : " + SimplifyNumber(item.amount);

            //create stat bar from template
            let node = StatBarTemplate.content.cloneNode(true);

            //change content and ID of statBar
            node.querySelector("span").id = myID;
            node.querySelector("span").textContent = content;

            //append statBar to document
            location.appendChild(node);
            item.statBar = document.getElementById(myID);


        }
        else {
            console.error("object being parsed into CreateStatBar is not an instance of Item");
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
            return (Math.floor(number / 1000)).toLocaleString() + " million";
        }
        else if (number >= 1000000000) {
            return (Math.floor(number / 1000000)).toLocaleString() + " billion";
        }
        else {
            return number.toLocaleString();
        }
    }

    function CalculatePrice(basePrice, amount, priceMultiplier) {
        //calculates price of an object based on the base cost, the owned amount of said item, and the cost multiplier
        //TODO: figure out better price calculation
        return basePrice + Math.floor(Math.pow(amount, 2 * priceMultiplier));
    }


//==============================
//-------HELPER FUNCTIONS-------
//==============================

    //NOTHING HERE YET

}();
