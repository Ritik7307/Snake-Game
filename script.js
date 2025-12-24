const board = document.querySelector('.board');
const blockHeight = 80;
const blockWidth = 80;

const rows = Math.floor(board.clientHeight / blockHeight);
const cols = Math.floor(board.clientWidth / blockWidth);

const block = document.createElement('div');

// for (let i = 0; i < rows * cols; i++) {
//     const block = document.createElement('div');
//     block.classList.add('block');
//     board.appendChild(block);
// }

for(let row = 0; row < rows; row++) {
    for(let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
        block.innerText = `${row}, ${col}`;
        blocks[`${row}-${col}`] = block;
        // const block = document.createElement('div');
        // block.classList.add('block');
        // block.style.top = `${row * blockHeight}px`;
        // block.style.left = `${col * blockWidth}px`;
        // board.appendChild(block);
        
    }
}