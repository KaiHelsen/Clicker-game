//INVENTORY SYSTEM//

//INVENTORY CLASS
class Inventory {
    items = [];
    constructor()
    {};
    addNewItem(gameObject){
        if(gameObject instanceof GameObject)
        {
            this.items.push(gameObject);
            console.log("added new " + gameObject.name + " to inventory!");
        }
        else{
            //throw exception
            console.error("added object does not inherit from GameObject!");
        }
    }

    //addItem(){}
    buyItem(){}
    sellItem(){}
    updateItem(){}
    setItemButton(){}
}
//GAMEOBJECT BASE CLASS
class GameObject{
    name = "default";
    amount = 0;
    currency = "default";
    basePrice = 0;
    price = 0;
    priceMultiplier = 1;
    tooltipText = "default tooltip";
    shopButton = null;

    constructor(name, currency, basePrice, priceMultiplier, tooltipText)
    {
        this.name = name;
        this.currency = currency;
        this.basePrice = basePrice;
        this.priceMultiplier = priceMultiplier;
        this.tooltipText = tooltipText;

        this.Update();
    }

    Update(){
        //calculate price
        this.price = this.basePrice + Math.floor(Math.pow(this.amount, 2 * this.priceMultiplier));
    };
    SetItemButton(button){
        this.shopButton = button;
    }
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
