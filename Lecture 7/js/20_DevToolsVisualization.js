// DevToolsVisualization.js
// DevelopmentToolsDemo.js
class DevelopmentToolsDemo {
    constructor(containerId) {
        this.containerId = containerId;
        
        // Demonstrate console group
        console.group('Initialization');
        console.log('Creating new DevelopmentToolsDemo instance');
        console.log('Container ID:', containerId);
        console.groupEnd();
    }

    init() {
        // Demonstrate performance timing
        console.time('initialization');

        // Demonstrate try-catch error handling
        try {
            this.container = d3.select(`#${this.containerId}`);
            if (this.container.empty()) {
                throw new Error(`Container #${this.containerId} not found`);
            }
        } catch (error) {
            console.error('Initialization Error:', error);
            return;
        }

        // Create simple shapes to demonstrate debugging
        this.createDebuggingExamples();
        
        console.timeEnd('initialization');
    }

    createDebuggingExamples() {
        // Demonstrate console.table with data
        const data = [
            { id: 1, shape: 'circle', color: 'red' },
            { id: 2, shape: 'rectangle', color: 'blue' },
            { id: 3, shape: 'triangle', color: 'green' }
        ];
        console.table(data, ['id', 'shape', 'color']);

        // Create SVG container
        const svg = this.container.append('svg')
            .attr('width', 400)
            .attr('height', 200);

        // Demonstrate debugger statement
        debugger; // Students can examine variables here

        // Add shapes with performance measurement
        performance.mark('startShapes');

        // Add circles
        this.addCircles(svg, data);

        // Add rectangles
        this.addRectangles(svg, data);

        performance.mark('endShapes');
        performance.measure('Shapes Creation', 'startShapes', 'endShapes');
    }

    addCircles(svg, data) {
        // Demonstrate console.count
        console.count('addCircles called');

        // Add warning for demonstration
        console.warn('Adding circles - check rendering performance');

        const circles = svg.selectAll('.demo-circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'demo-circle')
            .attr('cx', (d, i) => 50 + i * 100)
            .attr('cy', 50)
            .attr('r', 20)
            .style('fill', d => d.color);

        // Demonstrate console.trace
        console.trace('Circles added');
    }

    addRectangles(svg, data) {
        // Demonstrate console.count
        console.count('addRectangles called');

        // Add info for demonstration
        console.info('Adding rectangles - demonstrating different console methods');

        const rectangles = svg.selectAll('.demo-rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'demo-rect')
            .attr('x', (d, i) => 30 + i * 100)
            .attr('y', 100)
            .attr('width', 40)
            .attr('height', 40)
            .style('fill', d => d.color);

        // Demonstrate console.assert
        console.assert(rectangles.size() === data.length, 
            'Not all rectangles were created');
    }

    // Method to demonstrate error handling
    simulateError() {
        try {
            // Intentionally cause an error
            const nonExistentElement = this.container.select('.non-existent')
                .style('color', 'red');
            
            console.log('This line will not execute');
        } catch (error) {
            console.error('Simulated Error:', error);
            // Log error details
            console.dir(error);
        }
    }

    // Method to demonstrate performance monitoring
    demonstratePerformance() {
        // Start performance monitoring
        performance.mark('startOperation');

        // Perform some operations
        for (let i = 0; i < 1000; i++) {
            this.container.append('div')
                .style('width', '1px')
                .style('height', '1px')
                .remove();
        }

        // End performance monitoring
        performance.mark('endOperation');
        performance.measure('Complex Operation', 'startOperation', 'endOperation');

        // Log performance entries
        const measures = performance.getEntriesByType('measure');
        console.table(measures);
    }
}

// Initialize with debugging tools demonstration
document.addEventListener('DOMContentLoaded', () => {
    // Update title
    document.getElementById('example-title').textContent = 'Development Tools Demo';

    // Create instance with console grouping
    console.group('Demo Initialization');
    const demo = new DevelopmentToolsDemo('visualization');
    demo.init();
    console.groupEnd();

    // Add controls for demonstration
    const controls = d3.select('#controls');
    
    controls.append('button')
        .text('Simulate Error')
        .on('click', () => demo.simulateError());

    controls.append('button')
        .text('Test Performance')
        .on('click', () => demo.demonstratePerformance());

    // Add instructions for students
    console.log('%c Development Tools Demo Instructions', 'font-size: 14px; font-weight: bold; color: blue;');
    console.log('1. Open Chrome DevTools (F12)');
    console.log('2. Examine the Console outputs');
    console.log('3. Use the Performance tab to analyze measurements');
    console.log('4. Set breakpoints in the Sources tab');
    console.log('5. Try the Network tab to monitor data loading');
});