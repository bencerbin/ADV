// Set the title of the example
document.getElementById('example-title').textContent = 'Axis Creation Demo';

// Add controls for interaction
const controls = document.getElementById('controls');
controls.innerHTML = `
    <button onclick="updateAxes('linear')">Linear Scale</button>
    <button onclick="updateAxes('log')">Log Scale</button>
    <button onclick="updateAxes('time')">Time Scale</button>
`;

// Set up the SVG container with margins
const margin = { top: 40, right: 40, bottom: 60, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select('#visualization')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

// Initialize scales
let xScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width]);

let yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0]);

// Create initial axes
let xAxis = d3.axisBottom(xScale);
let yAxis = d3.axisLeft(yScale);

// Add X axis
const xAxisGroup = svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis);

// Add Y axis
const yAxisGroup = svg.append('g')
    .attr('class', 'y-axis')
    .call(yAxis);

// Add X axis label
svg.append('text')
    .attr('class', 'x-label')
    .attr('text-anchor', 'middle')
    .attr('x', width / 2)
    .attr('y', height + 40)
    .text('X Axis');

// Add Y axis label
svg.append('text')
    .attr('class', 'y-label')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -40)
    .text('Y Axis');

// Function to update axes based on scale type
function updateAxes(scaleType) {
    let newXScale, newYScale;
    
    switch(scaleType) {
        case 'linear':
            newXScale = d3.scaleLinear()
                .domain([0, 100])
                .range([0, width]);
            
            newYScale = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0]);
            
            d3.select('.x-label').text('Linear Scale X');
            d3.select('.y-label').text('Linear Scale Y');
            break;
            
        case 'log':
            newXScale = d3.scaleLog()
                .domain([1, 100])
                .range([0, width]);
            
            newYScale = d3.scaleLog()
                .domain([1, 100])
                .range([height, 0]);
            
            d3.select('.x-label').text('Log Scale X');
            d3.select('.y-label').text('Log Scale Y');
            break;
            
        case 'time':
            const now = new Date();
            const startDate = new Date(now.getTime() - (24 * 60 * 60 * 1000 * 10)); // 10 days ago
            
            newXScale = d3.scaleTime()
                .domain([startDate, now])
                .range([0, width]);
            
            newYScale = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0]);
            
            d3.select('.x-label').text('Time Scale X');
            d3.select('.y-label').text('Linear Scale Y');
            break;
    }
    
    // Update axes with transition
    xAxis = d3.axisBottom(newXScale);
    yAxis = d3.axisLeft(newYScale);
    
    xAxisGroup.transition()
        .duration(1000)
        .call(xAxis);
    
    yAxisGroup.transition()
        .duration(1000)
        .call(yAxis);
    
    // Update scales
    xScale = newXScale;
    yScale = newYScale;
}

// Add grid lines
function addGridLines() {
    // Add X grid lines
    svg.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${height})`)
        .style('stroke-dasharray', '3,3')
        .style('opacity', 0.2)
        .call(xAxis.tickSize(-height).tickFormat(''));

    // Add Y grid lines
    svg.append('g')
        .attr('class', 'grid')
        .style('stroke-dasharray', '3,3')
        .style('opacity', 0.2)
        .call(yAxis.tickSize(-width).tickFormat(''));
}

// Call grid lines function
addGridLines();

// Add some CSS styles
const style = document.createElement('style');
style.textContent = `
    .axis-line {
        stroke: #000;
        stroke-width: 2;
    }
    .domain {
        stroke: #000;
        stroke-width: 2;
    }
    .tick line {
        stroke: #000;
    }
    .tick text {
        font-size: 12px;
    }
`;
document.head.appendChild(style);