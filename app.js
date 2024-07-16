const canvas = document.getElementById('paintCanvas');
const context = canvas.getContext('2d');

let isDrawing = false;
let currentCircle = null;
let circles = [];

var isDoubleClick = false;
var isCircleDrawn = false;

canvas.addEventListener('dblclick', (e) => {
    isDoubleClick = true;
    deleteCircle(e);
});

canvas.addEventListener('click', (e) => {
    isDoubleClick = false;
    setTimeout(() => {
        if (isDoubleClick == false && isCircleDrawn == false) {
            message(e);
        }
    }, 200)
});

// Event listeners for canvas interactions
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('mouseout', endDrawing);

document.getElementById('resetButton').addEventListener('click', resetCanvas);

//Start drawing a circle
function startDrawing(e) {
    isDrawing = true;
    const startX = e.offsetX;
    const startY = e.offsetY;
    currentCircle = { startX, startY, radius: 0, color: getRandomColor() };
    circles.push(currentCircle);
}

//Draw the circle as the mouse moves
function draw(e) {
    if (!isDrawing) {
        return;
    }
    isCircleDrawn = true;
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    const radius = Math.sqrt(Math.pow(mouseX - currentCircle.startX, 2) + Math.pow(mouseY - currentCircle.startY, 2));
    circles[circles.length - 1].radius = radius;

    // Calling redrawCanvas to draw new circle
    redrawCanvas();
}

//Draw all circles
function redrawCanvas() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all circles
    circles.forEach(circle => {
        context.beginPath();
        context.arc(circle.startX, circle.startY, circle.radius, 0, 2 * Math.PI, false);
        context.fillStyle = circle.color;
        context.fill();
        context.closePath();
    });
}

//End the drawing of the circle
function endDrawing(e) {
    isDrawing = false;
    if (circles.length !=0 && circles[circles.length - 1].radius == 0) {
        circles.pop();
        redrawCanvas();
        isCircleDrawn = false;
        return;
    }
}

// Reset the canvas by clearing all circle
function resetCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    circles = [];
}

//Generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Delete a circle when double-clicked
function deleteCircle(e) {
    const clickX = e.offsetX;
    const clickY = e.offsetY;

    // Check if any circle is clicked
    for (let i = circles.length - 1; i >= 0; i--) {
        const circle = circles[i];
        const distance = Math.sqrt(Math.pow(clickX - circle.startX, 2) + Math.pow(clickY - circle.startY, 2));

        if (distance <= circle.radius) {
            
            // Remove the circle from the array
            circles.splice(i, 1);

            redrawCanvas();

            break; // Exit loop after deleting one circle
        }
    }
}

//Check if the user clicked on any existing circle and alert 'Hit' or 'Miss'
function message(e) {
    const clickX = e.offsetX;
    const clickY = e.offsetY;
    // Check if any circle is clicked
    for (let i = circles.length - 1; i >= 0; i--) {
        const circle = circles[i];
        const distance = Math.sqrt(Math.pow(clickX - circle.startX, 2) + Math.pow(clickY - circle.startY, 2));

        // Alert 'Hit' if the user clicked on an existing circle
        if (distance <= circle.radius) {
            alert('Hit');
            return;
        }
    }
    alert('Miss');
}