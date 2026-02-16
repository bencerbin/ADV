// Set the title of the example
document.getElementById('example-title').textContent = 'Small Multiples';

// Generate sample data
const generateData = () => {
    const categories = ['A', 'B', 'C', 'D'];
    const data = [];
    
    categories.forEach(category => {
        // Generate 10 data points for each category
        for (let i = 0; i < 10; i++) {
            data.push({
                category: category,
                date: new Date(2024, i, 1), // Months from Jan to Oct
                value: Math.random() * 100
            });
        }
    });
    
    return data;
};

// Main function to create small multiples
function createSmallMultiples() {
    // Clear previous visualization
    d3.select('#visualization').html('');
    
    // Create a container for the small multiples with grid layout
    const container = d3.select('#visualization')
        .append('div')
        .style('display', 'grid')
        .style('grid-template-columns', 'repeat(auto-fit, minmax(200px, 1fr))')
        .style('gap', '20px')
        .style('padding', '20px');

    // Generate data
    const data = generateData();
    const categories = ['A', 'B', 'C', 'D'];
    
    // Dimensions for each small multiple
    const width = 180;
    const height = 120;
    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    
    // Create each small multiple
    categories.forEach(category => {
        const filteredData = data.filter(d => d.category === category);
        
        // Create SVG container
        const svg = container.append('div')
            .style('background', '#fff')
            .style('border', '1px solid #ddd')
            .style('border-radius', '4px')
            .style('padding', '10px')
            .append('svg')
            .attr('width', width)
            .attr('height', height);
            
        // Add category title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', margin.top / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text(`Category ${category}`);

        // Create scales
        const xScale = d3.scaleTime()
            .domain(d3.extent(filteredData, d => d.date))
            .range([margin.left, width - margin.right]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(filteredData, d => d.value)])
            .range([height - margin.bottom, margin.top]);

        // Create line generator
        const line = d3.line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.value));

        // Add the line path
        svg.append('path')
            .datum(filteredData)
            .attr('fill', 'none')
            .attr('stroke', '#007bff')
            .attr('stroke-width', 1.5)
            .attr('d', line);

        // Add axes
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale)
                .ticks(3)
                .tickFormat(d3.timeFormat('%b')));

        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale)
                .ticks(3)
                .tickFormat(d => Math.round(d)));
                
        // Add dots for data points
        svg.selectAll('circle')
            .data(filteredData)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d.date))
            .attr('cy', d => yScale(d.value))
            .attr('r', 3)
            .attr('fill', '#007bff')
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 5)
                    .attr('fill', '#0056b3');
                    
                // Show tooltip
                const tooltip = d3.select('body').append('div')
                    .attr('class', 'tooltip')
                    .style('opacity', 0);
                    
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
                    
                tooltip.html(`Date: ${d.date.toLocaleDateString()}<br/>Value: ${d.value.toFixed(1)}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 3)
                    .attr('fill', '#007bff');
                    
                // Remove tooltip
                d3.selectAll('.tooltip').remove();
            });
    });
}

// Add regenerate data button
d3.select('#controls')
    .append('button')
    .text('Regenerate Data')
    .on('click', createSmallMultiples);

// Initial creation
createSmallMultiples();