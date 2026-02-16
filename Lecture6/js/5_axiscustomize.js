// Set the title of the example
document.getElementById('example-title').textContent = 'Axis Customization';

// Create sample data
const data = Array.from({length: 10}, (_, i) => ({
    x: i / 9,  // Values from 0 to 1
    y: Math.random() * 100
}));

// Set up dimensions and margins
const margin = {top: 40, right: 40, bottom: 60, left: 60};
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG container
const svg = d3.select('#visualization')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

// Create scales
const xScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0]);

// Create and customize x-axis
const xAxis = d3.axisBottom(xScale)
    .ticks(5)                     // Number of ticks
    .tickFormat(d3.format('.0%')) // Format tick labels as percentages
    .tickSize(10)                 // Size of tick marks
    .tickPadding(5);             // Padding between ticks and labels

// Create and customize y-axis
const yAxis = d3.axisLeft(yScale)
    .ticks(8)                     // Number of ticks
    .tickFormat(d => `${d}`)     // Format tick labels
    .tickSize(10)                 // Size of tick marks
    .tickPadding(5);             // Padding between ticks and labels

// Add x-axis
svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis);

// Add y-axis
svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

// Style the axes
svg.selectAll('.axis path, .axis line')
    .style('stroke', '#333')
    .style('stroke-width', 1)
    .style('shape-rendering', 'crispEdges');

svg.selectAll('.axis text')
    .style('font-size', '12px')
    .style('font-family', 'sans-serif');

// Add axis labels
svg.append('text')
    .attr('class', 'x label')
    .attr('text-anchor', 'middle')
    .attr('x', width / 2)
    .attr('y', height + 40)
    .text('Percentage')
    .style('font-size', '14px');

svg.append('text')
    .attr('class', 'y label')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -40)
    .text('Value')
    .style('font-size', '14px');

// Create line generator
const line = d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));

// Add the line path
svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#007bff')
    .attr('stroke-width', 2)
    .attr('d', line);

// Add control buttons
const controls = d3.select('#controls');

// Button to toggle grid lines
controls.append('button')
    .text('Toggle Grid')
    .on('click', toggleGrid);

// Button to change tick format
controls.append('button')
    .text('Change Tick Format')
    .on('click', changeTickFormat);

// Grid lines function
function toggleGrid() {
    const gridLines = svg.selectAll('.grid-line');
    
    if (gridLines.empty()) {
        // Add vertical grid lines
        svg.selectAll('.vertical-grid')
            .data(xScale.ticks(5))
            .enter()
            .append('line')
            .attr('class', 'grid-line')
            .attr('x1', d => xScale(d))
            .attr('x2', d => xScale(d))
            .attr('y1', 0)
            .attr('y2', height)
            .style('stroke', '#ddd')
            .style('stroke-width', 1);

        // Add horizontal grid lines
        svg.selectAll('.horizontal-grid')
            .data(yScale.ticks(8))
            .enter()
            .append('line')
            .attr('class', 'grid-line')
            .attr('x1', 0)
            .attr('x2', width)
            .attr('y1', d => yScale(d))
            .attr('y2', d => yScale(d))
            .style('stroke', '#ddd')
            .style('stroke-width', 1);
    } else {
        gridLines.remove();
    }
}

// Function to change tick format
function changeTickFormat() {
    const formats = [
        d3.format('.0%'),    // Percentage
        d3.format('.2f'),    // 2 decimal places
        d3.format(',.0f'),   // Thousands separator
        d3.format('.2s')     // SI prefix
    ];
    
    // Cycle through formats
    const currentFormat = xAxis.tickFormat();
    const currentIndex = formats.findIndex(f => f.toString() === currentFormat.toString());
    const nextIndex = (currentIndex + 1) % formats.length;
    
    xAxis.tickFormat(formats[nextIndex]);
    svg.select('.x.axis').call(xAxis);
}

// Add a title to the visualization
svg.append('text')
    .attr('x', width / 2)
    .attr('y', -10)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .style('font-weight', 'bold')
    .text('D3.js Axis Customization Demo');