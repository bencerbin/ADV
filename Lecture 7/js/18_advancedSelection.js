// advancedSelection.js
class AdvancedSelectionChart {
    constructor(containerId) {
        this.containerId = containerId;
        this.width = 800;
        this.height = 400;
        this.margin = { top: 20, right: 20, bottom: 30, left: 40 };
        this.svg = null;
        this.data = [];
        this.colors = d3.scaleOrdinal(d3.schemeCategory10);
        
        // Initialize the chart
        this.initializeChart();
    }

    // Initialize the SVG container
    initializeChart() {
        // Set the title
        d3.select('#example-title').text('Advanced Selection Techniques');
        
        // Create SVG container
        this.svg = d3.select(`#${this.containerId}`)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);
        
        // Add controls
        this.addControls();
    }

    // Add control buttons
    addControls() {
        const controls = d3.select('#controls');
        
        controls.append('button')
            .text('Add Data')
            .on('click', () => this.addDataPoint());
        
        controls.append('button')
            .text('Remove Data')
            .on('click', () => this.removeDataPoint());
        
        controls.append('button')
            .text('Update Data')
            .on('click', () => this.updateData());
    }

    // Generate random data point
    generateDataPoint() {
        return {
            x: Math.random() * (this.width - this.margin.left - this.margin.right),
            y: Math.random() * (this.height - this.margin.top - this.margin.bottom),
            radius: Math.random() * 20 + 5,
            category: Math.floor(Math.random() * 5)
        };
    }

    // Add new data point
    addDataPoint() {
        this.data.push(this.generateDataPoint());
        this.updateVisualization();
    }

    // Remove last data point
    removeDataPoint() {
        this.data.pop();
        this.updateVisualization();
    }

    // Update existing data
    updateData() {
        this.data = this.data.map(d => ({
            ...d,
            radius: Math.random() * 20 + 5
        }));
        this.updateVisualization();
    }

    // Update the visualization with current data
    updateVisualization() {
        // Advanced selection pattern using join()
        const circles = this.svg.selectAll('circle')
            .data(this.data)
            .join(
                // Enter selection - what happens with new data points
                enter => enter.append('circle')
                    .attr('cx', d => d.x)
                    .attr('cy', d => d.y)
                    .attr('r', 0)
                    .attr('fill', d => this.colors(d.category))
                    .call(enter => enter.transition()
                        .duration(750)
                        .attr('r', d => d.radius)),
                
                // Update selection - what happens with existing data points
                update => update
                    .call(update => update.transition()
                        .duration(750)
                        .attr('cx', d => d.x)
                        .attr('cy', d => d.y)
                        .attr('r', d => d.radius)),
                
                // Exit selection - what happens with removed data points
                exit => exit
                    .call(exit => exit.transition()
                        .duration(750)
                        .attr('r', 0)
                        .remove())
            );

        // Add hover interactions
        circles
            .on('mouseover', (event, d) => this.handleMouseOver(event, d))
            .on('mouseout', (event, d) => this.handleMouseOut(event, d));
    }

    // Handle mouse over event
    handleMouseOver(event, d) {
        const circle = d3.select(event.currentTarget);
        
        // Highlight the circle
        circle.transition()
            .duration(200)
            .attr('stroke', '#333')
            .attr('stroke-width', 2);
        
        // Show tooltip
        this.svg.append('text')
            .attr('class', 'tooltip')
            .attr('x', d.x + 10)
            .attr('y', d.y - 10)
            .text(`r: ${d.radius.toFixed(1)}, cat: ${d.category}`);
    }

    // Handle mouse out event
    handleMouseOut(event, d) {
        const circle = d3.select(event.currentTarget);
        
        // Remove highlight
        circle.transition()
            .duration(200)
            .attr('stroke-width', 0);
        
        // Remove tooltip
        this.svg.selectAll('.tooltip').remove();
    }
}

// Initialize the chart when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const chart = new AdvancedSelectionChart('visualization');
    
    // Add initial data points
    for (let i = 0; i < 5; i++) {
        chart.addDataPoint();
    }
});