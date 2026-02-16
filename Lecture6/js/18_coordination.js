// Set the example title
document.getElementById('example-title').textContent = 'View Coordination';

// Create a ViewCoordinator class to manage coordinated views
class ViewCoordinator {
    constructor() {
        this.views = new Map();
        this.state = {
            selection: null,
            filter: null,
            timeRange: null
        };
    }

    registerView(name, view) {
        this.views.set(name, view);
        view.coordinator = this;
    }

    broadcastUpdate(type, source, data) {
        this.state[type] = data;
        this.views.forEach((view, viewName) => {
            if (viewName !== source) {
                view.update(type, this.state);
            }
        });
    }
}

// Create a base View class
class View {
    constructor(selector, data) {
        this.container = d3.select(selector);
        this.data = data;
        this.coordinator = null;
    }

    update(type, state) {
        // To be implemented by child classes
    }
}

// Create a Scatter Plot view
class ScatterPlot extends View {
    constructor(selector, data) {
        super(selector, data);
        
        // Set dimensions
        this.margin = { top: 20, right: 20, bottom: 40, left: 40 };
        this.width = 400;
        this.height = 300;
        this.innerWidth = this.width - this.margin.left - this.margin.right;
        this.innerHeight = this.height - this.margin.top - this.margin.bottom;
        
        this.setupScales();
        this.createSvg();
        this.render();
    }

    setupScales() {
        this.xScale = d3.scaleLinear()
            .domain([0, d3.max(this.data, d => d.x)])
            .range([0, this.innerWidth]);

        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(this.data, d => d.y)])
            .range([this.innerHeight, 0]);
    }

    createSvg() {
        // Clear any existing SVG
        this.container.selectAll("svg").remove();
        
        this.svg = this.container.append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        // Add axes titles
        this.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", this.innerWidth / 2)
            .attr("y", this.innerHeight + 35)
            .text("X Value");

        this.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", -30)
            .attr("x", -this.innerHeight / 2)
            .text("Y Value");
    }

    render() {
        // Add axes
        this.svg.append('g')
            .attr('transform', `translate(0,${this.innerHeight})`)
            .call(d3.axisBottom(this.xScale));

        this.svg.append('g')
            .call(d3.axisLeft(this.yScale));

        // Add points
        this.points = this.svg.selectAll('circle')
            .data(this.data)
            .enter()
            .append('circle')
            .attr('cx', d => this.xScale(d.x))
            .attr('cy', d => this.yScale(d.y))
            .attr('r', 6)
            .style('fill', 'steelblue')
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => {
                if (this.coordinator) {
                    this.coordinator.broadcastUpdate('selection', 'scatter', d);
                }
                d3.select(event.currentTarget).style('fill', 'red');
            })
            .on('mouseout', (event, d) => {
                if (!this.coordinator.state.selection || this.coordinator.state.selection.id !== d.id) {
                    d3.select(event.currentTarget).style('fill', 'steelblue');
                }
            });
    }

    update(type, state) {
        if (type === 'selection') {
            this.points
                .style('fill', d => 
                    state.selection && d.id === state.selection.id ? 'red' : 'steelblue');
        }
    }
}

// Create a Bar Chart view
class BarChart extends View {
    constructor(selector, data) {
        super(selector, data);
        
        // Set dimensions
        this.margin = { top: 20, right: 20, bottom: 40, left: 40 };
        this.width = 400;
        this.height = 300;
        this.innerWidth = this.width - this.margin.left - this.margin.right;
        this.innerHeight = this.height - this.margin.top - this.margin.bottom;
        
        this.setupScales();
        this.createSvg();
        this.render();
    }

    setupScales() {
        this.xScale = d3.scaleBand()
            .domain(this.data.map(d => d.category))
            .range([0, this.innerWidth])
            .padding(0.1);

        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(this.data, d => d.value)])
            .range([this.innerHeight, 0]);
    }

    createSvg() {
        // Clear any existing SVG
        this.container.selectAll("svg").remove();
        
        this.svg = this.container.append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        // Add axes titles
        this.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", this.innerWidth / 2)
            .attr("y", this.innerHeight + 35)
            .text("Categories");

        this.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", -30)
            .attr("x", -this.innerHeight / 2)
            .text("Value");
    }

    render() {
        // Add axes
        this.svg.append('g')
            .attr('transform', `translate(0,${this.innerHeight})`)
            .call(d3.axisBottom(this.xScale));

        this.svg.append('g')
            .call(d3.axisLeft(this.yScale));

        // Add bars
        this.bars = this.svg.selectAll('rect')
            .data(this.data)
            .enter()
            .append('rect')
            .attr('x', d => this.xScale(d.category))
            .attr('y', d => this.yScale(d.value))
            .attr('width', this.xScale.bandwidth())
            .attr('height', d => this.innerHeight - this.yScale(d.value))
            .style('fill', 'steelblue')
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => {
                if (this.coordinator) {
                    this.coordinator.broadcastUpdate('selection', 'bar', d);
                }
                d3.select(event.currentTarget).style('fill', 'red');
            })
            .on('mouseout', (event, d) => {
                if (!this.coordinator.state.selection || this.coordinator.state.selection.id !== d.id) {
                    d3.select(event.currentTarget).style('fill', 'steelblue');
                }
            });
    }

    update(type, state) {
        if (type === 'selection') {
            this.bars
                .style('fill', d => 
                    state.selection && d.id === state.selection.id ? 'red' : 'steelblue');
        }
    }
}

// Generate sample data
const sampleData = Array.from({length: 10}, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    category: `Cat ${i}`,
    value: Math.random() * 100
}));

// Clear and setup the visualization container
const vizContainer = d3.select('#visualization')
    .style('display', 'flex')
    .style('justify-content', 'space-around')
    .style('align-items', 'center')
    .style('padding', '20px');

// Clear any existing content
vizContainer.selectAll('*').remove();

// Create container divs for the visualizations
vizContainer.append('div')
    .attr('id', 'scatter')
    .style('width', '400px')
    .style('height', '300px');

vizContainer.append('div')
    .attr('id', 'bar')
    .style('width', '400px')
    .style('height', '300px');

// Initialize the coordinator and views
const coordinator = new ViewCoordinator();
const scatterPlot = new ScatterPlot('#scatter', sampleData);
const barChart = new BarChart('#bar', sampleData);

// Register the views with the coordinator
coordinator.registerView('scatter', scatterPlot);
coordinator.registerView('bar', barChart);