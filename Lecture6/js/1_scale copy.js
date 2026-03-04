// Set up dimensions for the visualization
const margin = { top: 40, right: 40, bottom: 60, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Update the title
d3.select('#example-title').text('Understanding D3 Scales');

// Create SVG container
const svg = d3.select('#visualization')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

// Create a scale for demonstration
const xScale = d3.scaleLinear()
    .domain([0, 200])  // Data space
    .range([0, width]); // Pixel space

// Create axis
const xAxis = d3.axisBottom(xScale)
    .tickFormat(d => `${d}`);

// Add X axis
svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis);

// Add axis labels
svg.append('text')
    .attr('class', 'x-label')
    .attr('text-anchor', 'middle')
    .attr('x', width / 2)
    .attr('y', height + 40)
    .text('Data Space (Input Domain: 0-100)');

// Add a vertical line to show mapping
const mappingLine = svg.append('line')
    .attr('stroke', 'red')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '4')
    .style('opacity', 0);

// Add point to show mapping
const mappingPoint = svg.append('circle')
    .attr('r', 5)
    .attr('fill', 'red')
    .style('opacity', 0);

// Add text to show values
const mappingText = svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', -10)
    .style('opacity', 0);

// Add controls
const controls = d3.select('#controls')
    .append('div')
    .style('text-align', 'center');

// Add input slider
controls.append('input')
    .attr('type', 'range')
    .attr('min', 0)
    .attr('max', 200)
    .attr('value', 50)
    .attr('step', 1)
    .style('width', '300px')
    .style('margin', '0 10px')
    .on('input', function() {
        updateMapping(this.value);
    });

// Add value display
controls.append('span')
    .attr('id', 'value-display')
    .text('Value: 50');

// Function to update the mapping visualization
function updateMapping(value) {
    const pixelValue = xScale(value);
    
    // Update value display
    d3.select('#value-display')
        .text(`Value: ${value} → ${Math.round(pixelValue)} pixels`);

    // Update vertical line
    mappingLine
        .attr('x1', pixelValue)
        .attr('y1', 0)
        .attr('x2', pixelValue)
        .attr('y2', height)
        .style('opacity', 1);

    // Update point
    mappingPoint
        .attr('cx', pixelValue)
        .attr('cy', height)
        .style('opacity', 1);

    // Update text
    mappingText
        .attr('x', pixelValue)
        .attr('y', height / 2)
        .text(`${value} → ${Math.round(pixelValue)}px`)
        .style('opacity', 1);
}

// Initialize with default value
updateMapping(50);

// Add explanation text
svg.append('text')
    .attr('x', width / 2)
    .attr('y', -10)
    .attr('text-anchor', 'middle')
    .attr('fill', '#666')
    .text('Move the slider to see how D3 scales map data values to pixel values');