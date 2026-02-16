// Set the title for the example
document.getElementById('example-title').textContent = 'Chaining Transitions';

// Setup dimensions
const width = 800;
const height = 400;

// Create SVG
const svg = d3.select('#visualization')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

// Add button
const button = d3.select('#controls')
    .append('button')
    .text('Start Animation')
    .on('click', startAnimation);

// Create initial circle
const circle = svg.append('circle')
    .attr('cx', 100)
    .attr('cy', height/2)
    .attr('r', 30)
    .attr('fill', 'steelblue');

function startAnimation() {
    // Disable button during animation
    button.attr('disabled', true);
    
    // Clear any existing animations
    circle.interrupt();
    
    // First transition: Move right and change color
    circle.transition()
        .duration(1000)
        .attr('cx', width - 100)
        .attr('fill', 'red')
    // Second transition: Move up
        .transition()
        .duration(1000)
        .attr('cy', 100)
        .attr('fill', 'orange')
    // Third transition: Move to center and change size
        .transition()
        .duration(1000)
        .attr('cx', width/2)
        .attr('cy', height/2)
        .attr('r', 50)
        .attr('fill', 'green')
    // Fourth transition: Return to original position and style
        .transition()
        .duration(1000)
        .attr('cx', 100)
        .attr('cy', height/2)
        .attr('r', 30)
        .attr('fill', 'steelblue')
        .on('end', function() {
            // Re-enable button after animation completes
            button.attr('disabled', null);
        });
}

// Add instruction text
svg.append('text')
    .attr('x', width/2)
    .attr('y', 50)
    .attr('text-anchor', 'middle')
    .text('Click the button to start animation');