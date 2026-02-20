// responsiveChart.js
class ResponsiveScatterPlot {
    constructor() {
        // Set the title in the HTML
        d3.select('#example-title').text('Responsive Scatter Plot');
        
        // Get the visualization container
        this.container = d3.select('#visualization');
        
        // Clear any existing content
        this.container.html('');
        
        // Set initial dimensions
        this.margin = { top: 40, right: 40, bottom: 60, left: 60 };
        this.width = this.container.node().getBoundingClientRect().width;
        this.height = 500; // Fixed height as defined in CSS
        
        // Initialize the chart
        this.initializeChart();
        
        // Generate and set data
        this.generateData();
        
        // Initial render
        this.render();
        
        // Add window resize listener
        window.addEventListener('resize', () => {
            this.updateDimensions();
            this.render();
        });
    }

    initializeChart() {
        // Create SVG
        this.svg = this.container.append('svg')
            .attr('width', this.width)
            .attr('height', this.height);
            
        // Create chart group
        this.chartGroup = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
            
        // Initialize scales
        this.xScale = d3.scaleLinear();
        this.yScale = d3.scaleLinear();
        
        // Initialize axes
        this.xAxis = this.chartGroup.append('g')
            .attr('class', 'x-axis');
            
        this.yAxis = this.chartGroup.append('g')
            .attr('class', 'y-axis');
            
        // Add axis labels
        this.xAxisLabel = this.chartGroup.append('text')
            .attr('class', 'x-axis-label')
            .style('text-anchor', 'middle')
            .text('X Value');
            
        this.yAxisLabel = this.chartGroup.append('text')
            .attr('class', 'y-axis-label')
            .style('text-anchor', 'middle')
            .text('Y Value');
    }

    generateData() {
        // Generate random data points
        this.data = Array.from({ length: 50 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100
        }));
    }

    updateDimensions() {
        // Update width based on container size
        this.width = this.container.node().getBoundingClientRect().width;
        
        // Update SVG width
        this.svg.attr('width', this.width);
        
        // Update scales
        this.updateScales();
    }

    updateScales() {
        // Calculate dimensions
        this.chartWidth = this.width - this.margin.left - this.margin.right;
        this.chartHeight = this.height - this.margin.top - this.margin.bottom;
        
        // Update x scale
        this.xScale
            .domain([0, 100])
            .range([0, this.chartWidth]);
            
        // Update y scale
        this.yScale
            .domain([0, 100])
            .range([this.chartHeight, 0]);
    }

    render() {
        // Update scales
        this.updateScales();
        
        // Update axes
        this.xAxis
            .attr('transform', `translate(0,${this.chartHeight})`)
            .call(d3.axisBottom(this.xScale));
            
        this.yAxis
            .call(d3.axisLeft(this.yScale));
            
        // Update axis labels
        this.xAxisLabel
            .attr('transform', `translate(${this.chartWidth/2},${this.chartHeight + 40})`)
            
        this.yAxisLabel
            .attr('transform', `translate(-40,${this.chartHeight/2}) rotate(-90)`);
            
        // Update data points
        const circles = this.chartGroup.selectAll('circle')
            .data(this.data);
            
        // Enter new circles
        circles.enter()
            .append('circle')
            .merge(circles)
            .attr('r', 5)
            .attr('cx', d => this.xScale(d.x))
            .attr('cy', d => this.yScale(d.y))
            .attr('fill', '#007bff')
            .attr('opacity', 0.6);
            
        // Remove old circles
        circles.exit().remove();
    }
}

// Create controls
const controlsDiv = d3.select('#controls');

// Add regenerate data button
controlsDiv.append('button')
    .text('Regenerate Data')
    .on('click', () => {
        // Create new visualization when button is clicked
        new ResponsiveScatterPlot();
    });

// Initialize the visualization
new ResponsiveScatterPlot();