import { data } from "jquery";

var root = document.getElementById('grid');

var stdgridsize  = 18;
var stdbombamount = 10;
var bombamount;
var bombs      = [];
var flags      = [];
var cells      = [];
var bomsfound  = 0;
var time = 0;
var gameover = false;
var timer;
let gridsize;


const init = () => {
  bombs   = [];
  cells   = [];
  time = 0;
  gameover = false;
  let amt = document.getElementById('amount').value;
  gridsize =  (amt > 0) ?  amt : stdgridsize;
  console.log('sixe',gridsize);
  makegrid(gridsize);
  let bmt = document.getElementById('bommenamount').value;
  bombamount = (bmt > 0) ?  bmt :  stdbombamount;
  placebombs(bombamount);
  countAllbombs();
  setStart(gridsize);
}

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
    let bomb = addbomb();
    bombs.push(bomb);
  }
  console.log('CHECKbombs=', bombs.length, root.querySelectorAll('.bomb').length);
}

const addbomb = () => {
  let x = Math.floor(Math.random() * gridsize);
  let y = Math.floor(Math.random() * gridsize);
  let bomb;
  // console.log('bombs',bombs);
  if (newbomb(x, y)) {
    bomb = cells[y][x];
    bomb.classList.add('bomb');
    bomb.setAttribute('data-bomb', true);
  } else {
    console.log('allready exists', x ,y);
    bomb = addbomb();
  }
  return bomb;
}

const newbomb = (x, y) => {
  bombs.forEach((bomb) => {
    if (+bomb.dataset.x === x && +bomb.dataset.y === y) {
      return false
    }
  });
  return true;
};

const setStart = (gridsize) => {
  const x = Math.floor(Math.random()*gridsize);
  const y = Math.floor(Math.random()*gridsize);
  let cell = cells[x][y];
  if (checkStart(x,y)) {
    setStart(gridsize);
  } else {
    cell.classList.add('start');
  }
  console.log('start',x,y, cell);
}

const checkStart = (x,y) => {
  let cell = cells[x][y];
  return cell.dataset.bomb;
}

const setFlag = (evt) => {
  let cell  = evt.target;
  let flags = root.querySelectorAll('.flag');
  if (gameover) return;
  if (cell.classList.contains('closed')) {
    if (cell.classList.contains('flag')) {
      cell.classList.remove('flag');
    } else {
      if (flags.length < bombamount)
        cell.classList.add('flag');
    }
  }

  bombs.forEach((bomb) => {
    if (cell.dataset.x == bomb.dataset.x && cell.dataset.y == bomb.dataset.y && cell.classList.contains('bombflag') && cell.classList.contains('closed')) {
      cell.classList.remove('bombflag');
    } else if (cell.dataset.x == bomb.dataset.x && cell.dataset.y == bomb.dataset.y && !cell.classList.contains('bombflag') && cell.classList.contains('closed')) {
      cell.classList.add('bombflag');
    }
  });
  document.getElementById('flagamount').innerText = bombamount - root.querySelectorAll('.flag').length;
  iswinning();
}

const iswinning = () => {
  let found = root.querySelectorAll('.bombflag');
  if (found.length === +bombamount) {
    gameover = true;
    clearInterval(timer);
    alert('You won Hoera!!' + '\nYou\'re time was ' + time + ' seconds.');
    // if (window.confirm("Retry?")) {
    //   reset();
    // }
  }
}

const countAllbombs = () => {
  let cells = root.querySelectorAll('.mine-cell');
  cells.forEach((cell) => {
    checkneighbours(cell);
  });
}

const onClick = (evt) => {
  let cell = evt.target;
  timer = setInterval(()=>{
    time++;
    document.getElementById('tijd').innerText = `${time} seconden`;
  },1000);
  let bomb = (cell.classList.contains('bomb'));
  if (gameover) return;
  if (!cell.classList.contains('flag') && !cell.classList.contains('getal')) {
    if (bomb) {
      alert('GAME OVER\nYou hit a bomb.' + '\nYou\'re time was ' + time + ' seconds.');
      revealbombs(cell);
      gameover = true;
      clearInterval(timer);
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
            buur.classList.add(`nummer${buur.dataset.amount}`)
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
  clearInterval(timer);
  all.forEach((cell) => {
    // cell.classList.add('open');
    // cell.classList.remove('closed');
    // if (cell.dataset.amount > 0) {
    //   cell.innerText = cell.dataset.amount;
    // }
  });
  bombs.forEach((bomb) => {
    bomb.classList.add('bombrevealed')
  })
  // setTimeout(function () {
  //   // if (window.confirm("Retry?")) {
  //   //   reset();
  //   // }
  // }, 3000);

}

const reset = () => {
  clearInterval(timer);
  time = 0;
  console.log("new game");
  const grid = document.getElementById('grid'); 
  while (grid.firstChild) {
    grid.removeChild(grid.lastChild);
  }
  init();
}

document.getElementById('startBtn').addEventListener('click', reset);
