// Create three buttons.

import ZipBackend from "./zipBackend";
import alpha from "./AlphaScraper";
import {BetaSaver} from "./beta";

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

// Beta (read) -> Gamma

// Alpha -> Gamma

