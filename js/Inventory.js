//INVENTORY SYSTEM//

//INVENTORY CLASS
class Inventory
{
    items = [];

    constructor() {};

    addNewItem(gameObject) {
        if (gameObject instanceof GameObject) {
            this.items.push(gameObject);
            console.log("added new " + gameObject.name + " to inventory!");
        }
        else {
            //throw exception
            console.error("added object does not inherit from GameObject!");
        }
    }

    //addItem(){}
    buyItem() {}

    sellItem() {}

    updateItem() {}
}

//GAMEOBJECT BASE CLASS
/**
 * GameObject is a base class for handling simple inventory objects.
 */
class GameObject{
    name = "default";
    amount = 0;
    currency = "default";
    basePrice = 0;
    price = 0;
    priceMultiplier = 1;
    tooltipText = "default tooltip";
    shopButton = null;

    /**
     * GameObject is a base class for handling simple inventory objects in the clicker game
     * @param {string} name name of the Object
     * @param {number} currency If the player wishes to buy this object, what currency do they buy it with?
     * @param {number} basePrice base price of the object, gets incrementally higher as player acquires more
     * @param {number} priceMultiplier multiplier by which the price increases. Formula for calculating price is a Work In Progress
     * @param {string} tooltipText flavour text for the item
     */
    constructor(name, currency, basePrice, priceMultiplier, tooltipText)
    {
        this.name = name;
        this.currency = currency;
        this.basePrice = basePrice;
        this.priceMultiplier = priceMultiplier;
        this.tooltipText = tooltipText;

        this.Update();
    }

    /**
     * Update function updates all internal values of the GameObject (where appropriate)
     * In this case, all it does is update the price based on basePrice, priceMultiplier and amount owned.
     * @constructor
     */
    Update(){
        //calculate price
        this.price = this.basePrice + Math.floor(Math.pow(this.amount, 2 * this.priceMultiplier));
    };

    /**
     *
     * @param {HTMLElement} button button takes a HTML button element that will be used to access the gameObject directly.
     * @constructor
     */
    SetItemButton(button){
        this.shopButton = button;
    }

    /**
     *
     * @returns {HTMLElement} button returns the button associated with this gameObject.
     * @constructor
     */
    GetItemButton(){
        return this.shopButton;
    }
}

//GameObject INHERITOR CLASSES
class Tormentor extends GameObject{
    tier = 0;
    constructor(name, currency, basePrice, priceMultiplier, tooltipText, tier){
        super(name, currency, basePrice, priceMultiplier, tooltipText);
        this.tier = tier;
    }
}

class Corruptor extends GameObject{
    tier = 0;
    constructor(name, currency, basePrice, priceMultiplier, tooltipText, tier){
        super(name, currency, basePrice, priceMultiplier, tooltipText);
        this.tier = tier;
    }
}

//EXPORT CLASSES
export { Inventory, GameObject, Tormentor, Corruptor};
