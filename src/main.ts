import alpha from "./AlphaScraper";
import GammaEpub from "./gamma/gammaEpub";

function createButton (label: string, callback: () => any) {
    const loginButtons = [...document.querySelectorAll('a[href="/login"]')] as HTMLAnchorElement[];
    const loginButton = loginButtons.find(button => button.checkVisibility())
    if (!loginButton) {
        throw new Error('A visible login button was not found')
    }
    const b = loginButton?.cloneNode(false) as HTMLAnchorElement;
    b.href = ''
    b.innerHTML = label;
    b.onclick = e => {callback();e.preventDefault();};
    loginButton.parentElement?.appendChild(b)
}

// Alpha -> Gamma
createButton('DOWNLOAD', ()=>{
    alpha(new GammaEpub('Title', 'Author'))
})
