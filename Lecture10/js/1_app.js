// Register the data-plot component
AFRAME.registerComponent('data-plot', {
    schema: {
        dataPoints: {
            type: 'array',
            parse: function(value) {
                // Handle both string and array inputs
                return typeof value === 'string' ? JSON.parse(value) : value;
            },
            stringify: function(value) {
                return JSON.stringify(value);
            }
        },
        width: {type: 'number', default: 10},
        height: {type: 'number', default: 10},
        depth: {type: 'number', default: 10},
        colorScheme: {type: 'string', default: 'rainbow'}
    },
    
    init: function() {
        // Generate initial data if none provided
        if (!this.data.dataPoints) {
            this.data.dataPoints = generateRandomData(500);
        }
        this.createPlot();
    },

    update: function(oldData) {
        // Only recreate the plot if the data points have changed
        if (this.data.dataPoints !== oldData.dataPoints) {
            this.createPlot();
        }
    },
    
    createPlot: function() {
        // Clear existing visualization
        while (this.el.firstChild) {
            this.el.removeChild(this.el.firstChild);
        }

        const data = this.data.dataPoints;
        const width = this.data.width;
        const height = this.data.height;
        const depth = this.data.depth;
        
        // Ensure we have data to visualize
        if (!data || !Array.isArray(data) || data.length === 0) {
            console.warn('No data points to visualize');
            return;
        }
        
        // Normalize data to plot dimensions
        const maxVal = Math.max(...data.map(p => Math.max(p.x, p.y, p.z)));
        
        data.forEach(point => {
            // Create a sphere for each data point
            const sphere = document.createElement('a-sphere');
            
            // Position based on data values
            sphere.setAttribute('position', {
                x: (point.x / (maxVal / 16)) * width - width/2,
                y: (point.y / (maxVal / 16)) * height - height/2,
                z: (point.z / (maxVal / 16)) * depth - depth/2
            });
            
            // Size based on value
            sphere.setAttribute('radius', point.value * 0.1);
            
            // Color based on value
            const hue = (point.value / 100) * 360;
            sphere.setAttribute('color', `hsl(${hue}, 100%, 50%)`);
            
            // Add hover animation
            sphere.setAttribute('animation__scale', {
                property: 'scale',
                to: '1.5 1.5 1.5',
                dur: 200,
                startEvents: 'mouseenter'
            });
            
            sphere.setAttribute('animation__return', {
                property: 'scale',
                to: '1 1 1',
                dur: 200,
                startEvents: 'mouseleave'
            });
            
            // Add to scene
            this.el.appendChild(sphere);
        });
    }
});

// Helper function to generate random data points
function generateRandomData(count) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
            z: Math.random() * 100,
            value: Math.random() * 100
        });
    }
    return data;
}

// Function to generate new data and update visualization
function generateNewData() {
    const newData = generateRandomData(50);
    const visualization = document.querySelector('#visualization');
    
    // Update the component's data
    visualization.setAttribute('data-plot', {
        dataPoints: newData,
        width: 5,
        height: 5,
        depth: 5
    });
}

// Toggle rotation of the visualization
function toggleRotation() {
    const visualization = document.querySelector('#visualization');
    const currentRotation = visualization.getAttribute('animation__rotate');
    
    if (currentRotation) {
        visualization.removeAttribute('animation__rotate');
    } else {
        visualization.setAttribute('animation__rotate', {
            property: 'rotation',
            to: '0 360 0',
            dur: 20000,
            easing: 'linear',
            loop: true
        });
    }
}

// Initialize the visualization with some data when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const visualization = document.querySelector('#visualization');
    visualization.setAttribute('data-plot', {
        dataPoints: generateRandomData(50),
        width: 5,
        height: 5,
        depth: 5
    });
});