var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const myLocationBtn = document.getElementById('myLocationBtn');
myLocationBtn.addEventListener('click', function() { handlePermission() });

function handlePermission() {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
        report(result.state, "geolocation");        
        } else if (result.state === "prompt") {
        report(result.state, "geolocation");
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
            };
        function success(pos) {
            map.locate({setView: true, maxZoom: 16});
        }
        
        function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        }          
        navigator.geolocation.getCurrentPosition(
            success,
            error,
            options,
        );
        } else if (result.state === "denied") {
        report(result.state, "geolocation");
        }
        result.addEventListener("change", () => {
        report(result.state);
        });
    });
    navigator.permissions.query({ name: "notifications" }).then((result) => {
        if (result.state === "granted") {
            report(result.state, "notification");
        } else if (result.state === "prompt") {
            report(result.state, "notification");     
            Notification.requestPermission();
        } else if (result.state === "denied") {
            report(result.state, "notification");
        }
        result.addEventListener("change", () => {
            report(result.state);
        });
    });
}

function report(state, type) {
    console.log(`${type} permission ${state}`);
}

const saveMapBtn = document.getElementById('saveMapBtn');
saveMapBtn.addEventListener('click', saveMapAsTiles);

function saveMapAsTiles() {
    leafletImage(map, function(err, canvas) {
    if (err) {
        console.error(err);
        return;
    }

    var img = document.createElement('canvas');
    var dimensions = map.getSize();
    img.width = dimensions.x;
    img.height = dimensions.y;

    // const tileCtx = img.getContext('2d');
    // tileCtx.drawImage(canvas, 0, 0);
    // document.getElementById('savedMap').innerHTML = '';
    // document.getElementById('savedMap').appendChild(img);

    const tileWidth = img.width / 4;
    const tileHeight = img.height / 4;
    let tiles = [];
    for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
            const tileCanvas = document.createElement('canvas');
            tileCanvas.width = tileWidth;
            tileCanvas.height = tileHeight;
            const tileCtx = tileCanvas.getContext('2d');
            
            tileCtx.drawImage(canvas, x * tileWidth, y * tileHeight, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
            
            tileCanvas.draggable = true;
            tileCanvas.dataset.gridX = x;
            tileCanvas.dataset.gridY = y;
            tileCanvas.classList.add('map-tile');
            
            tileCanvas.addEventListener('dragstart', handleDragStart);
            tileCanvas.addEventListener('dragend', (e) => { e.target.style.border = 'none'; });
            tiles.push(tileCanvas);
        }
    }

    tiles.sort(() => Math.random() - 0.5);
    const tilesContainer = document.getElementById('tiles');
    tilesContainer.innerHTML = '';
    tiles.forEach(tile => tilesContainer.appendChild(tile));

    const solutionCanvas = document.getElementById('solutionCanvas');
    solutionCanvas.innerHTML = '';
    solutionCanvas.style.backgroundColor = 'CadetBlue';
    for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
            const solutionBlock = document.createElement('canvas');
            solutionBlock.width = tileWidth;
            solutionBlock.height = tileHeight;
            solutionBlock.dataset.solutionGridX = y;
            solutionBlock.dataset.solutionGridY = x;
            solutionBlock.classList.add('solution-block');
            solutionBlock.addEventListener('dragover', handleDragOver);
            solutionBlock.addEventListener('drop', handleDrop);
            solutionCanvas.appendChild(solutionBlock);
        }
    }
})}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', 
        JSON.stringify({
            gridX: e.target.dataset.gridX,
            gridY: e.target.dataset.gridY
        })
    );
    const tile = document.querySelector(`[data-grid-x="${e.target.dataset.gridX}"][data-grid-y="${e.target.dataset.gridY}"]`);
    tile.style.border = '2px solid black';
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const dropCanvas = e.target;
    const ctx = dropCanvas.getContext('2d');
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    const tile = document.querySelector(`[data-grid-x="${data.gridX}"][data-grid-y="${data.gridY}"]`);
    
    ctx.drawImage(tile, 0, 0);
    
    tile.remove();

    dropCanvas.dataset.gridX = data.gridX;
    dropCanvas.dataset.gridY = data.gridY;

    setTimeout(() => {
    const solutionBlocks = document.querySelectorAll('.solution-block');
    let solved = true;
    for (let block of solutionBlocks) {
        if (block.dataset.solutionGridX !== block.dataset.gridX || block.dataset.solutionGridY !== block.dataset.gridY) {
            solved = false;
            break;
        }
    }
    if (solved) {
        alert('Gratulacje! Mapa została ułożona poprawnie.');
        const text = 'Gratulacje! Mapa została ułożona poprawnie.';
        const notification = new Notification("Puzzle", { body: text });
    }
    }, 300);

}
