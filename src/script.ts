//const msg: string = "Hello!";
//alert(msg);

const styles = {
    "modern": "style-1.css",
    "classic": "style-2.css",
    "third": "style-3.css"
};

const styleMenu = document.getElementById("styleMenu");
let links: any[] = [];
let currentStyleIndex = 0;

if (styleMenu) {
    const styleMenuHeader = document.createElement("h3");
    styleMenuHeader.innerHTML = "Dostępne style:";
    styleMenu.appendChild(styleMenuHeader);
    let it = 0;
    for (const [style, file] of Object.entries(styles)) {
        
        const link = document.createElement('link');
        link.id = "cssLink";
        link.rel = 'stylesheet';
        link.href = `${file}`;
        links.push(link);

        const styleLink = document.createElement("a");
        styleLink.innerHTML = `• ${style} [${file}]`;
        const cIt = it;
        styleLink.addEventListener('click', () => {changeStyle(cIt);});
        styleMenu.appendChild(styleLink);
        it = it + 1;
    }

    document.head.appendChild(links[0]);
    currentStyleIndex = 0;
    styleMenu.children[1].style.fontWeight = "bold";
}

function changeStyle(index : number) {
    const cssLink = document.getElementById("cssLink");
    if (cssLink) {
        cssLink.remove();
    }
    document.head.appendChild(links[index]);
    
    styleMenu.children[currentStyleIndex+1].style.fontWeight = "normal";
    styleMenu.children[index+1].style.fontWeight = "bold";
    
    currentStyleIndex = index;
}