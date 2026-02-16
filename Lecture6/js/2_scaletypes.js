// Set the title
document.getElementById('example-title').textContent = 'Scale Types Demo';

// Setup SVG
const margin = { top: 40, right: 40, bottom: 40, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select('#visualization')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

// Create control buttons
const controls = d3.select('#controls')
    .append('div')
    .attr('class', 'scale-controls');

const scaleTypes = ['Linear', 'Ordinal', 'Time', 'Log'];
controls.selectAll('button')
    .data(scaleTypes)
    .enter()
    .append('button')
    .text(d => d)
    .on('click', function(event, d) {
        updateVisualization(d);
    });

// Setup tooltip
const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

// Function to clear the visualization
function clearVisualization() {
    svg.selectAll('*').remove();
}

// Function to draw axes
function drawAxes(xScale, yScale) {
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);

    svg.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);
}

// Different scale demonstrations
function demonstrateLinearScale() {
    clearVisualization();

    const data = Array.from({length: 10}, (_, i) => ({
        x: i * 10,
        y: Math.random() * 100
    }));

    const xScale = d3.scaleLinear()
        .domain([0, 90])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

    drawAxes(xScale, yScale);

    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', 5)
        .attr('fill', 'steelblue')
        .on('mouseover', function(event, d) {
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(`Value: (${d.x}, ${d.y.toFixed(2)})`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });
}

function demonstrateOrdinalScale() {
    clearVisualization();

    const data = ['A', 'B', 'C', 'D', 'E'].map(category => ({
        category: category,
        value: Math.random() * 100
    }));

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.category))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

    drawAxes(xScale, yScale);

    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.category))
        .attr('y', d => yScale(d.value))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - yScale(d.value))
        .attr('fill', 'steelblue')
        .on('mouseover', function(event, d) {
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(`Category ${d.category}: ${d.value.toFixed(2)}`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });
}

function demonstrateTimeScale() {
    clearVisualization();

    const data = Array.from({length: 12}, (_, i) => ({
        date: new Date(2023, i, 1),
        value: Math.random() * 100
    }));

    const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

    drawAxes(xScale, yScale);

    const line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.value));

    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2)
        .attr('d', line);

    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.date))
        .attr('cy', d => yScale(d.value))
        .attr('r', 5)
        .attr('fill', 'steelblue')
        .on('mouseover', function(event, d) {
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(`Date: ${d.date.toLocaleDateString()}<br>Value: ${d.value.toFixed(2)}`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });
}

function demonstrateLogScale() {
    clearVisualization();

    const data = Array.from({length: 10}, (_, i) => ({
        x: Math.pow(2, i),
        y: Math.random() * 1000
    }));

    const xScale = d3.scaleLog()
        .domain([1, Math.pow(2, 9)])
        .range([0, width]);

    const yScale = d3.scaleLog()
        .domain([1, 1000])
        .range([height, 0]);

    drawAxes(xScale, yScale);

    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(Math.max(1, d.y))) // Ensure value is at least 1 for log scale
        .attr('r', 5)
        .attr('fill', 'steelblue')
        .on('mouseover', function(event, d) {
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(`X: ${d.x}<br>Y: ${d.y.toFixed(2)}`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });
}

// Function to update visualization based on selected scale type
function updateVisualization(scaleType) {
    switch(scaleType) {
        case 'Linear':
            demonstrateLinearScale();
            break;
        case 'Ordinal':
            demonstrateOrdinalScale();
            break;
        case 'Time':
            demonstrateTimeScale();
            break;
        case 'Log':
            demonstrateLogScale();
            break;
    }
}

// Initialize with linear scale
demonstrateLinearScale();