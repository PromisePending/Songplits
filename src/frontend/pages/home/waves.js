function generateLandingPageBGWaves() {
    // gets the canvas elements
    const wave1 = document.getElementById('LS-BWave1');
    const wave2 = document.getElementById('LS-BWave2');

    // gets the canvas context
    const ctx1 = wave1.getContext('2d');
    const ctx2 = wave2.getContext('2d');

    var wave1gradient = ctx1.createLinearGradient(0, 0, 0, wave1.height);
    var wave2gradient = ctx2.createLinearGradient(0, 0, 0, wave2.height);

    // sets the canvas size
    function setCanvasSize() {
        wave1.width = window.innerWidth;
        wave1.height = (window.innerHeight / 2.5) * 2;
        wave2.width = window.innerWidth;
        wave2.height = window.innerHeight / 2.5;

        wave1gradient = ctx1.createLinearGradient(0, 0, ...rotateCoords(wave1.width, wave1.height, 45));
        wave1gradient.addColorStop(0, '#631635');
        wave1gradient.addColorStop(1, '#4b086c');

        wave2gradient = ctx2.createLinearGradient(0, 0, ...rotateCoords(wave1.width, wave1.height, 45));
        wave2gradient.addColorStop(0, '#94251b');
        wave2gradient.addColorStop(1, '#650c86');
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    function stopUpdatingSize() {
        window.removeEventListener('resize', setCanvasSize);
    }

    // draws a sine wave then fills the wave with a gradient
    function drawWave(ctx, waveHeight, waveSpeed, waveColor, time) {
        ctx.beginPath();
        ctx.moveTo(0, waveHeight);
        var lastHeight = 0;
        for (let x = 0; x < ctx.canvas.width; x++) {
            lastHeight = (waveHeight + Math.sin((x + time) / waveSpeed) * waveHeight);
            ctx.lineTo(x, lastHeight);
        }
        ctx.lineTo(ctx.canvas.width, lastHeight);
        ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
        ctx.lineTo(0, ctx.canvas.height);
        ctx.closePath();
        ctx.fillStyle = waveColor;
        ctx.fill();
    }

    function rotateCoords(x, y, angle) {
        return [
            x * Math.cos(angle * 0.0174532925), y * Math.sin(angle * 0.0174532925)
        ];
    }

    var timeOffset = 0;

    // draws the waves
    function drawWaves() {
        ctx1.clearRect(0, 0, wave1.width, wave1.height);
        ctx2.clearRect(0, 0, wave2.width, wave2.height);
        drawWave(ctx1, wave1.height / 3.75, 300, wave1gradient, 900 + (timeOffset / 3));
        drawWave(ctx2, wave2.height / 3, 350, wave2gradient, -300 + timeOffset);
    }

    var isAnimating = true;
    var animationInterval;

    function stopAnimating() {
        isAnimating = false;
        if (animationInterval) {
            clearInterval(animationInterval);
        }
    }

    function startAnimating() {
        isAnimating = true;
        animationInterval = setInterval(() => {
            if (isAnimating) {
                timeOffset += 3;
                requestAnimationFrame(drawWaves);
            }
        }, 1000 / 15);
    }

    return {
        stopAnimating,
        startAnimating,
        stopUpdatingSize,
        isAnimating,
    };
}