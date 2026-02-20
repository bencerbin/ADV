// PackLayout.js
class PackLayout {
    constructor(containerId, width = 800, height = 600) {
        this.containerId = containerId;
        this.width = width;
        this.height = height;
        this.margin = { top: 20, right: 20, bottom: 20, left: 20 };
        this.svg = null;
        this.tooltip = null;
        this.circles = null;
        this.pack = null;
        
        // Color scale for different depths
        this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        
        // Initialize the visualization
        this.initialize();
    }

    initialize() {
        // Create SVG container
        this.svg = d3.select('#' + this.containerId)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        // Create tooltip
        this.tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        // Initialize pack layout
        this.pack = d3.pack()
            .size([this.width - this.margin.left - this.margin.right, 
                   this.height - this.margin.top - this.margin.bottom])
            .padding(3);

        // Update example title
        d3.select('#example-title').text('Circular Packing Visualization');
    }

    // Process data and create hierarchy
    processData(data) {
        const root = d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value);
        
        return this.pack(root);
    }

    // Main render function
    render(data) {
        const root = this.processData(data);
        const nodes = root.descendants();

        // Create circles for each node
        this.circles = this.svg.selectAll('circle')
            .data(nodes)
            .join('circle')
            .attr('cx', d => d.x + this.margin.left)
            .attr('cy', d => d.y + this.margin.top)
            .attr('r', d => d.r)
            .attr('fill', d => this.colorScale(d.depth))
            .attr('stroke', '#999')
            .attr('stroke-width', 1)
            .style('cursor', 'pointer');

        // Add interactivity
        this.addInteractions();
    }

    // Add interactive features
    addInteractions() {
        this.circles
            .on('mouseover', (event, d) => {
                this.tooltip.transition()
                    .duration(200)
                    .style('opacity', 0.9);
                
                this.tooltip.html(this.createTooltipContent(d))
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');

                d3.select(event.currentTarget)
                    .attr('stroke', '#000')
                    .attr('stroke-width', 2);
            })
            .on('mouseout', (event, d) => {
                this.tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);

                d3.select(event.currentTarget)
                    .attr('stroke', '#999')
                    .attr('stroke-width', 1);
            })
            .on('click', (event, d) => {
                // Add click interaction if needed
                console.log('Clicked node:', d);
            });
    }

    // Helper function to create tooltip content
    createTooltipContent(d) {
        return `
            <strong>Name:</strong> ${d.data.name}<br/>
            <strong>Value:</strong> ${d.value}<br/>
            <strong>Depth:</strong> ${d.depth}
        `;
    }

    // Update visualization with new data
    update(newData) {
        this.render(newData);
    }

    // Clean up
    destroy() {
        if (this.svg) {
            this.svg.remove();
        }
        if (this.tooltip) {
            this.tooltip.remove();
        }
    }
}

// Usage example:
document.addEventListener('DOMContentLoaded', () => {
    // Sample data structure
    const sampleData = {
        name: "root",
        children: [
            {
                name: "Group A",
                children: [
                    { name: "Subgroup A1", value: 20 },
                    { name: "Subgroup A2", value: 10 },
                    { name: "Subgroup A3", value: 30 }
                ]
            },
            {
                name: "Group B",
                children: [
                    { name: "Subgroup B1", value: 15 },
                    { name: "Subgroup B2", value: 25 }
                ]
            }
        ]
    };

    // Create instance of PackLayout
    const packLayout = new PackLayout('visualization');
    
    // Render the visualization
    packLayout.render(sampleData);
});