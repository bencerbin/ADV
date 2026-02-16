// Set the example title
document.getElementById('example-title').textContent = 'Overview + Detail Pattern';

class OverviewDetailView {
    constructor(container) {
        // Initialize dimensions and margins
        this.margin = {top: 20, right: 20, bottom: 30, left: 40};
        this.width = 800 - this.margin.left - this.margin.right;
        this.height = {
            overview: 100 - this.margin.top - this.margin.bottom,
            detail: 400 - this.margin.top - this.margin.bottom
        };

        this.container = d3.select(container);
        this.generateData();
        this.setupScales();
        this.setupContainers();
        this.setupBrush();
        this.drawInitialViews();
    }

    generateData() {
        // Generate sample data for demonstration
        this.data = Array.from({length: 100}, (_, i) => ({
            x: i,
            y: Math.sin(i * 0.1) * 10 + Math.random() * 5
        }));
    }

    setupScales() {
        // Set up scales for both views
        this.xScale = {
            overview: d3.scaleLinear()
                .domain([0, this.data.length - 1])
                .range([0, this.width]),
            detail: d3.scaleLinear()
                .domain([0, this.data.length - 1])
                .range([0, this.width])
        };

        this.yScale = {
            overview: d3.scaleLinear()
                .domain(d3.extent(this.data, d => d.y))
                .range([this.height.overview, 0]),
            detail: d3.scaleLinear()
                .domain(d3.extent(this.data, d => d.y))
                .range([this.height.detail, 0])
        };
    }

    setupContainers() {
        // Create SVG containers for both views
        this.overviewSvg = this.container.append('svg')
            .attr('class', 'overview')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height.overview + this.margin.top + this.margin.bottom)
            .append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        this.detailSvg = this.container.append('svg')
            .attr('class', 'detail')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height.detail + this.margin.top + this.margin.bottom)
            .append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
    }

    setupBrush() {
        // Create brush for interaction
        this.brush = d3.brushX()
            .extent([[0, 0], [this.width, this.height.overview]])
            .on('brush', (event) => this.brushed(event));

        this.overviewSvg.append('g')
            .attr('class', 'brush')
            .call(this.brush)
            .call(this.brush.move, [0, this.width / 3]); // Initial brush selection
    }

    drawInitialViews() {
        // Draw the overview line
        const overviewLine = d3.line()
            .x(d => this.xScale.overview(d.x))
            .y(d => this.yScale.overview(d.y));

        this.overviewSvg.append('path')
            .datum(this.data)
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 1.5)
            .attr('d', overviewLine);

        // Add axes to detail view
        this.detailSvg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${this.height.detail})`)
            .call(d3.axisBottom(this.xScale.detail));

        this.detailSvg.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(this.yScale.detail));

        // Initial detail view
        this.updateDetailView([0, this.width / 3]);
    }

    brushed(event) {
        if (!event.selection) return;
        this.updateDetailView(event.selection);
    }

    updateDetailView(selection) {
        // Convert brush selection to data domain
        const [x0, x1] = selection.map(this.xScale.overview.invert);
        
        // Update detail view scales
        this.xScale.detail.domain([x0, x1]);

        // Update detail view
        const detailLine = d3.line()
            .x(d => this.xScale.detail(d.x))
            .y(d => this.yScale.detail(d.y));

        // Remove existing detail line
        this.detailSvg.selectAll('.detail-line').remove();

        // Draw new detail line
        this.detailSvg.append('path')
            .datum(this.data.filter(d => d.x >= x0 && d.x <= x1))
            .attr('class', 'detail-line')
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 2)
            .attr('d', detailLine);

        // Update x-axis
        this.detailSvg.select('.x-axis')
            .call(d3.axisBottom(this.xScale.detail));
    }
}

// Initialize the visualization when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const viz = new OverviewDetailView('#visualization');
});