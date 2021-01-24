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
         -PROVIDE SUPPORT FOR MULTIPLE CURRENCIES


 */

import {Inventory, GameObject, Corruptor, Tormentor} from "./Inventory.js";
import {ItemArray} from "./InventoryItems.js";

let HellClicker = function ()
{

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
    let myInventory = new Inventory();

//MULTIPLIERS
    //nothing here yet
//DANGER ZONE
    let areWeCheating = true;//END DANGER ZONE

//=======================\\
//---------GAME----------\\
//=======================\\

// run on startup
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
        if ("content" in document.createElement("template")) {
            //collect specific templates from the document
            ShopButtonTemplate = document.getElementById("shopTemplate");
            StatBarTemplate = document.getElementById("StatTemplate");
        }
        else {
            //throw error if HTML template is not supported
            console.error("Browser does not seem to support HTML template tag")
        }

        //initialize Inventory from InventoryItems.js
        ItemArray.forEach(function(item){
            myInventory.addNewItem(item);
        });

        console.log(myInventory);

        //Initialize script functions
        //iterate through ItemArray array and generate store buttons for all of them.

        //SETUP ALL STORE BUTTONS
        //TODO: add stats display in same loop

        myInventory.items.forEach(function (invItem)
        {
            //invItem.Update();
            CreateShopButton(ShopList, invItem);
            //CreateStatBarExp(StatList, invItem);
        });

        //add 1 soul to the inventory

        ItemArray[0].amount++;

        UpdateEverything();
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
            if (minion instanceof Tormentor) {
                TormentorAgony += minion.amount * minion.tier;
            }
        });
        agony += TormentorAgony;

        UpdateShop();
        //UpdateStats();

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
        // ItemArray.forEach(function (minion)
        // {
        //     minion.statBar.innerHTML =
        //         minion.name.toUpperCase().bold() + " : " + SimplifyNumber(minion.amount)
        // });
    }

    function UpdateShop() {
        //update store buttons if the player has enough agony to buy something,
        //as well as updating the displayed prices

        myInventory.items.forEach(function (item)
        {
            item.shopButton.disabled = (agony < item.price);
            item.shopButton.innerHTML = item.name.toUpperCase() + ": " + SimplifyNumber(item.price) + "_" + item.currency;
            //maybe don't run this test every time? find alternative that only runs once then never again.
            if (agony >= item.price) {
                item.shopButton.hidden = false;
            }
        });
    }

    function CreateShopButton(targetLocation, item) {
        if (item instanceof GameObject) {
            //TODO: clean up this function, I think there's too much repetition.
            //generate unique ID for button
            //generate specific content for button
            let myID = item.name + "Btn";
            let content = item.name.toUpperCase() + ": " + SimplifyNumber(item.price) + "_" + item.currency;

            //create button from template
            let node = ShopButtonTemplate.content.cloneNode(true);

            //change id and content of button
            node.querySelector("button").id = myID;
            node.querySelector("button").textContent = content;

            //append button to document
            targetLocation.appendChild(node);
            let button = document.getElementById(myID);
            item.SetItemButton(button);

            //add event listeners to button
            button.addEventListener("click", () =>
            {
                item.amount++;
                console.log("bought " + item.name + ", total amount now " + item.amount);
                agony -= item.price;

                //update price
                item.Update();

                //run update functions
                UpdateEverything();
            });

            button.addEventListener("mouseover", () =>
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

            button.addEventListener("mouseleave", () =>
            {
                /*TODO: - same as the previous function
                        - this function should tell the tooltip container that its services are no longer required
                */

                ToolTipDsp.innerHTML = "";
                ToolTipDsp.hidden = true;

            });
        }
        else{
            console.error("Button could not be initialized properly!");
        }
    }

    function CreateStatBarExp(targetLocation, item) {
        //This function will create a single stat bar for the stat menu (experimental version)

        if (item instanceof GameObject) {

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
            targetLocation.appendChild(node);
            item.statBar = document.getElementById(myID);


        }
        else {
            console.error("object being parsed into CreateStatBar is not an instance of GameObject");
        }

    }

    function SimplifyNumber(number) {
        //SimplifyNumber will simplify large numbers into smaller numbers
        //when the number is over 1 million, it will be presented as 1.000 million
        //when the number is over 1 billion, it will be represented as 1.000 billion
        //etc.
        //TODO: add support for higher values?
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


//==============================
//-------HELPER FUNCTIONS-------
//==============================

    //NOTHING HERE YET

}();
