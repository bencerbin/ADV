// Set up the SVG dimensions and margins
const margin = { top: 40, right: 40, bottom: 40, left: 40 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create the SVG container
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

const rScale = d3.scaleLinear()
    .domain([0, 100])
    .range([5, 30]);

// Add axes
svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

svg.append('g')
    .call(d3.axisLeft(yScale));

// Function to generate random data
function generateData(count) {
    return Array.from({ length: count }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        value: Math.random() * 100
    }));
}

// Initial data
let currentData = generateData(10);

// Update pattern with transitions
function update(newData) {
    // Join data
    const circles = svg.selectAll('circle')
        .data(newData);
    
    // Exit selection - remove elements that no longer have data
    circles.exit()
        .transition()
        .duration(500)
        .attr('r', 0)
        .remove();
    
    // Enter selection - create new elements for new data
    const circlesEnter = circles.enter()
        .append('circle')
        .attr('r', 0)
        .attr('fill', 'steelblue')
        .attr('opacity', 0.7);
    
    // Update + Enter selections - update all elements
    circles.merge(circlesEnter)
        .transition()
        .duration(1000)
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', d => rScale(d.value));
}

// Add controls
const controls = d3.select('#controls')
    .style('text-align', 'center');

controls.append('button')
    .text('Add Points')
    .on('click', () => {
        currentData = [...currentData, ...generateData(5)];
        update(currentData);
    });

controls.append('button')
    .text('Remove Points')
    .on('click', () => {
        currentData = currentData.slice(0, Math.max(0, currentData.length - 5));
        update(currentData);
    });

controls.append('button')
    .text('Update Points')
    .on('click', () => {
        currentData = currentData.map(d => ({
            ...d,
            x: Math.random() * 100,
            y: Math.random() * 100,
            value: Math.random() * 100
        }));
        update(currentData);
    });

// Set the example title
d3.select('#example-title').text('Update Pattern with Transitions');

// Initial render
update(currentData);