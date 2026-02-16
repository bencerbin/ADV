// example.js
document.addEventListener('DOMContentLoaded', () => {
    // Set the title of the example
    document.getElementById('example-title').textContent = 'Draggable Circles';

    class DraggableVisualization {
        constructor(containerId) {
            // Set dimensions
            this.margin = { top: 20, right: 20, bottom: 20, left: 20 };
            this.width = 800 - this.margin.left - this.margin.right;
            this.height = 500 - this.margin.top - this.margin.bottom;

            // Initialize data
            this.data = this.generateRandomData(5);

            // Create SVG container
            this.svg = d3.select(containerId)
                .append('svg')
                .attr('width', this.width + this.margin.left + this.margin.right)
                .attr('height', this.height + this.margin.top + this.margin.bottom)
                .append('g')
                .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

            // Initialize drag behavior
            this.drag = d3.drag()
                .on('start', (event, d) => this.dragStarted(event, d))
                .on('drag', (event, d) => this.dragged(event, d))
                .on('end', (event, d) => this.dragEnded(event, d));

            // Setup controls and initial visualization
            this.setupControls();
            this.updateVisualization();
        }

        generateRandomData(count) {
            return Array.from({ length: count }, () => ({
                id: Math.random().toString(36).substr(2, 9),
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                color: d3.rgb(
                    Math.random() * 255,
                    Math.random() * 255,
                    Math.random() * 255
                ).toString()
            }));
        }

        setupControls() {
            const controls = d3.select('#controls');
            
            // Reset button
            controls.append('button')
                .text('Reset Circles')
                .on('click', () => {
                    this.data = this.generateRandomData(5);
                    this.updateVisualization();
                });

            // Add circle button
            controls.append('button')
                .text('Add Circle')
                .on('click', () => {
                    this.data.push({
                        id: Math.random().toString(36).substr(2, 9),
                        x: this.width / 2,
                        y: this.height / 2,
                        color: d3.rgb(
                            Math.random() * 255,
                            Math.random() * 255,
                            Math.random() * 255
                        ).toString()
                    });
                    this.updateVisualization();
                });
        }

        updateVisualization() {
            // Update circles
            const circles = this.svg.selectAll('circle')
                .data(this.data, d => d.id);

            // Remove old circles
            circles.exit().remove();

            // Add new circles
            const circlesEnter = circles.enter()
                .append('circle')
                .attr('r', 20)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .attr('fill', d => d.color)
                .style('cursor', 'move')
                .style('stroke', '#fff')
                .style('stroke-width', 2);

            // Update existing circles
            circles
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .attr('fill', d => d.color);

            // Apply drag behavior to all circles
            circles.merge(circlesEnter)
                .call(this.drag);
        }

        dragStarted(event, d) {
            d3.select(event.sourceEvent.target)
                .raise()
                .attr('r', 25)
                .style('stroke', '#000')
                .style('stroke-width', 3)
                .style('opacity', 0.8);
        }

        dragged(event, d) {
            // Calculate new position with bounds checking
            const newX = Math.max(20, Math.min(this.width - 20, event.x));
            const newY = Math.max(20, Math.min(this.height - 20, event.y));

            // Update data
            d.x = newX;
            d.y = newY;

            // Update circle position
            d3.select(event.sourceEvent.target)
                .attr('cx', newX)
                .attr('cy', newY);
        }

        dragEnded(event, d) {
            d3.select(event.sourceEvent.target)
                .attr('r', 20)
                .style('stroke', '#fff')
                .style('stroke-width', 2)
                .style('opacity', 1);
        }
    }

    // Initialize the visualization
    try {
        new DraggableVisualization('#visualization');
    } catch (error) {
        console.error('Error initializing visualization:', error);
        document.getElementById('visualization').innerHTML = 
            '<p style="color: red;">Error loading visualization. Please check the console for details.</p>';
    }
});