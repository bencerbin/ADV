// performance-viz.js
class PerformanceVisualizer {
    constructor() {
        // Set dimensions
        this.width = document.querySelector('#visualization').clientWidth;
        this.height = document.querySelector('#visualization').clientHeight;
        this.margin = { top: 40, right: 40, bottom: 60, left: 60 };
        this.animationDuration = 750;

        // Initialize the visualization
        this.init();
    }

    init() {
        // Update title
        d3.select('#example-title').text('Interactive Data Points');

        // Clear any existing content
        d3.select('#visualization').html('');

        // Create SVG
        this.svg = d3.select('#visualization')
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        // Calculate inner dimensions
        this.innerWidth = this.width - this.margin.left - this.margin.right;
        this.innerHeight = this.height - this.margin.top - this.margin.bottom;

        // Create main group element
        this.g = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        // Initialize scales
        this.xScale = d3.scaleLinear()
            .range([0, this.innerWidth]);

        this.yScale = d3.scaleLinear()
            .range([this.innerHeight, 0]);

        // Add axes groups
        this.xAxisG = this.g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${this.innerHeight})`);

        this.yAxisG = this.g.append('g')
            .attr('class', 'y-axis');

        // Add axes labels
        this.g.append('text')
            .attr('class', 'x-axis-label')
            .attr('text-anchor', 'middle')
            .attr('x', this.innerWidth / 2)
            .attr('y', this.innerHeight + 40)
            .text('X Value');

        this.g.append('text')
            .attr('class', 'y-axis-label')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .attr('x', -this.innerHeight / 2)
            .attr('y', -40)
            .text('Y Value');

        // Add controls
        this.addControls();

        // Generate initial data
        this.generateData();
    }

    addControls() {
        const controls = d3.select('#controls');
        controls.html(''); // Clear existing controls

        controls.append('button')
            .text('Generate New Data')
            .on('click', () => this.generateData());

        controls.append('button')
            .text('Add Points')
            .on('click', () => this.addPoints());

        controls.append('button')
            .text('Remove Points')
            .on('click', () => this.removePoints());
    }

    generateData(count = 50) {
        this.data = Array.from({ length: count }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            radius: Math.random() * 10 + 5
        }));

        this.updateVisualization();
    }

    addPoints(count = 10) {
        const newPoints = Array.from({ length: count }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            radius: Math.random() * 10 + 5
        }));
        this.data = [...this.data, ...newPoints];
        this.updateVisualization();
    }

    removePoints(count = 10) {
        this.data = this.data.slice(0, Math.max(0, this.data.length - count));
        this.updateVisualization();
    }

    updateVisualization() {
        // Update scales
        this.xScale.domain([0, d3.max(this.data, d => d.x)]);
        this.yScale.domain([0, d3.max(this.data, d => d.y)]);

        // Update axes with transition
        const xAxis = d3.axisBottom(this.xScale);
        const yAxis = d3.axisLeft(this.yScale);

        this.xAxisG.transition()
            .duration(this.animationDuration)
            .call(xAxis);

        this.yAxisG.transition()
            .duration(this.animationDuration)
            .call(yAxis);

        // Optimize rendering using requestAnimationFrame
        requestAnimationFrame(() => {
            // Update points with enter/update/exit pattern
            const circles = this.g.selectAll('circle')
                .data(this.data);

            // Enter
            const circlesEnter = circles.enter()
                .append('circle')
                .attr('r', 0)
                .attr('fill', 'steelblue')
                .attr('opacity', 0.6);

            // Update + Enter
            circles.merge(circlesEnter)
                .transition()
                .duration(this.animationDuration)
                .attr('cx', d => this.xScale(d.x))
                .attr('cy', d => this.yScale(d.y))
                .attr('r', d => d.radius);

            // Exit
            circles.exit()
                .transition()
                .duration(this.animationDuration)
                .attr('r', 0)
                .remove();

            // Add tooltips
            this.g.selectAll('circle')
                .on('mouseover', (event, d) => {
                    d3.select(event.currentTarget)
                        .transition()
                        .duration(200)
                        .attr('fill', 'orange')
                        .attr('r', d.radius * 1.5);
                })
                .on('mouseout', (event, d) => {
                    d3.select(event.currentTarget)
                        .transition()
                        .duration(200)
                        .attr('fill', 'steelblue')
                        .attr('r', d.radius);
                });
        });
    }
}

// Initialize the visualization when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    const viz = new PerformanceVisualizer();
});