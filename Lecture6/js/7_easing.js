// Update the title
document.getElementById('example-title').textContent = 'Easing Functions Demo';

// Set up the SVG
const margin = { top: 40, right: 40, bottom: 40, left: 100 };
const width = 800;
const height = 400;

const svg = d3.select('#visualization')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

// Define our easing functions
const easings = [
    { name: 'Linear', fn: d3.easeLinear },
    { name: 'Quadratic', fn: d3.easeQuad },
    { name: 'Cubic', fn: d3.easeCubic },
    { name: 'Bounce', fn: d3.easeBounce }
];

// Create a group for each easing function
const rows = svg.selectAll('.easing-row')
    .data(easings)
    .enter()
    .append('g')
    .attr('class', 'easing-row')
    .attr('transform', (d, i) => `translate(0, ${margin.top + i * 80})`);

// Add labels
rows.append('text')
    .attr('x', margin.left - 10)
    .attr('y', 30)
    .attr('text-anchor', 'end')
    .text(d => d.name);

// Add circles that will animate
const circles = rows.append('circle')
    .attr('cx', margin.left)
    .attr('cy', 25)
    .attr('r', 15)
    .style('fill', (d, i) => d3.schemeCategory10[i]);

// Add control buttons
const controls = d3.select('#controls')
    .style('text-align', 'center');

controls.append('button')
    .text('Start Animation')
    .on('click', animate);

controls.append('button')
    .text('Reset')
    .on('click', reset);

// Animation function
function animate() {
    circles.each(function(d) {
        d3.select(this)
            .transition()
            .duration(2000)
            .ease(d.fn)
            .attr('cx', width - margin.right)
            .transition()
            .duration(2000)
            .ease(d.fn)
            .attr('cx', margin.left);
    });
}

// Reset function
function reset() {
    circles.each(function() {
        d3.select(this)
            .transition()
            .duration(0)
            .attr('cx', margin.left);
    });
}

// Draw the path for each easing function
rows.each(function(d, i) {
    const points = d3.range(0, 1.01, 0.01).map(t => ({
        x: t * (width - margin.left - margin.right) + margin.left,
        y: 25 - d.fn(t) * 20
    }));

    d3.select(this)
        .append('path')
        .datum(points)
        .attr('d', d3.line()
            .x(d => d.x)
            .y(d => d.y))
        .attr('fill', 'none')
        .attr('stroke', d3.schemeCategory10[i])
        .attr('stroke-width', 1.5)
        .style('opacity', 0.5);
});

// Add hover effects
circles.on('mouseover', function(event, d) {
    d3.select(this)
        .transition()
        .duration(100)
        .attr('r', 20);
})
.on('mouseout', function() {
    d3.select(this)
        .transition()
        .duration(100)
        .attr('r', 15);
});