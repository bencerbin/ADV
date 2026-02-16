// Set up the visualization dimensions
const width = 800;
const height = 400;
const margin = { top: 40, right: 40, bottom: 60, left: 60 };

// Update the example title
document.getElementById('example-title').textContent = 'Scale Configuration';

// Create SVG container
const svg = d3.select('#visualization')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

// Create scales for demonstration
const linearScale = d3.scaleLinear()
    .domain([0, 100])
    .range([margin.left, width - margin.right])
    .clamp(true)
    .nice();

const colorScale = d3.scaleLinear()
    .domain([0, 50, 100])
    .range(['blue', 'yellow', 'red']);

// Add control buttons
const controls = d3.select('#controls')
    .append('div')
    .attr('class', 'button-container');

controls.append('button')
    .text('Add Random Point')
    .on('click', addRandomPoint);

controls.append('button')
    .text('Clear Points')
    .on('click', clearPoints);

// Create axes
const xAxis = d3.axisBottom(linearScale);
const colorAxis = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${height - margin.bottom + 40})`);

// Add x-axis
svg.append('g')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

// Create color gradient for demonstration
const gradientData = d3.range(0, 101, 1);
const gradientWidth = width - margin.left - margin.right;
const gradientHeight = 20;

// Add color gradient
svg.append('g')
    .selectAll('rect')
    .data(gradientData)
    .enter()
    .append('rect')
    .attr('x', d => linearScale(d))
    .attr('y', height - margin.bottom + 10)
    .attr('width', gradientWidth / gradientData.length + 1)
    .attr('height', gradientHeight)
    .attr('fill', d => colorScale(d));

// Add labels
svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - 10)
    .attr('text-anchor', 'middle')
    .text('Input Domain [0-100]');

// Function to add random points
function addRandomPoint() {
    const input = Math.random() * 120 - 10; // Generate values between -10 and 110
    const scaled = linearScale(input);
    
    // Add point
    const point = svg.append('circle')
        .attr('cx', scaled)
        .attr('cy', height / 2)
        .attr('r', 5)
        .attr('fill', colorScale(input))
        .attr('opacity', 0)
        .transition()
        .duration(500)
        .attr('opacity', 1);

    // Add text label
    svg.append('text')
        .attr('x', scaled)
        .attr('y', height / 2 - 10)
        .attr('text-anchor', 'middle')
        .attr('opacity', 0)
        .text(`In: ${input.toFixed(1)} → Out: ${scaled.toFixed(1)}`)
        .transition()
        .duration(500)
        .attr('opacity', 1);
}

// Function to clear all points
function clearPoints() {
    svg.selectAll('circle').remove();
    svg.selectAll('text')
        .filter(function() {
            return this.textContent.includes('→');
        })
        .remove();
}

// Add explanatory text
svg.append('text')
    .attr('x', margin.left)
    .attr('y', margin.top)
    .attr('class', 'description')
    .text('Linear Scale with Clamping and Color Interpolation');

// Initial points for demonstration
for (let i = 0; i < 3; i++) {
    addRandomPoint();
}