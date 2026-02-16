// example.js
document.getElementById('example-title').textContent = 'Linked Views';

// Generate some sample data
const generateData = () => {
    const data = [];
    for (let i = 0; i < 50; i++) {
        data.push({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
            value: Math.random() * 100
        });
    }
    return data;
};

const data = generateData();

// Set up dimensions
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 500 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG containers
const scatterSvg = d3.select('#visualization')
    .append('div')
    .style('display', 'inline-block')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

const barSvg = d3.select('#visualization')
    .append('div')
    .style('display', 'inline-block')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

// Set up scales
const xScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0]);

const categoryScale = d3.scaleBand()
    .domain(['A', 'B', 'C'])
    .range([0, width])
    .padding(0.1);

const valueScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([height, 0]);

// Create axes
scatterSvg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

scatterSvg.append('g')
    .call(d3.axisLeft(yScale));

barSvg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(categoryScale));

barSvg.append('g')
    .call(d3.axisLeft(valueScale));

// Create LinkedViews class
class LinkedViews {
    constructor() {
        this.views = new Map();
        this.selectedData = null;
    }

    addView(name, view) {
        this.views.set(name, view);
    }

    updateSelection(selected, sourceName) {
        this.selectedData = selected;
        this.views.forEach((view, name) => {
            if (name !== sourceName) {
                view.updateHighlight(selected);
            }
        });
    }
}

// Create scatter plot view
class ScatterPlotView {
    constructor(svg, data, xScale, yScale) {
        this.svg = svg;
        this.data = data;
        this.xScale = xScale;
        this.yScale = yScale;
        this.points = null;
        this.linkedViews = null;
    }

    setLinkedViews(linkedViews) {
        this.linkedViews = linkedViews;
    }

    render() {
        this.points = this.svg.selectAll('circle')
            .data(this.data)
            .enter()
            .append('circle')
            .attr('cx', d => this.xScale(d.x))
            .attr('cy', d => this.yScale(d.y))
            .attr('r', 5)
            .attr('fill', 'steelblue')
            .on('mouseover', (event, d) => {
                if (this.linkedViews) {
                    this.linkedViews.updateSelection([d], 'scatter');
                }
            })
            .on('mouseout', () => {
                if (this.linkedViews) {
                    this.linkedViews.updateSelection(null, 'scatter');
                }
            });
    }

    updateHighlight(selected) {
        this.points
            .attr('fill', d => {
                if (!selected) return 'steelblue';
                return selected.find(s => s.id === d.id) ? 'red' : 'steelblue';
            })
            .attr('r', d => {
                if (!selected) return 5;
                return selected.find(s => s.id === d.id) ? 8 : 5;
            });
    }
}

// Create bar chart view
class BarChartView {
    constructor(svg, data, categoryScale, valueScale) {
        this.svg = svg;
        this.data = data;
        this.categoryScale = categoryScale;
        this.valueScale = valueScale;
        this.bars = null;
        this.linkedViews = null;
    }

    setLinkedViews(linkedViews) {
        this.linkedViews = linkedViews;
    }

    render() {
        // Aggregate data by category
        const aggregatedData = d3.rollup(
            this.data,
            v => d3.mean(v, d => d.value),
            d => d.category
        );

        const barData = Array.from(aggregatedData, ([category, value]) => ({
            category,
            value,
            points: this.data.filter(d => d.category === category)
        }));

        this.bars = this.svg.selectAll('rect')
            .data(barData)
            .enter()
            .append('rect')
            .attr('x', d => this.categoryScale(d.category))
            .attr('y', d => this.valueScale(d.value))
            .attr('width', this.categoryScale.bandwidth())
            .attr('height', d => height - this.valueScale(d.value))
            .attr('fill', 'steelblue')
            .on('mouseover', (event, d) => {
                if (this.linkedViews) {
                    this.linkedViews.updateSelection(d.points, 'bar');
                }
            })
            .on('mouseout', () => {
                if (this.linkedViews) {
                    this.linkedViews.updateSelection(null, 'bar');
                }
            });
    }

    updateHighlight(selected) {
        this.bars
            .attr('fill', d => {
                if (!selected) return 'steelblue';
                return selected.some(s => d.points.includes(s)) ? 'red' : 'steelblue';
            });
    }
}

// Initialize and connect views
const linkedViews = new LinkedViews();
const scatterPlot = new ScatterPlotView(scatterSvg, data, xScale, yScale);
const barChart = new BarChartView(barSvg, data, categoryScale, valueScale);

scatterPlot.setLinkedViews(linkedViews);
barChart.setLinkedViews(linkedViews);

linkedViews.addView('scatter', scatterPlot);
linkedViews.addView('bar', barChart);

scatterPlot.render();
barChart.render();