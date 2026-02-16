// Base class for visualization components
class VisualizationComponent {
    constructor(selector, options = {}) {
        this.container = d3.select(selector);
        this.options = Object.assign({}, this.defaults(), options);
        this.initialize();
    }

    defaults() {
        return {
            width: 600,
            height: 400,
            margin: { top: 20, right: 20, bottom: 30, left: 40 },
            transitionDuration: 750
        };
    }

    initialize() {
        // Clear any existing content
        this.container.selectAll("*").remove();

        // Create the SVG container
        this.svg = this.container
            .append('svg')
            .attr('width', this.options.width)
            .attr('height', this.options.height);

        // Create a group for the visualization with margins
        this.chart = this.svg.append('g')
            .attr('transform', `translate(${this.options.margin.left},${this.options.margin.top})`);

        // Calculate inner dimensions
        this.innerWidth = this.options.width - this.options.margin.left - this.options.margin.right;
        this.innerHeight = this.options.height - this.options.margin.top - this.options.margin.bottom;

        this.createScales();
        this.createAxes();
    }

    createScales() {
        // Override in child classes
    }

    createAxes() {
        // Override in child classes
    }

    update(data) {
        // Override in child classes
    }
}

// Example implementation of a bar chart component
class BarChartComponent extends VisualizationComponent {
    createScales() {
        this.xScale = d3.scaleBand()
            .range([0, this.innerWidth])
            .padding(0.1);

        this.yScale = d3.scaleLinear()
            .range([this.innerHeight, 0]);
    }

    createAxes() {
        this.xAxis = this.chart.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${this.innerHeight})`);

        this.yAxis = this.chart.append('g')
            .attr('class', 'y-axis');

        // Add axis labels
        this.chart.append('text')
            .attr('class', 'x-axis-label')
            .attr('text-anchor', 'middle')
            .attr('x', this.innerWidth / 2)
            .attr('y', this.innerHeight + this.options.margin.bottom - 5)
            .text('Categories');

        this.chart.append('text')
            .attr('class', 'y-axis-label')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .attr('x', -this.innerHeight / 2)
            .attr('y', -this.options.margin.left + 15)
            .text('Values');
    }

    update(data) {
        // Update scales
        this.xScale.domain(data.map(d => d.category));
        this.yScale.domain([0, d3.max(data, d => d.value)]);

        // Update axes
        this.xAxis.transition()
            .duration(this.options.transitionDuration)
            .call(d3.axisBottom(this.xScale));

        this.yAxis.transition()
            .duration(this.options.transitionDuration)
            .call(d3.axisLeft(this.yScale));

        // Data binding
        const bars = this.chart.selectAll('.bar')
            .data(data, d => d.category);

        // Remove old bars
        bars.exit()
            .transition()
            .duration(this.options.transitionDuration)
            .attr('y', this.innerHeight)
            .attr('height', 0)
            .remove();

        // Add new bars
        const barsEnter = bars.enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => this.xScale(d.category))
            .attr('y', this.innerHeight)
            .attr('width', this.xScale.bandwidth())
            .attr('height', 0);

        // Update all bars
        bars.merge(barsEnter)
            .transition()
            .duration(this.options.transitionDuration)
            .attr('x', d => this.xScale(d.category))
            .attr('y', d => this.yScale(d.value))
            .attr('width', this.xScale.bandwidth())
            .attr('height', d => this.innerHeight - this.yScale(d.value))
            .attr('fill', 'steelblue');
    }
}

// Example usage
document.addEventListener('DOMContentLoaded', () => {
    // Update the example title
    document.getElementById('example-title').textContent = 'Component-Based Bar Chart';

    // Create sample data
    const sampleData = [
        { category: 'A', value: 10 },
        { category: 'B', value: 20 },
        { category: 'C', value: 15 },
        { category: 'D', value: 25 },
        { category: 'E', value: 30 }
    ];

    // Create controls
    const controls = document.getElementById('controls');
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update Data';
    controls.appendChild(updateButton);

    // Initialize the bar chart
    const barChart = new BarChartComponent('#visualization', {
        width: 800,
        height: 500
    });
    barChart.update(sampleData);

    // Add click handler for the update button
    updateButton.addEventListener('click', () => {
        // Generate new random data
        const newData = sampleData.map(d => ({
            category: d.category,
            value: Math.floor(Math.random() * 40) + 5
        }));
        barChart.update(newData);
    });
});