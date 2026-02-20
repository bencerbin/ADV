// interaction-states.js
class InteractiveVisualization {
    constructor(containerId) {
        this.containerId = containerId;
        this.svg = null;
        this.data = [];
        this.width = 800;
        this.height = 500;
        this.margin = { top: 40, right: 40, bottom: 60, left: 60 };
        this.states = {
            IDLE: 'idle',
            HOVER: 'hover',
            SELECTED: 'selected',
            TRANSITIONING: 'transitioning'
        };
        
        // Initialize scales
        this.xScale = d3.scaleLinear();
        this.yScale = d3.scaleLinear();
        this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        
        // Initialize interaction state
        this.currentState = this.states.IDLE;
        this.selectedElement = null;
    }

    initialize() {
        // Set the title
        d3.select('#example-title').text('Interactive Data Visualization');

        // Create SVG container
        this.svg = d3.select(`#${this.containerId}`)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        // Add groups for different elements
        this.plotArea = this.svg.append('g')
            .attr('class', 'plot-area')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        // Add axes groups
        this.xAxis = this.svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(${this.margin.left}, ${this.height - this.margin.bottom})`);

        this.yAxis = this.svg.append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        // Add controls
        this.addControls();
    }

    addControls() {
        const controls = d3.select('#controls');
        
        controls.append('button')
            .text('Generate New Data')
            .on('click', () => this.generateData());

        controls.append('button')
            .text('Reset Selection')
            .on('click', () => this.resetSelection());
    }

    generateData() {
        // Generate random data points
        this.data = Array.from({ length: 50 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            category: Math.floor(Math.random() * 5)
        }));

        this.updateScales();
        this.render();
    }

    updateScales() {
        // Update scales based on data
        this.xScale
            .domain([0, d3.max(this.data, d => d.x)])
            .range([0, this.width - this.margin.left - this.margin.right]);

        this.yScale
            .domain([0, d3.max(this.data, d => d.y)])
            .range([this.height - this.margin.top - this.margin.bottom, 0]);
    }

    render() {
        // Update axes
        this.xAxis.call(d3.axisBottom(this.xScale));
        this.yAxis.call(d3.axisLeft(this.yScale));

        // Data join for circles
        const circles = this.plotArea
            .selectAll('circle')
            .data(this.data);

        // Enter new circles
        circles.enter()
            .append('circle')
            .attr('r', 5)
            .merge(circles)
            .attr('cx', d => this.xScale(d.x))
            .attr('cy', d => this.yScale(d.y))
            .attr('fill', d => this.colorScale(d.category))
            .attr('stroke', '#fff')
            .attr('stroke-width', 1)
            .attr('state', this.states.IDLE)
            .on('mouseover', (event, d) => this.handleMouseOver(event, d))
            .on('mouseout', (event, d) => this.handleMouseOut(event, d))
            .on('click', (event, d) => this.handleClick(event, d));

        // Exit removed circles
        circles.exit().remove();
    }

    handleMouseOver(event, d) {
        if (this.currentState !== this.states.SELECTED) {
            const element = d3.select(event.currentTarget);
            
            element
                .transition()
                .duration(200)
                .attr('state', this.states.HOVER)
                .attr('r', 8)
                .attr('stroke-width', 2);

            // Show tooltip
            this.showTooltip(event, d);
        }
    }

    handleMouseOut(event, d) {
        if (this.currentState !== this.states.SELECTED) {
            const element = d3.select(event.currentTarget);
            
            element
                .transition()
                .duration(200)
                .attr('state', this.states.IDLE)
                .attr('r', 5)
                .attr('stroke-width', 1);

            // Hide tooltip
            this.hideTooltip();
        }
    }

    handleClick(event, d) {
        const element = d3.select(event.currentTarget);
        
        if (this.selectedElement === element) {
            // Deselect if already selected
            this.resetSelection();
        } else {
            // Reset previous selection
            if (this.selectedElement) {
                this.selectedElement
                    .transition()
                    .duration(200)
                    .attr('state', this.states.IDLE)
                    .attr('r', 5)
                    .attr('stroke-width', 1);
            }

            // Select new element
            this.currentState = this.states.SELECTED;
            this.selectedElement = element;
            
            element
                .transition()
                .duration(200)
                .attr('state', this.states.SELECTED)
                .attr('r', 10)
                .attr('stroke-width', 3);

            // Highlight related elements
            this.highlightRelated(d);
        }
    }

    resetSelection() {
        if (this.selectedElement) {
            this.selectedElement
                .transition()
                .duration(200)
                .attr('state', this.states.IDLE)
                .attr('r', 5)
                .attr('stroke-width', 1);
            
            this.currentState = this.states.IDLE;
            this.selectedElement = null;

            // Reset all elements to normal state
            this.plotArea.selectAll('circle')
                .transition()
                .duration(200)
                .attr('opacity', 1);
        }
    }

    highlightRelated(d) {
        // Highlight elements in the same category
        this.plotArea.selectAll('circle')
            .transition()
            .duration(200)
            .attr('opacity', item => item.category === d.category ? 1 : 0.2);
    }

    showTooltip(event, d) {
        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');

        tooltip.html(`
            <strong>Category:</strong> ${d.category}<br>
            <strong>X:</strong> ${d.x.toFixed(2)}<br>
            <strong>Y:</strong> ${d.y.toFixed(2)}
        `);
    }

    hideTooltip() {
        d3.selectAll('.tooltip').remove();
    }
}

// Initialize the visualization
document.addEventListener('DOMContentLoaded', () => {
    const vis = new InteractiveVisualization('visualization');
    vis.initialize();
    vis.generateData();
});