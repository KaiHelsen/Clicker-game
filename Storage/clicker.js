// CLICKER

let counterDisplayEl = document.getElementById("pointCounterDsp"); //reference to point display element
let multiplierDisplayEl = document.getElementById("multiplierDsp"); //reference to the multiplier display element
let autoClickDisplayEl = document.getElementById("autoClickerDsp"); //reference to the autoclicker isplay element

let mainClickerBtn = document.getElementById("mainButton");
let multiplierBtn = document.getElementById("storeMultiButton");
let autoClickBtn = document.getElementById("storeAutoButton");
let bonusBtn = document.getElementById("BonusButton");

// VARIABLES & CONSTANTS
let pointCount = 0; //count of clicker currency
let multiplier = 1; //multiplier
let autoClickers = 0; //amount of autoClickers
let autoClickerMultiplier = 1; //autoClicker multiplier
const multiplierBaseCost = 5; //base cost of multiplier
const autoClickPoints = 5; //base amount of points generated by each autoClicker
const autoClickBaseCost = 10; //base cost of autoClicker
let multiplierCurrentCost;
let autoClickCurrentCost;

let bonusCost = 30;
let isBonusActive = false;
let bonusTimeCount = 30;
let bonusTimer = 0;

OnAwake();

//autoClicker timer
setInterval(function ()
{
    if (autoClickers > 0) {
        AutoClick();
    }
}, 3000);

//Bonus timer
setInterval(function(){
    if(bonusTimer > 0)
    {
        bonusTimer -= 1;
    }
    else{
        isBonusActive = false;
    }
}, 1000);

//listeners
mainClickerBtn.addEventListener("click", () =>
{
    let points = 1 * multiplier;
    if(isBonusActive)
    {
        points *= 20;
    }
    pointCount += points;
    // console.log(pointCount);
    UpdateDisplay();
});

multiplierBtn.addEventListener("click", () =>
{
    multiplier++;
    pointCount -= multiplierCurrentCost;
    UpdateStorePrices();
    UpdateDisplay();
});

autoClickBtn.addEventListener("click", ()=>
{
    autoClickers++;
    pointCount -= autoClickCurrentCost;
    UpdateStorePrices();
    UpdateDisplay();

});

bonusBtn.addEventListener("click", ()=>
{
    bonusTimer = bonusTimeCount;
    isBonusActive = true;
    bonusBtn.disabled = true;

    UpdateStorePrices();
    UpdateDisplay();
});


//functions
function UpdateDisplay() {
    counterDisplayEl.innerHTML = pointCount.toString();
    multiplierDisplayEl.innerHTML = "X" + multiplier;
    autoClickDisplayEl.innerHTML = autoClickers.toString();

    //update multiplier button with current multiplier price
    //also, if the player cannot afford the item at this time, disable the button
    multiplierBtn.innerHTML = "Buy Multiplier: " + multiplierCurrentCost + " points!";
    if (pointCount >= multiplierCurrentCost) {
        multiplierBtn.disabled = false;
    }
    else {
        multiplierBtn.disabled = true;
    }

    //update autoClicker button with current autoClicker price
    //also, if the player cannot afford the autoClicker at this time, disable the button
    autoClickBtn.innerHTML = "Buy AutoClicker: " + autoClickCurrentCost + " points!";
    if (pointCount >= autoClickCurrentCost) {
        autoClickBtn.disabled = false;
    }
    else {
        autoClickBtn.disabled = true;
    }

    //update Bonus Button with bonus price and availability
    if(!isBonusActive)
    {
        bonusBtn.innerHTML = "!!!BONUS: " + bonusCost + " POINTS!!!"
        if(pointCount >= bonusCost)
        {
            bonusBtn.disabled = false;
        }
        else
        {
            bonusBtn.disabled = true;
        }
    }
    else{
        bonusBtn.disabled = true;
        bonusBtn.innerHTML = bonusTimer.toString();
    }

}

function AutoClick() {
    pointCount += autoClickers * (autoClickerMultiplier * autoClickPoints);
    UpdateDisplay();
}

function UpdateStorePrices() {
    multiplierCurrentCost = multiplierBaseCost + Math.pow(5, multiplier) - 5;
    autoClickCurrentCost = autoClickBaseCost + Math.pow(5, autoClickers) -1;
}

function OnAwake() {
    UpdateStorePrices();
    UpdateDisplay();
}


// (function ()
// {
//     //code goes here
// })
// ;