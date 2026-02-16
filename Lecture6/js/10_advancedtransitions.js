// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Set up the visualization space
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create SVG container with proper margins
    const svg = d3.select('#visualization')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Update the example title
    d3.select('#example-title').text('Advanced D3 Transitions');

    // Add controls with clear styling
    const controls = d3.select('#controls');
    
    controls.append('button')
        .text('Circle Transition')
        .on('click', demonstrateCircleTransition);

    controls.append('button')
        .text('Color Transition')
        .on('click', demonstrateColorTransition);

    controls.append('button')
        .text('Path Transition')
        .on('click', demonstratePathTransition);

    // Add initial shapes
    const centerX = width / 2;
    const centerY = height / 2;

    // Add a circle that will be used for demonstrations
    const circle = svg.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', 30)
        .attr('fill', 'blue');

    // Add a path for path transitions
    const path = svg.append('path')
        .attr('d', `M${centerX - 100},${centerY} L${centerX + 100},${centerY}`)
        .attr('stroke', 'black')
        .attr('stroke-width', 3)
        .attr('fill', 'none');

    // Circle Transition Demonstration
    function demonstrateCircleTransition() {
        circle.transition()
            .duration(1000)
            .attr('r', 60)
            .transition()
            .duration(1000)
            .attr('r', 30)
            .on('start', function() {
                console.log('Circle transition started');
            })
            .on('end', function() {
                console.log('Circle transition ended');
            });
    }

    // Color Transition Demonstration
    function demonstrateColorTransition() {
        circle.transition()
            .duration(1000)
            .style('fill', 'red')
            .transition()
            .duration(1000)
            .style('fill', 'blue');
    }

    // Path Transition Demonstration
    function demonstratePathTransition() {
        const startPath = `M${centerX - 100},${centerY} L${centerX + 100},${centerY}`;
        const endPath = `M${centerX - 100},${centerY} Q${centerX},${centerY - 100} ${centerX + 100},${centerY}`;

        path.transition()
            .duration(1000)
            .attr('d', endPath)
            .transition()
            .duration(1000)
            .attr('d', startPath);
    }

    // Add text to show what's happening
    const statusText = svg.append('text')
        .attr('x', 10)
        .attr('y', 20)
        .style('font-size', '14px')
        .text('Click the buttons above to see transitions!');

    // Function to update status text
    function updateStatus(message) {
        statusText.text(message);
    }

    // Add event listeners to update status text
    circle.on('mouseover', function() {
        updateStatus('Hover over circle detected!');
    }).on('mouseout', function() {
        updateStatus('Click the buttons above to see transitions!');
    });
});