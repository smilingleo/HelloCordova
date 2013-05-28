var app = {
    // The watch id references the current `watchAcceleration`
    watchID: null,
    canvas: document.getElementById('canvas'),
    context: this.canvas.getContext('2d'),
    offscreenCanvas: document.createElement('canvas'),
    offscreenContext: this.offscreenCanvas.getContext('2d'),
    
    lastZ: 0,
    speedX: 0,
    speedY: 0, // initial speed.
    DAMPING: 3,
    BOUNCE: 0.5,
    RADIUS: 20,
    INTERVAL: 40,
    FPS: 1000 / this.INTERVAL,
    T: this.FPS / 1000,
    lastX: this.canvas.width / 2,
    lastY: this.canvas.height / 2,

    init: function() {
        alert("test");
        this.canvas.width = screen.width - 6;
        this.canvas.height = screen.height - 6;
        // for double buffering
        this.offscreenCanvas.width = this.canvas.width;
        this.offscreenCanvas.height = this.canvas.height;

        this.lastX = this.canvas.width / 2;
        this.lastY = this.canvas.height / 2;

        document.addEventListener("deviceready", this.onDeviceReady, false);

        this.drawBall(this.lastX, this.lastY);
    },


    // drawBall(lastX, lastY);

    // Wait for Cordova to load
    //

    drawBall: function(x, y) {
        // clear first
        this.offscreenContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // initialize the ball.
        this.offscreenContext.font = '48pt Helvetica';
        this.offscreenContext.strokeStyle = 'blue';
        this.offscreenContext.fillStyle = 'red';
        this.offscreenContext.lineWidth = '2'; // Line width set to 2 for text

        // draw the object
        this.offscreenContext.beginPath();

        if (x < this.RADIUS) { // hit the left border
            this.lastX = this.RADIUS;
            this.speedX = -this.speedX * this.BOUNCE;
        } else if (x + this.RADIUS > this.canvas.width) { // hit the right border
            this.lastX = this.canvas.width - this.RADIUS;
            this.speedX = -this.speedX * this.BOUNCE;
        } else {
            this.lastX = x;
        }

        if (y < this.RADIUS) { // hit the top
            this.lastY = this.RADIUS;
            this.speedY = -this.speedY * this.BOUNCE;
        } else if (y + this.RADIUS > this.canvas.height) { // hit the bottom
            this.lastY = this.canvas.height - this.RADIUS;
            this.speedY = -this.speedY * this.BOUNCE;
        } else {
            this.lastY = y;
        }

        this.offscreenContext.arc(this.lastX, this.lastY, this.RADIUS, 0, Math.PI * 2, true);
        this.offscreenContext.fill();

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(this.offscreenCanvas, 0, 0);
    },

    // Cordova is ready
    //

    onDeviceReady: function() {
        this.startWatch();
    },

    // Start watching the acceleration
    //

    startWatch: function() {

        // Update acceleration every 3 seconds
        var options = {
            frequency: FPS
        };

        this.watchID = navigator.accelerometer.watchAcceleration(this.onSuccess, this.onError, options);
    },

    // Stop watching the acceleration
    //

    stopWatch: function() {
        if (this.watchID) {
            navigator.accelerometer.clearWatch(this.watchID);
            this.watchID = null;
        }
    },

    // onSuccess: Get a snapshot of the current acceleration
    //

    onSuccess: function(acceleration) {
        var x = acceleration.x,
            y = acceleration.y,
            z = acceleration.z;
        // V = V0 + a*t
        this.speedX += x;
        this.speedY += y;

        // Distance = V * T
        this.lastX = this.lastX - this.speedX * this.T;
        this.lastY = this.lastY + this.speedY * this.T;

        this.drawBall(this.lastX, this.lastY);

        var element = document.getElementById('accelerometer');
        element.innerHTML = 'Acceleration X: ' + x + '<br />' +
            'Acceleration Y: ' + y + '<br />' +
            'Acceleration Z: ' + z + '<br />' +
            'speedX:         ' + this.speedX + '<br />' +
            'speedY:         ' + this.speedY + '<br />' +
            'Timestamp: ' + acceleration.timestamp + '<br />';
    },

    // onError: Failed to get the acceleration
    //

    onError: function() {
        alert('onError!');
    }

};