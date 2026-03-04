// Register a component to handle marker detection events
AFRAME.registerComponent('ar-marker', {
    init: function() {
        // Reference to the info div
        const infoEl = document.querySelector('.ar-info');

        // Handle marker found event
        this.el.addEventListener('markerFound', () => {
            if (infoEl) {
                infoEl.textContent = 'Marker detected!';
                infoEl.style.backgroundColor = 'rgba(0, 255, 0, 0.7)';
            }
        });

        // Handle marker lost event
        this.el.addEventListener('markerLost', () => {
            if (infoEl) {
                infoEl.textContent = 'Point camera at Hiro marker';
                infoEl.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            }
        });

        // Add click event listener to the red cube
        const cube = this.el.querySelector('a-box[material="color: red;"]');
        if (cube) {
            cube.addEventListener('click', function() {
                // Change color on click
                const currentColor = this.getAttribute('material').color;
                const newColor = currentColor === 'red' ? 'blue' : 'red';
                this.setAttribute('material', 'color', newColor);
            });
        }
    }
});