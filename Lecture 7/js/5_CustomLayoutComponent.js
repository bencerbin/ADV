// CustomLayoutComponent.js
class CustomLayoutComponent {
    constructor(containerId) {
        this.containerId = containerId;
        this.svg = null;
        this.width = 800;
        this.height = 500;
        this.margin = { top: 40, right: 40, bottom: 40, left: 40 };
        this._data = [];
        this.layout = this.createLayout();
    }

    initialize() {
        // Clear any existing content
        d3.select(`#${this.containerId}`).selectAll("*").remove();
        
        this.svg = d3.select(`#${this.containerId}`)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        // Add title to visualization
        d3.select('#example-title').text('Custom Layout Visualization');

        // Add controls
        const controlsDiv = d3.select('#controls');
        controlsDiv.selectAll("*").remove(); // Clear existing controls
        
        controlsDiv.append('button')
            .text('Randomize')
            .on('click', () => {
                const newData = this._data.map(d => ({
                    label: d.label,
                    value: Math.random() * 100
                }));
                this.update(newData);
            });

        return this;
    }

    createLayout() {
        return () => {
            const spacing = 20;
            const cols = Math.ceil(Math.sqrt(this._data.length));
            const itemWidth = (this.width - this.margin.left - this.margin.right) / cols;
            const itemHeight = (this.height - this.margin.top - this.margin.bottom) / cols;

            return this._data.map((d, i) => ({
                x: this.margin.left + (i % cols) * itemWidth,
                y: this.margin.top + Math.floor(i / cols) * itemHeight,
                width: itemWidth - spacing,
                height: itemHeight - spacing,
                data: d
            }));
        };
    }

    setData(newData) {
        if (!arguments.length) return this._data;
        this._data = newData;
        return this;
    }

    render() {
        if (!this._data.length) {
            console.warn('No data to render');
            return this;
        }

        const layoutData = this.layout();

        // Remove existing elements
        this.svg.selectAll('.item').remove();

        // Create groups for each data item
        const items = this.svg.selectAll('.item')
            .data(layoutData)
            .enter()
            .append('g')
            .attr('class', 'item')
            .attr('transform', d => `translate(${d.x},${d.y})`);

        // Add rectangles
        items.append('rect')
            .attr('width', d => d.width)
            .attr('height', d => d.height)
            .attr('rx', 5)
            .attr('ry', 5)
            .style('fill', (d, i) => d3.interpolateViridis(i / layoutData.length));

        // Add labels
        items.append('text')
            .attr('x', d => d.width / 2)
            .attr('y', d => d.height / 2)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .style('fill', 'white')
            .text(d => d.data.label);

        // Add value labels
        items.append('text')
            .attr('x', d => d.width / 2)
            .attr('y', d => d.height * 0.7)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .style('fill', 'white')
            .style('font-size', '0.8em')
            .text(d => Math.round(d.data.value));

        return this;
    }

    addInteractions() {
        this.svg.selectAll('.item')
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('opacity', 0.8)
                    .select('rect')
                    .attr('transform', 'scale(1.05)');
            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('opacity', 1)
                    .select('rect')
                    .attr('transform', 'scale(1)');
            });

        return this;
    }

    update(newData) {
        this._data = newData;
        this.render();
        this.addInteractions();
        return this;
    }
}

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create sample data
    const sampleData = Array.from({ length: 16 }, (_, i) => ({
        label: `Item ${i + 1}`,
        value: Math.random() * 100
    }));

    // Initialize the component
    const layoutComponent = new CustomLayoutComponent('visualization');
    
    // Chain the initialization
    layoutComponent
        .initialize()
        .setData(sampleData)
        .render()
        .addInteractions();
});