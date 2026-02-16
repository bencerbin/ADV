// Set the example title
document.getElementById('example-title').textContent = 'Understanding Transitions';

// Setup the visualization container
const width = 800;
const height = 400;
const svg = d3.select('#visualization')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

// Add controls
const controls = d3.select('#controls')
    .append('div')
    .attr('class', 'button-container');

controls.append('button')
    .text('Basic Transition')
    .on('click', basicTransition);

controls.append('button')
    .text('Chain Transition')
    .on('click', chainTransition);

controls.append('button')
    .text('Reset')
    .on('click', reset);

// Create initial circle
const circle = svg.append('circle')
    .attr('cx', width / 2)
    .attr('cy', height / 2)
    .attr('r', 10)
    .attr('fill', 'blue');

// Basic transition function
function basicTransition() {
    // Simple transition with duration and attribute changes
    circle.transition()
        .duration(1000)
        .attr('r', 40)
        .attr('fill', 'red')
        // Add educational comments in tooltip
        .on('start', () => addComment('Transition started: watch radius and color change'))
        .on('end', () => addComment('Transition completed'));
}

// Chained transition function
function chainTransition() {
    const t = d3.transition()
        .duration(750)
        .ease(d3.easeLinear);

    circle.transition(t)
        .attr('r', 40)
        .attr('fill', 'green')
        .on('start', () => addComment('First transition: expanding and turning green'))
    .transition()
        .duration(750)
        .attr('r', 20)
        .attr('fill', 'orange')
        .on('start', () => addComment('Second transition: shrinking and turning orange'))
    .transition()
        .duration(750)
        .attr('r', 30)
        .attr('fill', 'purple')
        .on('start', () => addComment('Final transition: medium size and purple'));
}

// Reset function
function reset() {
    circle.transition()
        .duration(500)
        .attr('r', 10)
        .attr('fill', 'blue')
        .on('start', () => addComment('Resetting to initial state'));
}

// Helper function to add educational comments
function addComment(text) {
    const comment = d3.select('#visualization')
        .append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('top', '10px')
        .style('left', '10px')
        .text(text);

    // Remove comment after 2 seconds
    setTimeout(() => {
        comment.transition()
            .duration(500)
            .style('opacity', 0)
            .remove();
    }, 2000);
}

// Add initial instructions
addComment('Click the buttons above to see different types of transitions!');