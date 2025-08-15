import alpha from "./AlphaScraper";
import {BetaSaver} from "./beta";
import {Gamma} from "./gamma/gamma";

function createButton (label: string, callback: () => any) {
    const b = document.createElement('button')
    b.innerHTML = label;
    b.onclick = callback;
    document.body.appendChild(b)
}

// Alpha -> Beta(write)
createButton('Alpha -> Beta', ()=>{
    alpha(new BetaSaver())
})

// Alpha -> Gamma
createButton('Alpha -> Gamma', ()=>{
    alpha(new Gamma())
})
