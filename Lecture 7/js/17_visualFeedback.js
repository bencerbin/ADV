// Visual Feedback Component Class
class VisualFeedbackComponent {
    constructor(containerId) {
        this.container = d3.select(`#${containerId}`);
        this.width = 800;
        this.height = 400;
        this.margin = {top: 40, right: 40, bottom: 60, left: 60};
        this.data = [];
        
        // Initialize the component
        this.initializeComponent();
    }

    initializeComponent() {
        // Set the example title
        d3.select('#example-title').text('Interactive Visual Feedback');

        // Create SVG container
        this.svg = this.container.append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        // Create main group element
        this.mainGroup = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        // Initialize scales
        this.xScale = d3.scaleLinear()
            .range([0, this.width - this.margin.left - this.margin.right]);
        
        this.yScale = d3.scaleLinear()
            .range([this.height - this.margin.top - this.margin.bottom, 0]);

        // Initialize axes
        this.xAxis = this.mainGroup.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${this.height - this.margin.top - this.margin.bottom})`);

        this.yAxis = this.mainGroup.append('g')
            .attr('class', 'y-axis');

        // Add axes labels
        this.mainGroup.append('text')
            .attr('class', 'x-label')
            .attr('text-anchor', 'middle')
            .attr('x', (this.width - this.margin.left - this.margin.right) / 2)
            .attr('y', this.height - this.margin.top)
            .text('X Value');

        this.mainGroup.append('text')
            .attr('class', 'y-label')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .attr('x', -(this.height - this.margin.top - this.margin.bottom) / 2)
            .attr('y', -40)
            .text('Y Value');
    }

    updateData(newData) {
        this.data = newData;
        
        // Update scales domains
        this.xScale.domain([0, d3.max(this.data, d => d.x)]);
        this.yScale.domain([0, d3.max(this.data, d => d.y)]);

        // Update axes
        this.xAxis.transition().duration(750).call(d3.axisBottom(this.xScale));
        this.yAxis.transition().duration(750).call(d3.axisLeft(this.yScale));

        // Data join for circles
        const circles = this.mainGroup.selectAll('circle')
            .data(this.data);

        // Enter new circles
        circles.enter()
            .append('circle')
            .attr('r', 5)
            .attr('cx', d => this.xScale(d.x))
            .attr('cy', d => this.yScale(d.y))
            .style('fill', 'steelblue')
            .on('mouseover', (event, d) => this.handleMouseOver(event, d))
            .on('mouseout', (event, d) => this.handleMouseOut(event, d))
            .on('click', (event, d) => this.handleClick(event, d));

        // Update existing circles
        circles.transition()
            .duration(750)
            .attr('cx', d => this.xScale(d.x))
            .attr('cy', d => this.yScale(d.y));

        // Remove old circles
        circles.exit().remove();
    }

    handleMouseOver(event, d) {
        const circle = d3.select(event.currentTarget);
        this.provideVisualFeedback(circle, 'highlight');
        
        // Show tooltip
        this.showTooltip(event, d);
    }

    handleMouseOut(event, d) {
        const circle = d3.select(event.currentTarget);
        this.provideVisualFeedback(circle, 'normal');
        
        // Hide tooltip
        this.hideTooltip();
    }

    handleClick(event, d) {
        const circle = d3.select(event.currentTarget);
        this.provideVisualFeedback(circle, 'select');
    }

    provideVisualFeedback(selection, action) {
        switch(action) {
            case 'highlight':
                selection.transition()
                    .duration(200)
                    .style('fill', 'orange')
                    .attr('r', 8);
                break;
            case 'select':
                selection.transition()
                    .duration(300)
                    .style('fill', 'red')
                    .attr('r', 10);
                break;
            case 'normal':
                selection.transition()
                    .duration(200)
                    .style('fill', 'steelblue')
                    .attr('r', 5);
                break;
        }
    }

    showTooltip(event, d) {
        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');

        tooltip.html(`X: ${d.x}<br>Y: ${d.y}`);
    }

    hideTooltip() {
        d3.selectAll('.tooltip').remove();
    }
}

// Initialize the component
const visualFeedback = new VisualFeedbackComponent('visualization');

// Generate some random data
const generateData = () => {
    return Array.from({length: 20}, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100
    }));
};

// Add controls
const controls = d3.select('#controls')
    .append('button')
    .text('Generate New Data')
    .on('click', () => visualFeedback.updateData(generateData()));

// Initial data load
visualFeedback.updateData(generateData());