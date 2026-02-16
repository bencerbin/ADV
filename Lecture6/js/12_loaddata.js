// Set the title of the example
document.getElementById('example-title').textContent = 'Data Management Pattern';

// Create controls
const controlsDiv = document.getElementById('controls');
controlsDiv.innerHTML = `
    <button id="loadData">Load Data</button>
    <button id="transformData">Transform Data</button>
`;

// Initialize visualization dimensions
const margin = {top: 20, right: 20, bottom: 30, left: 50};
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create SVG container
const svg = d3.select("#visualization")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Initialize scales
const x = d3.scaleTime()
    .range([0, width]);

const y = d3.scaleLinear()
    .range([height, 0]);

// Create axes
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y);

// Add axes to SVG
svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`);

svg.append("g")
    .attr("class", "y-axis");

// Create line generator
const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.value));

// Implement DataManager class
class DataManager {
    constructor() {
        this.data = null;
        this.transformedData = null;
        this.listeners = [];
    }

    async loadData(url) {
        try {
            const response = await d3.csv(url);
            this.data = response;
            this.processData();
            this.notifyListeners();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    processData() {
        if (!this.data) return;
        
        this.transformedData = this.data.map(d => ({
            date: new Date(d.date),
            value: +d.value
        }));
    }

    addListener(callback) {
        this.listeners.push(callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.transformedData));
    }
}

// Create DataManager instance
const dataManager = new DataManager();

// Update visualization when data changes
dataManager.addListener(data => {
    if (!data) return;

    // Update scales
    x.domain(d3.extent(data, d => d.date));
    y.domain([0, d3.max(data, d => d.value)]);

    // Update axes
    svg.select(".x-axis")
        .transition()
        .duration(1000)
        .call(xAxis);

    svg.select(".y-axis")
        .transition()
        .duration(1000)
        .call(yAxis);

    // Update line
    const path = svg.selectAll(".line")
        .data([data]);

    path.enter()
        .append("path")
        .attr("class", "line")
        .merge(path)
        .transition()
        .duration(1000)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    path.exit().remove();
});

// Sample data for demonstration
const sampleData = Array.from({length: 50}, (_, i) => ({
    date: new Date(2023, 0, i + 1),
    value: Math.random() * 100
}));

// Add event listeners to buttons
document.getElementById('loadData').addEventListener('click', () => {
    // Simulate loading data from a URL by using the sample data
    dataManager.data = sampleData;
    console.log('Data loaded:', dataManager.data);
});

document.getElementById('transformData').addEventListener('click', () => {
    dataManager.processData();
    dataManager.notifyListeners();
    console.log('Data transformed:', dataManager.transformedData);
});