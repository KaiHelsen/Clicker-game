import {Corruptor, GameObject, Tormentor} from "./Inventory.js";

let ItemArray = [
    new GameObject(
        "soul",
        0,
        10,
        1,
        "The souls of the wretched, cursed beings. their pain fuels your economy.",
    ),
    new Tormentor(
        "imp",
        0,
        15,
        1,
        "Lowest of the low, imps take great pleasure in causing grief, through pranks or pain.",
        1,
    ),
    new Tormentor(
        "devil",
        0,
        35,
        1,
        "These denizens of the pit will work day and night to wring every last bit of agony from the damned.",
        2,
    ),
    new Corruptor(
        "jezebel",
        1,
        30,
        1,
        "Theirs is to walk the realm of mortals, and to drive mortals to sin and damnation",
        1,
    ),
    new Corruptor(
        "beguiler",
        0,
        40,
        1,
        "Like moths to a flame, come the impure to the corruptor, and damnation their reward.",
        2,
    ),
]

export {ItemArray};