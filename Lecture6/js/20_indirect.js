// Update the example title
document.getElementById('example-title').textContent = 'Filterable Data Visualization';

// Generate sample data
const generateData = () => {
    return Array.from({ length: 50 }, (_, i) => ({
        id: i,
        name: `Point ${i}`,
        value: Math.random() * 100,
        category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
        x: Math.random() * 100,
        y: Math.random() * 100
    }));
};

// Set up the visualization
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG
const svg = d3.select('#visualization')
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

// Add axes
svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

svg.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yScale));

// Create filter controls
const controls = d3.select('#controls');

// Add value range filter
controls.append('div')
    .html(`
        <label>Value Filter: </label>
        <input type="range" id="valueFilter" min="0" max="100" value="100" style="width: 200px">
        <span id="valueDisplay">100</span>
    `);

// Add category filter
controls.append('div')
    .html(`
        <label>Category: </label>
        <select id="categoryFilter">
            <option value="all">All</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
        </select>
    `);

// Initialize data
let data = generateData();
let filters = {
    value: 100,
    category: 'all'
};

// Function to update visualization
function updateVisualization() {
    // Filter data
    const filteredData = data.filter(d => {
        const matchesValue = d.value <= filters.value;
        const matchesCategory = filters.category === 'all' || d.category === filters.category;
        return matchesValue && matchesCategory;
    });

    // Update visualization
    const circles = svg.selectAll('circle')
        .data(filteredData, d => d.id);

    // Enter
    circles.enter()
        .append('circle')
        .attr('r', 5)
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('fill', d => d.category === 'A' ? '#ff6b6b' : 
                          d.category === 'B' ? '#4ecdc4' : '#45b7d1')
        .attr('opacity', 0)
        .transition()
        .duration(500)
        .attr('opacity', 0.7);

    // Update
    circles
        .transition()
        .duration(500)
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y));

    // Exit
    circles.exit()
        .transition()
        .duration(500)
        .attr('opacity', 0)
        .remove();
}

// Add event listeners
d3.select('#valueFilter').on('input', function() {
    filters.value = +this.value;
    d3.select('#valueDisplay').text(this.value);
    updateVisualization();
});

d3.select('#categoryFilter').on('change', function() {
    filters.category = this.value;
    updateVisualization();
});

// Initial render
updateVisualization();