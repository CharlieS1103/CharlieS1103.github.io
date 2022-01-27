function snakeGame() {
    const width = 20;
    const height = 20;
    const grid = new Array(width * height).fill(0);
    const snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
    ];
    const food = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
    };
    grid[food.y * width + food.x] = 2;
    snake.forEach(segment => {
        grid[segment.y * width + segment.x] = 1;
    });
    let direction = "right";
    let newDirection = direction;
    let score = 0;
    let speed = 100;
    let interval = null;
    function draw() {
        process.stdout.write("\x1Bc");
        grid.forEach((value, index) => {
            if (value === 0) {
                process.stdout.write(" ");
            } else if (value === 1) {
                process.stdout.write("\u001b[48;5;220m\u2588\u001b[0m");
            } else if (value === 2) {
                process.stdout.write("\u001b[48;5;220m\u2588\u001b[0m");
            }
            if ((index + 1) % width === 0) {
                process.stdout.write("\n");
            }
        });
        process.stdout.write("\n");
        process.stdout.write(`Score: ${score}`);
    }
    function update() {
        const head = { ...snake[0] };
        if (newDirection !== direction) {
            direction = newDirection;
        }
        if (direction === "right") {
            head.x++;
        } else if (direction === "left") {
            head.x--;
        } else if (direction === "up") {
            head.y--;
        } else if (direction === "down") {
            head.y++;
        }
        snake.unshift(head);
        if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
            clearInterval(interval);
            return;
        }
        const tail = snake.pop();
        if (grid[tail.y * width + tail.x] === 2) {
            score++;
            speed -= 5;
            grid[tail.y * width + tail.x] = 0;
            food.x = Math.floor(Math.random() * width);
            food.y = Math.floor(Math.random() * height);
            grid[food.y * width + food.x] = 2;
        } else {
            grid[tail.y * width + tail.x] = 0;
        }
        grid[head.y * width + head.x] = 1;
        if (head.x === food.x && head.y === food.y) {
            score++;
            speed -= 5;
            grid[food.y * width + food.x] = 0;
            food.x = Math.floor(Math.random() * width);
            food.y = Math.floor(Math.random() * height);
            grid[food.y * width + food.x] = 2;
        }
        draw();
    }
    interval = setInterval(update, speed);
    process.stdin.on("keypress", (ch, key) => {
        if (key.name === "right") {
            newDirection = "right";
        } else if (key.name === "left") {
            newDirection = "left";
        } else if (key.name === "up") {
            newDirection = "up";
        } else if (key.name === "down") {
            newDirection = "down";
        }
    });
}
