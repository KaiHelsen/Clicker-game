//creating a progress bar
/**
*progressbar class serves as a way to easily and handily deal with a progressbar in HTML as well as storing a value.
 **/
    class progressBar
{
    value = 0;
    maxValue = 100;

    /**
     * constructor
     * @param {HTMLElement} element reference to the load bar (not the container, the actual bar)
     * @param {number} startingValue the starting value of the bar
     * @param {number} maxValue maximum value of the bar. the value of the class is clamped by this one.
     */
    constructor(element, startingValue, maxValue)
    {
        this.bar = element;
        this.value = startingValue;
        this.maxValue = maxValue;
    }

    /**
     * Helper function to determine the percentage size of the bar
     * @param {number} value that is to be evaluated
     * @param {number} total value that value is being evaluated against; the 100% value.
     * @returns {number}  returns percentage value (0-100)
     */
    percentage(value, total)
    {
        if (value > total) {
            return total * 100 / value;
        }
        else {
            return value * 100 / total;
        }
    }

    /**
     *
     * @param newValue
     * @constructor
     */
    Update(newValue)
    {
        //parse and interpret new value
        if (typeof (newValue) == "undefined") {
            console.log("no new value defined")
        }
        else if (newValue > this.maxValue) {
            this.value = this.maxValue;
        }
        else {
            this.value = newValue
        }
        //update display
        let percent = this.percentage(this.value, this.maxValue);
        this.bar.style.width = percent + "%";
    }

    SetInnerText(contents)
    {
        this.bar.innerText = contents;
    }
}
//
//
// let bar = new progressBar(document.getElementById("progress"), 20, 60);
// let soulsBar = new progressBar(document.getElementById("progress2"), 10, 200);
// bar.Update();
// bar.SetInnerText("STONKS");
// soulsBar.Update();
// soulsBar.SetInnerText("SOULS: " + soulsBar.value + " / " + soulsBar.maxValue);
//
// let button = document.getElementById("increase");
// button.addEventListener("click", () =>
// {
//     bar.Update(bar.value + 1);
//
//     soulsBar.Update(soulsBar.value + 2);
//     soulsBar.SetInnerText("SOULS: " + soulsBar.value + " / " + soulsBar.maxValue);
// });


export {progressBar};

