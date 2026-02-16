// example.js
document.getElementById('example-title').textContent = 'Fisheye Focus+Context';

// Set up the SVG
const margin = {top: 20, right: 20, bottom: 30, left: 40};
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select('#visualization')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

// Generate sample data
const numPoints = 50;
const data = Array.from({length: numPoints}, (_, i) => ({
    x: i,
    y: Math.random() * height
}));

// Set up scales
const xScale = d3.scaleLinear()
    .domain([0, numPoints - 1])
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([0, height])
    .range([height, 0]);

// Create fisheye scale function
function createFisheyeScale(scale, distortion = 2, mouse) {
    return function(d) {
        const x = scale(d);
        const dx = x - mouse[0];
        const w = distortion * 30;
        const z = dx / w;
        
        if (Math.abs(z) >= 1) return x;
        
        return mouse[0] + dx * (1 + (distortion - 1) * (1 - Math.abs(z)));
    };
}

// Add axes
svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

svg.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yScale));

// Add line
const line = d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));

const path = svg.append('path')
    .datum(data)
    .attr('class', 'line')
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2)
    .attr('d', line);

// Add points
const points = svg.selectAll('.point')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'point')
    .attr('cx', d => xScale(d.x))
    .attr('cy', d => yScale(d.y))
    .attr('r', 4)
    .attr('fill', 'steelblue');

// Add controls
const controlsDiv = d3.select('#controls');

controlsDiv.append('label')
    .text('Distortion: ')
    .append('input')
    .attr('type', 'range')
    .attr('min', 1)
    .attr('max', 5)
    .attr('step', 0.1)
    .attr('value', 2)
    .style('margin-left', '10px')
    .style('width', '200px');

// Add mouse interaction
let mouseX = 0;
let distortion = 2;

svg.on('mousemove', function(event) {
    const [mx] = d3.pointer(event);
    mouseX = mx;
    
    const fisheye = createFisheyeScale(xScale, distortion, [mouseX, 0]);
    
    // Update points
    points
        .attr('cx', d => fisheye(d.x));
    
    // Update line
    const fisheyeLine = d3.line()
        .x(d => fisheye(d.x))
        .y(d => yScale(d.y));
    
    path.attr('d', fisheyeLine);
});

// Update distortion based on slider
controlsDiv.select('input').on('input', function() {
    distortion = +this.value;
    const fisheye = createFisheyeScale(xScale, distortion, [mouseX, 0]);
    
    points
        .attr('cx', d => fisheye(d.x));
    
    const fisheyeLine = d3.line()
        .x(d => fisheye(d.x))
        .y(d => yScale(d.y));
    
    path.attr('d', fisheyeLine);
});

// Add explanatory text
svg.append('text')
    .attr('x', width / 2)
    .attr('y', -5)
    .attr('text-anchor', 'middle')
    .style('font-size', '14px')
    .text('Move mouse horizontally to see fisheye distortion effect');