const margin = { top: 40, right: 40, bottom: 60, left: 60 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

d3.select('#example-title').text('Understanding D3 Scales');

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

const yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0]);

// Create axis
const xAxis = d3.axisBottom(xScale)
    .tickFormat(d => `${d}`);

const yAxis = d3.axisLeft(yScale)
    .tickFormat(d => `${d}`);


svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis);

svg.append('g')
    .attr('class', 'y-axis')
    .call(yAxis);
