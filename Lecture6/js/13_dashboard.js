// Set the title of the example
document.getElementById('example-title').textContent = 'Interactive Dashboard Layout';

// Sample data
const timelineData = Array.from({length: 12}, (_, i) => ({
    month: new Date(2024, i, 1),
    value: Math.random() * 100
}));

const regionData = [
    { region: 'North', value: 45 },
    { region: 'South', value: 65 },
    { region: 'East', value: 52 },
    { region: 'West', value: 38 }
];

// Set up dimensions
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const mapHeight = 300;
const chartHeight = 200;

// Create map visualization
const mapContainer = d3.select('#visualization')
    .append('div')
    .attr('class', 'dashboard-container');

const mapDiv = mapContainer.append('div')
    .attr('class', 'viz-component')
    .attr('id', 'map');

mapDiv.append('h3')
    .text('Geographic Distribution')
    .style('margin-top', '0');

const mapSvg = mapDiv.append('svg')
    .attr('width', '100%')
    .attr('height', mapHeight);

// Simple placeholder for map
const regions = mapSvg.selectAll('.region')
    .data(regionData)
    .enter()
    .append('rect')
    .attr('class', 'region')
    .attr('x', (d, i) => i * 120 + 50)
    .attr('y', 50)
    .attr('width', 100)
    .attr('height', 100)
    .attr('fill', d => d3.interpolateBlues(d.value / 100))
    .attr('stroke', '#333');

// Add region labels
mapSvg.selectAll('.region-label')
    .data(regionData)
    .enter()
    .append('text')
    .attr('class', 'region-label')
    .attr('x', (d, i) => i * 120 + 100)
    .attr('y', 170)
    .attr('text-anchor', 'middle')
    .text(d => `${d.region}: ${d.value}`);

// Create timeline visualization
const timelineDiv = mapContainer.append('div')
    .attr('class', 'viz-component')
    .attr('id', 'timeline');

timelineDiv.append('h3')
    .text('Timeline')
    .style('margin-top', '0');

const timelineSvg = timelineDiv.append('svg')
    .attr('width', '100%')
    .attr('height', chartHeight);

// Set up scales for timeline
const timelineWidth = timelineSvg.node().getBoundingClientRect().width - margin.left - margin.right;
const x = d3.scaleTime()
    .domain(d3.extent(timelineData, d => d.month))
    .range([margin.left, timelineWidth]);

const y = d3.scaleLinear()
    .domain([0, d3.max(timelineData, d => d.value)])
    .range([chartHeight - margin.bottom, margin.top]);

// Create line generator
const line = d3.line()
    .x(d => x(d.month))
    .y(d => y(d.value))
    .curve(d3.curveMonotoneX);

// Add timeline path
timelineSvg.append('path')
    .datum(timelineData)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2)
    .attr('d', line);

// Add axes to timeline
timelineSvg.append('g')
    .attr('transform', `translate(0,${chartHeight - margin.bottom})`)
    .call(d3.axisBottom(x)
        .ticks(6)
        .tickFormat(d3.timeFormat('%b')));

timelineSvg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

// Create bar chart
const barchartDiv = mapContainer.append('div')
    .attr('class', 'viz-component')
    .attr('id', 'barchart');

barchartDiv.append('h3')
    .text('Regional Comparison')
    .style('margin-top', '0');

const barchartSvg = barchartDiv.append('svg')
    .attr('width', '100%')
    .attr('height', chartHeight);

// Set up scales for bar chart
const barchartWidth = barchartSvg.node().getBoundingClientRect().width - margin.left - margin.right;
const xBar = d3.scaleBand()
    .domain(regionData.map(d => d.region))
    .range([margin.left, barchartWidth])
    .padding(0.1);

const yBar = d3.scaleLinear()
    .domain([0, d3.max(regionData, d => d.value)])
    .range([chartHeight - margin.bottom, margin.top]);

// Add bars
barchartSvg.selectAll('.bar')
    .data(regionData)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => xBar(d.region))
    .attr('y', d => yBar(d.value))
    .attr('width', xBar.bandwidth())
    .attr('height', d => chartHeight - margin.bottom - yBar(d.value))
    .attr('fill', 'steelblue');

// Add axes to bar chart
barchartSvg.append('g')
    .attr('transform', `translate(0,${chartHeight - margin.bottom})`)
    .call(d3.axisBottom(xBar));

barchartSvg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(yBar));

// Add hover interactions
const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

// Add hover effects for regions
regions.on('mouseover', function(event, d) {
    d3.select(this)
        .transition()
        .duration(200)
        .attr('fill', d3.interpolateBlues(d.value / 80));
        
    tooltip.transition()
        .duration(200)
        .style('opacity', .9);
    tooltip.html(`Region: ${d.region}<br/>Value: ${d.value}`)
        .style('left', (event.pageX + 5) + 'px')
        .style('top', (event.pageY - 28) + 'px');
})
.on('mouseout', function(event, d) {
    d3.select(this)
        .transition()
        .duration(500)
        .attr('fill', d3.interpolateBlues(d.value / 100));
        
    tooltip.transition()
        .duration(500)
        .style('opacity', 0);
});

// Add hover effects for bars
barchartSvg.selectAll('.bar')
    .on('mouseover', function(event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr('fill', '#007bff');
            
        tooltip.transition()
            .duration(200)
            .style('opacity', .9);
        tooltip.html(`Region: ${d.region}<br/>Value: ${d.value}`)
            .style('left', (event.pageX + 5) + 'px')
            .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', function() {
        d3.select(this)
            .transition()
            .duration(500)
            .attr('fill', 'steelblue');
            
        tooltip.transition()
            .duration(500)
            .style('opacity', 0);
    });

// Add responsive behavior
function resizeDashboard() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Update SVG dimensions
    mapSvg.attr('width', width * 0.8);
    timelineSvg.attr('width', width * 0.4);
    barchartSvg.attr('width', width * 0.4);
    
    // Recalculate scales and update visualizations
}

// Add window resize listener
window.addEventListener('resize', resizeDashboard);