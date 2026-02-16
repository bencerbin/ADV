// Event handling demonstration with D3.js
document.getElementById('example-title').textContent = 'Event Handling System';

// Create our event system
class EventSystem {
    constructor() {
        this.listeners = new Map();
    }

    on(eventName, callback) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, new Set());
        }
        this.listeners.get(eventName).add(callback);
    }

    off(eventName, callback) {
        const callbacks = this.listeners.get(eventName);
        if (callbacks) {
            callbacks.delete(callback);
        }
    }

    emit(eventName, data) {
        const callbacks = this.listeners.get(eventName);
        if (callbacks) {
            callbacks.forEach(callback => callback(data));
        }
    }
}

// Interactive visualization class
class InteractiveVisualization extends EventSystem {
    constructor(containerId) {
        super();
        this.container = d3.select(`#${containerId}`);
        this.setup();
        this.createVisualization();
        this.setupEventListeners();
    }

    setup() {
        // Clear previous content
        this.container.selectAll('*').remove();

        // Create SVG
        this.svg = this.container.append('svg')
            .attr('width', '100%')
            .attr('height', '100%');

        // Create tooltip
        this.tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        // Add event counter display
        this.eventCounter = this.container.append('div')
            .style('position', 'absolute')
            .style('top', '10px')
            .style('right', '10px')
            .style('padding', '10px')
            .style('background', '#f0f0f0')
            .style('border-radius', '4px');
    }

    createVisualization() {
        // Generate some random data
        this.data = Array.from({length: 5}, (_, i) => ({
            id: i,
            x: Math.random() * 400 + 50,
            y: Math.random() * 400 + 50,
            radius: Math.random() * 20 + 20,
            color: d3.schemeCategory10[i]
        }));

        // Create interactive circles
        this.circles = this.svg.selectAll('circle')
            .data(this.data)
            .enter()
            .append('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', d => d.radius)
            .attr('fill', d => d.color)
            .style('cursor', 'pointer');
    }

    setupEventListeners() {
        // Initialize event counters
        this.eventCounts = {
            click: 0,
            mouseover: 0,
            mouseout: 0
        };

        // Update counter display
        this.updateEventCounter();

        // Add event listeners to circles
        this.circles
            .on('click', (event, d) => {
                this.eventCounts.click++;
                this.updateEventCounter();
                this.emit('elementClicked', d);
                
                // Animate the clicked circle
                const circle = d3.select(event.currentTarget);
                circle.transition()
                    .duration(200)
                    .attr('r', d.radius * 1.2)
                    .transition()
                    .duration(200)
                    .attr('r', d.radius);
            })
            .on('mouseover', (event, d) => {
                this.eventCounts.mouseover++;
                this.updateEventCounter();
                this.emit('elementHover', d);
                
                // Show tooltip
                this.tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
                this.tooltip.html(`Circle ${d.id}<br/>Size: ${d.radius.toFixed(1)}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', (event, d) => {
                this.eventCounts.mouseout++;
                this.updateEventCounter();
                this.emit('elementLeave', d);
                
                // Hide tooltip
                this.tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });
    }

    updateEventCounter() {
        this.eventCounter.html(`
            Event Counts:<br/>
            Clicks: ${this.eventCounts.click}<br/>
            Mouseover: ${this.eventCounts.mouseover}<br/>
            Mouseout: ${this.eventCounts.mouseout}
        `);
    }
}

// Create controls
const controlsDiv = document.getElementById('controls');
controlsDiv.innerHTML = `
    <button id="resetBtn">Reset Counters</button>
    <button id="addCircleBtn">Add Circle</button>
    <button id="removeCircleBtn">Remove Circle</button>
`;

// Initialize visualization
const vis = new InteractiveVisualization('visualization');

// Add button event listeners
document.getElementById('resetBtn').addEventListener('click', () => {
    vis.eventCounts = {click: 0, mouseover: 0, mouseout: 0};
    vis.updateEventCounter();
});

document.getElementById('addCircleBtn').addEventListener('click', () => {
    const newData = {
        id: vis.data.length,
        x: Math.random() * 400 + 50,
        y: Math.random() * 400 + 50,
        radius: Math.random() * 20 + 20,
        color: d3.schemeCategory10[vis.data.length % 10]
    };
    vis.data.push(newData);
    
    vis.circles = vis.svg.selectAll('circle')
        .data(vis.data)
        .join('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => d.radius)
        .attr('fill', d => d.color)
        .style('cursor', 'pointer');
    
    vis.setupEventListeners();
});

document.getElementById('removeCircleBtn').addEventListener('click', () => {
    if (vis.data.length > 1) {
        vis.data.pop();
        vis.circles = vis.svg.selectAll('circle')
            .data(vis.data)
            .join('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', d => d.radius)
            .attr('fill', d => d.color)
            .style('cursor', 'pointer');
        
        vis.setupEventListeners();
    }
});

// Add some event listeners to demonstrate the event system
vis.on('elementClicked', (data) => {
    console.log('Element clicked:', data);
});

vis.on('elementHover', (data) => {
    console.log('Element hover:', data);
});

vis.on('elementLeave', (data) => {
    console.log('Element leave:', data);
});