// GridLayout.js
class GridLayout {
    constructor(config = {}) {
        // Default configuration
        this.width = config.width || 800;
        this.height = config.height || 600;
        this.padding = config.padding || 10;
        this.rows = config.rows || 5;
        this.cols = config.cols || 5;
        this.svg = null;
        this.container = null;
        this.data = [];
    }

    // Initialize the visualization
    initialize(containerId) {
        // Set up the SVG container
        this.container = d3.select(containerId);
        this.svg = this.container
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .append('g')
            .attr('transform', `translate(${this.padding}, ${this.padding})`);

        // Update example title
        d3.select('#example-title').text('Grid Layout Example');

        return this;
    }

    // Set data for the grid
    setData(data) {
        this.data = data;
        return this;
    }

    // Calculate grid cell dimensions
    calculateGrid() {
        const availableWidth = this.width - (2 * this.padding);
        const availableHeight = this.height - (2 * this.padding);
        
        return {
            cellWidth: availableWidth / this.cols,
            cellHeight: availableHeight / this.rows
        };
    }

    // Create grid cells
    render() {
        const { cellWidth, cellHeight } = this.calculateGrid();

        // Generate grid positions
        const gridData = [];
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                gridData.push({
                    x: col * cellWidth,
                    y: row * cellHeight,
                    width: cellWidth - this.padding,
                    height: cellHeight - this.padding,
                    row: row,
                    col: col
                });
            }
        }

        // Create grid cells
        const cells = this.svg.selectAll('.grid-cell')
            .data(gridData)
            .enter()
            .append('g')
            .attr('class', 'grid-cell')
            .attr('transform', d => `translate(${d.x}, ${d.y})`);

        // Add rectangles
        cells.append('rect')
            .attr('width', d => d.width)
            .attr('height', d => d.height)
            .attr('fill', 'white')
            .attr('stroke', '#ccc')
            .attr('rx', 4)
            .transition()
            .duration(750)
            .delay((d, i) => i * 50)
            .attr('fill', (d, i) => d3.schemeCategory10[i % 10]);

        // Add labels
        cells.append('text')
            .attr('x', d => d.width / 2)
            .attr('y', d => d.height / 2)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .style('font-size', '12px')
            .style('fill', 'white')
            .text((d, i) => `Cell ${i + 1}`);

        return this;
    }

    // Add interactivity
    addInteractivity() {
        this.svg.selectAll('.grid-cell')
            .on('mouseover', function(event, d) {
                d3.select(this).select('rect')
                    .transition()
                    .duration(200)
                    .attr('fill', '#ff9900');
            })
            .on('mouseout', function(event, d) {
                d3.select(this).select('rect')
                    .transition()
                    .duration(200)
                    .attr('fill', (d, i) => d3.schemeCategory10[i % 10]);
            })
            .on('click', function(event, d) {
                console.log(`Clicked cell at row ${d.row}, column ${d.col}`);
            });

        return this;
    }

    // Update grid configuration
    updateConfig(config) {
        Object.assign(this, config);
        this.svg.selectAll('*').remove();
        this.render();
        this.addInteractivity();
        return this;
    }
}

// Usage example
document.addEventListener('DOMContentLoaded', () => {
    // Create grid layout instance
    const grid = new GridLayout({
        width: 800,
        height: 600,
        padding: 10,
        rows: 4,
        cols: 4
    });

    // Initialize and render the grid
    grid.initialize('#visualization')
       .render()
       .addInteractivity();

    // Add controls
    const controls = d3.select('#controls');
    
    controls.append('button')
        .text('4x4 Grid')
        .on('click', () => grid.updateConfig({ rows: 4, cols: 4 }));
    
    controls.append('button')
        .text('5x5 Grid')
        .on('click', () => grid.updateConfig({ rows: 5, cols: 5 }));
    
    controls.append('button')
        .text('3x6 Grid')
        .on('click', () => grid.updateConfig({ rows: 3, cols: 6 }));
});