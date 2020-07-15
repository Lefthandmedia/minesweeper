var root = document.getElementById('grid');

var gridsize   = 18;
var bombamount = 40;
var bombs      = [];
var flags      = [];
var cells      = [];
var bomsfound  = 0;

const makegrid = (a) => {
  for (let i = 0; i <= a - 1; i++) {
    let row = document.createElement("DIV");
    row.setAttribute('data-id', i);
    row.classList.add('mine-row');
    root.appendChild(row);
    cells[i] = [];

    for (let j = 0; j <= a - 1; j++) {
      let cell = document.createElement("DIV");
      cell.setAttribute('data-x', j);
      cell.setAttribute('data-y', i);
      cell.classList.add('mine-cell');
      cell.classList.add('closed');
      cell.innerText = '';
      row.appendChild(cell);
      cell.addEventListener('click', onClick);
      cell.addEventListener('contextmenu', setFlag);
      cells[i][j] = cell;
    }
  }
}

const placebombs = (bombamount) => {
  for (let i = 0; i <= bombamount - 1; i++) {
    let x    = Math.floor(Math.random() * gridsize);
    let y    = Math.floor(Math.random() * gridsize);
    let bomb = cells[y][x];
    bomb.classList.add('bomb');
    bomb.setAttribute('data-bomb', true)
    // });
    bombs.push(bomb);
  }
}

const setFlag = (evt) => {
  let cell = evt.target;
  if (cell.classList.contains('closed')) {
    (cell.classList.contains('flag')) ? cell.classList.remove('flag') : cell.classList.add('flag');
  }

  bombs.forEach((bomb) => {
    if (cell.dataset.x == bomb.dataset.x && cell.dataset.y == bomb.dataset.y && cell.classList.contains('bombflag') && cell.classList.contains('closed')) {
      cell.classList.remove('bombflag');
    } else if (cell.dataset.x == bomb.dataset.x && cell.dataset.y == bomb.dataset.y && !cell.classList.contains('bombflag') && cell.classList.contains('closed')) {
      cell.classList.add('bombflag');
    }
  })
  iswinning();
}

const iswinning = () => {
  let found = root.querySelectorAll('.bombflag');
  console.log('found amount', found.length);
}

//maak een functie
// het aantal flag en aantal bombflags worden getelt
// en als het > bombamount is dan kan je niet meer met rechtermuis klik klikken


const countAllbombs = () => {
  let cells = root.querySelectorAll('.mine-cell');
  cells.forEach((cell) => {
    checkneighbours(cell);
  });
}

const onClick = (evt) => {
  let cell = evt.target;
  let bomb = (cell.classList.contains('bomb'));
  if (!cell.classList.contains('flag')) {
    if (bomb) {
      alert('LOSER');
      revealbombs(cell);
    } else {
      checkcell(cell);
    }
  }
}

const checkcell = (cell) => {
  let x = cell.dataset.x;
  let y = cell.dataset.y;

  if (!cell.classList.contains('flag')) {

    for (let i = x - 1; i <= +x + 1; i++) {
      for (let j = y - 1; j <= +y + 1; j++) {
        if (i >= 0 && i < gridsize && j >= 0 && j < gridsize) {
          let buur = cells[j][i];
          if (buur.dataset.amount == 0 && buur.classList.contains('closed') && !buur.classList.contains('flag')) {
            // ;
            setTimeout(function () {
              checkcell(buur)
            }, 10);
            buur.classList.add('open');
            buur.classList.remove('closed');
          } else if (buur.dataset.amount > 0 && !buur.dataset.bomb && !buur.classList.contains('flag')) {
            buur.classList.add('getal');
            buur.classList.remove('closed');
            buur.innerText = buur.dataset.amount;
          }
        }
      }
    }
  }
}

const checkneighbours = (cell) => {
  let x   = cell.dataset.x;
  let y   = cell.dataset.y;
  let amt = 0;

  for (let i = x - 1; i <= +x + 1; i++) {
    for (let j = y - 1; j <= +y + 1; j++) {
      if (i >= 0 && i < gridsize && j >= 0 && j < gridsize) {
        let buur = cells[j][i];
        buur.dataset.bomb && amt++;
      }

    }
  }
  cell.setAttribute('data-amount', amt);
  // cell.innerText = amt;
}

const revealbombs = () => {
  let all = root.querySelectorAll('.mine-cell');
  all.forEach((cell) => {
    cell.classList.add('open');
    cell.classList.remove('closed');
    if (cell.dataset.amount > 0) {
      cell.innerText = cell.dataset.amount;
    }
  });
  bombs.forEach((bomb) => {
    bomb.classList.add('bombrevealed')
  })
  
}

makegrid(gridsize);
placebombs(bombamount);
countAllbombs();


