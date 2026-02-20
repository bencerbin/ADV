// pieChart.js
class PieChart {
    constructor(config) {
        // Set default configuration
        this.config = {
            container: '#visualization',
            width: 600,
            height: 400,
            margin: { top: 40, right: 40, bottom: 40, left: 40 },
            colors: d3.schemeCategory10,
            transition: 750,
            title: 'Pie Chart',
            ...config
        };

        // Calculate radius
        this.radius = Math.min(
            this.config.width - this.config.margin.left - this.config.margin.right,
            this.config.height - this.config.margin.top - this.config.margin.bottom
        ) / 2;

        this.init();
    }

    init() {
        // Set up the SVG container
        this.svg = d3.select(this.config.container)
            .append('svg')
            .attr('width', this.config.width)
            .attr('height', this.config.height)
            .append('g')
            .attr('transform', `translate(${this.config.width / 2}, ${this.config.height / 2})`);

        // Initialize the pie generator
        this.pie = d3.pie()
            .value(d => d.value)
            .sort(null);

        // Initialize the arc generator
        this.arc = d3.arc()
            .innerRadius(0)
            .outerRadius(this.radius);

        // Initialize the color scale
        this.color = d3.scaleOrdinal(this.config.colors);

        // Create tooltip
        this.tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);
    }

    update(data) {
        // Data join for pie segments
        const arcs = this.svg.selectAll('.arc')
            .data(this.pie(data));

        // Remove old elements
        arcs.exit().remove();

        // Add new elements
        const arcsEnter = arcs.enter()
            .append('g')
            .attr('class', 'arc');

        // Add paths to new elements
        arcsEnter.append('path');

        // Add labels to new elements
        arcsEnter.append('text')
            .attr('dy', '.35em')
            .style('text-anchor', 'middle');

        // Update all elements
        const arcsMerge = arcs.merge(arcsEnter);

        // Update paths
        arcsMerge.select('path')
            .transition()
            .duration(this.config.transition)
            .attr('d', this.arc)
            .attr('fill', (d, i) => this.color(i))
            .attr('stroke', 'white')
            .attr('stroke-width', 2);

        // Update labels
        arcsMerge.select('text')
            .transition()
            .duration(this.config.transition)
            .attr('transform', d => `translate(${this.arc.centroid(d)})`)
            .text(d => d.data.label);

        // Add hover interactions
        arcsMerge
            .on('mouseover', (event, d) => {
                this.tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
                this.tooltip.html(`${d.data.label}: ${d.data.value}`)
                    .style('left', (event.pageX) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', () => {
                this.tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });
    }

    // Method to update specific configuration options
    updateConfig(newConfig) {
        this.config = {
            ...this.config,
            ...newConfig
        };
        this.radius = Math.min(
            this.config.width - this.config.margin.left - this.config.margin.right,
            this.config.height - this.config.margin.top - this.config.margin.bottom
        ) / 2;
        
        // Update SVG dimensions
        d3.select(this.config.container)
            .select('svg')
            .attr('width', this.config.width)
            .attr('height', this.config.height);
            
        this.svg.attr('transform', `translate(${this.config.width / 2}, ${this.config.height / 2})`);
        
        // Update arc generator
        this.arc.outerRadius(this.radius);
    }
}

// Example usage:
document.addEventListener('DOMContentLoaded', () => {
    // Set the example title
    document.getElementById('example-title').textContent = 'Interactive Pie Chart';

    // Sample data
    const data = [
        { label: 'Category A', value: 30 },
        { label: 'Category B', value: 20 },
        { label: 'Category C', value: 15 },
        { label: 'Category D', value: 25 },
        { label: 'Category E', value: 10 }
    ];

    // Create pie chart instance
    const pieChart = new PieChart({
        container: '#visualization',
        width: document.querySelector('#visualization').offsetWidth,
        height: 500
    });

    // Initial render
    pieChart.update(data);

    // Add window resize handler
    window.addEventListener('resize', () => {
        pieChart.updateConfig({
            width: document.querySelector('#visualization').offsetWidth
        });
        pieChart.update(data);
    });
});