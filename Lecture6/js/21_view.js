// Set the title of the example
document.getElementById('example-title').textContent = 'Zoomable Chart Demo';

// Create a button for resetting zoom
const controls = document.getElementById('controls');
const resetButton = document.createElement('button');
resetButton.textContent = 'Reset Zoom';
controls.appendChild(resetButton);

// Initialize the visualization dimensions
const width = 800;
const height = 500;
const margin = { top: 20, right: 20, bottom: 30, left: 40 };

// Create the SVG container
const svg = d3.select('#visualization')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

// Create a group for the zoomable content
const g = svg.append('g');

// Generate some sample data for circles
const data = Array.from({ length: 50 }, (_, i) => ({
    x: Math.random() * (width - margin.left - margin.right),
    y: Math.random() * (height - margin.top - margin.bottom),
    radius: Math.random() * 20 + 10
}));

// Add circles to demonstrate zoom
g.selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', d => d.radius)
    .attr('fill', 'steelblue')
    .attr('opacity', 0.7);

// Add some text labels to demonstrate zoom affects on text
g.selectAll('text')
    .data(data.slice(0, 10)) // Only add text for first 10 circles
    .join('text')
    .attr('x', d => d.x)
    .attr('y', d => d.y - d.radius - 5)
    .text((_, i) => `Point ${i + 1}`)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px');

// Create zoom behavior
const zoom = d3.zoom()
    .scaleExtent([0.5, 5]) // Set minimum and maximum zoom scales
    .on('zoom', zoomed);

// Apply zoom behavior to SVG
svg.call(zoom);

// Zoom event handler
function zoomed(event) {
    // Apply transformation to the group containing all elements
    g.attr('transform', event.transform);
}

// Reset zoom handler
function resetZoom() {
    svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
}

// Add reset functionality to button
resetButton.addEventListener('click', resetZoom);

// Add instructions text
svg.append('text')
    .attr('x', 10)
    .attr('y', 20)
    .text('Use mouse wheel to zoom, drag to pan')
    .attr('font-size', '14px')
    .attr('fill', '#666');