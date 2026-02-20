// stackLayoutComponent.js
class StackLayoutChart {
    constructor(config = {}) {
        // Default configuration
        this.config = {
            container: '#visualization',
            width: 800,
            height: 500,
            margin: { top: 40, right: 40, bottom: 60, left: 60 },
            duration: 1000,
            ...config
        };

        // Initialize scales and other properties
        this.initializeProperties();
        
        // Create the SVG container
        this.createSVG();
        
        // Initialize stack generator
        this.stack = d3.stack();
    }

    // Initialize scales and other properties
    initializeProperties() {
        // Calculate dimensions
        this.width = this.config.width - this.config.margin.left - this.config.margin.right;
        this.height = this.config.height - this.config.margin.top - this.config.margin.bottom;

        // Initialize scales
        this.xScale = d3.scaleTime().range([0, this.width]);
        this.yScale = d3.scaleLinear().range([this.height, 0]);
        this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        // Initialize area generator
        this.area = d3.area()
            .x(d => this.xScale(d.data.date))
            .y0(d => this.yScale(d[0]))
            .y1(d => this.yScale(d[1]));
    }

    // Create SVG container
    createSVG() {
        this.svg = d3.select(this.config.container)
            .append('svg')
            .attr('width', this.config.width)
            .attr('height', this.config.height);

        this.g = this.svg.append('g')
            .attr('transform', `translate(${this.config.margin.left},${this.config.margin.top})`);

        // Add axes groups
        this.xAxisG = this.g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${this.height})`);

        this.yAxisG = this.g.append('g')
            .attr('class', 'y-axis');
    }

    // Update data and redraw chart
    update(data, keys) {
        // Update stack generator
        this.stack.keys(keys);

        // Generate stacked data
        const stackedData = this.stack(data);

        // Update scales
        this.xScale.domain(d3.extent(data, d => d.date));
        this.yScale.domain([
            0,
            d3.max(stackedData, d => d3.max(d, d => d[1]))
        ]);

        // Update axes
        this.updateAxes();

        // Join data with paths
        const layers = this.g.selectAll('.layer')
            .data(stackedData);

        // Exit
        layers.exit().remove();

        // Enter
        const layersEnter = layers.enter()
            .append('path')
            .attr('class', 'layer');

        // Update + Enter
        layers.merge(layersEnter)
            .transition()
            .duration(this.config.duration)
            .attr('d', this.area)
            .attr('fill', (d, i) => this.colorScale(i));

        // Add legend
        this.updateLegend(keys);
    }

    // Update axes
    updateAxes() {
        // Create axis generators
        const xAxis = d3.axisBottom(this.xScale)
            .ticks(5)
            .tickSizeOuter(0);

        const yAxis = d3.axisLeft(this.yScale)
            .ticks(5)
            .tickSizeOuter(0);

        // Update axes
        this.xAxisG.transition()
            .duration(this.config.duration)
            .call(xAxis);

        this.yAxisG.transition()
            .duration(this.config.duration)
            .call(yAxis);
    }

    // Update legend
    updateLegend(keys) {
        // Remove existing legend
        this.g.selectAll('.legend').remove();

        // Create legend group
        const legend = this.g.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${this.width - 100}, 0)`);

        // Add legend items
        const legendItems = legend.selectAll('.legend-item')
            .data(keys)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(0, ${i * 20})`);

        // Add colored rectangles
        legendItems.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', (d, i) => this.colorScale(i));

        // Add text labels
        legendItems.append('text')
            .attr('x', 20)
            .attr('y', 12)
            .text(d => d);
    }
}

// Usage example:
document.addEventListener('DOMContentLoaded', () => {
    // Create sample data
    const data = [
        { date: new Date('2023-01-01'), revenue: 100, profit: 30, cost: 70 },
        { date: new Date('2023-02-01'), revenue: 120, profit: 40, cost: 80 },
        { date: new Date('2023-03-01'), revenue: 140, profit: 50, cost: 90 },
        { date: new Date('2023-04-01'), revenue: 160, profit: 60, cost: 100 },
        { date: new Date('2023-05-01'), revenue: 180, profit: 70, cost: 110 }
    ];

    // Create chart instance
    const chart = new StackLayoutChart({
        container: '#visualization',
        width: 800,
        height: 500
    });

    // Update chart with data
    chart.update(data, ['revenue', 'profit', 'cost']);
});