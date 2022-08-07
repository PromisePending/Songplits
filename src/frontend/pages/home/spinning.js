const canvas = document.getElementById('serverConnection-screen-content-canvas');
const ctx = canvas.getContext('2d');

function drawSpinningWheel() {
    var isAnimating = true;
    var lastFpsDraw = 0;
    const parameters = {
        diameter: (canvas.height / 3) * 2,
        thickness: canvas.width / 30,
        speed: 0.01,
        speedFactor: 0.005,
        color: '#fff',
        backgroundColor: ctx.createLinearGradient((canvas.height / 3), (canvas.height / 3), (canvas.height / 3) * 2, (canvas.height / 3) * 2),
        time: 0,
        completeness: 50,
    };

    parameters.backgroundColor.addColorStop(0, '#6bffda');
    parameters.backgroundColor.addColorStop(1, '#1e008a');

    window.addEventListener('resize', resize);

    function resize() {
        parameters.diameter = (canvas.height / 3) * 2;
        parameters.thickness = canvas.width / 30;    
    }

    function cleanUp() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawWheel({ diameter, thickness, speed, color, backgroundColor, time, completeness }) {
        // background of the wheel
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, diameter / 2, 0, 2 * Math.PI);
        ctx.lineWidth = thickness;
        ctx.strokeStyle = backgroundColor;
        ctx.stroke();
        // wheel itself
        ctx.beginPath();
        const head = -(Math.PI / 2) + (Math.PI * 2 * time) + ((completeness / 100) * Math.PI * 2);
        const tail = -(Math.PI / 2) + (Math.PI * 2 * time);
        ctx.arc(canvas.width / 2, canvas.height / 2, diameter / 2, tail, head, true);
        ctx.lineWidth = thickness;
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    function draw() {
        if (isAnimating) {
            var now = Date.now();
            if (now - lastFpsDraw > (1000 / 60)) {
                cleanUp();
                parameters.speed = (parameters.speedFactor / 2) + Math.sin(parameters.time * Math.PI) * (parameters.speedFactor * 2);
                parameters.time += parameters.speed;
                parameters.time %= 1;
                parameters.completeness = 5 + (Math.sin(parameters.time * Math.PI) * 90);
                drawWheel(parameters);
                lastFpsDraw = now;
            }
            requestAnimationFrame(draw);
        }
    }

    function stopAnimating() {
        isAnimating = false;
    }

    function startAnimating() {
        resize();
        isAnimating = true;
        draw();
    }

    return {
        stopAnimating,
        startAnimating,
        parameters
    }
}

const spinningWheel = drawSpinningWheel();