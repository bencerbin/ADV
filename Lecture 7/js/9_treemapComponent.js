// TreemapComponent.js
class TreemapComponent {
    constructor(containerId, options = {}) {
      this.containerId = containerId;
      this.width = options.width || 800;
      this.height = options.height || 600;
      this.padding = options.padding || 1;
      this.transitionDuration = options.transitionDuration || 750;
      this.colorScale = options.colorScale || d3.scaleOrdinal(d3.schemeCategory10);
      
      // Initialize the SVG container
      this.svg = d3.select(`#${containerId}`)
        .append('svg')
        .attr('width', this.width)
        .attr('height', this.height);
        
      // Create tooltip div
      this.tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
        
      // Initialize treemap layout
      this.treemap = d3.treemap()
        .size([this.width, this.height])
        .padding(this.padding);
    }
  
    // Process data and create hierarchy
    processData(data) {
      this.root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);
        
      this.treemap(this.root);
      return this;
    }
  
    // Render the treemap
    render() {
      // Remove existing elements for rerender
      this.svg.selectAll('.cell').remove();
  
      // Create cell groups
      const cell = this.svg.selectAll('.cell')
        .data(this.root.leaves())
        .enter()
        .append('g')
        .attr('class', 'cell')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);
  
      // Add rectangles to cells
      cell.append('rect')
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', d => this.colorScale(d.parent.data.name))
        .on('mouseover', (event, d) => this.handleMouseOver(event, d))
        .on('mouseout', (event, d) => this.handleMouseOut(event, d));
  
      // Add text labels
      cell.append('text')
        .attr('x', 5)
        .attr('y', 20)
        .text(d => this.truncateText(d.data.name, d.x1 - d.x0))
        .attr('font-size', '12px')
        .attr('fill', 'white');
  
      return this;
    }
  
    // Handle mouse over event
    handleMouseOver(event, d) {
      this.tooltip.transition()
        .duration(200)
        .style('opacity', .9);
        
      this.tooltip.html(
        `Name: ${d.data.name}<br/>` +
        `Value: ${d.value}<br/>` +
        `Parent: ${d.parent.data.name}`
      )
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 28) + 'px');
  
      d3.select(event.currentTarget)
        .transition()
        .duration(200)
        .attr('fill-opacity', 0.7);
    }
  
    // Handle mouse out event
    handleMouseOut(event, d) {
      this.tooltip.transition()
        .duration(500)
        .style('opacity', 0);
  
      d3.select(event.currentTarget)
        .transition()
        .duration(200)
        .attr('fill-opacity', 1);
    }
  
    // Helper function to truncate text
    truncateText(text, width) {
      if (text.length * 7 > width) {
        return text.slice(0, Math.floor(width / 7)) + '...';
      }
      return text;
    }
  
    // Update data and re-render
    update(newData) {
      this.processData(newData);
      this.render();
      return this;
    }
  
    // Clean up resources
    destroy() {
      this.svg.remove();
      this.tooltip.remove();
    }
  }
  
  // Example usage:
  const sampleData = {
    name: "root",
    children: [
      {
        name: "Category A",
        children: [
          { name: "Sub-A1", value: 20 },
          { name: "Sub-A2", value: 10 },
          { name: "Sub-A3", value: 30 }
        ]
      },
      {
        name: "Category B",
        children: [
          { name: "Sub-B1", value: 15 },
          { name: "Sub-B2", value: 25 }
        ]
      }
    ]
  };
  
  // Initialize and render the treemap
  const treemap = new TreemapComponent('visualization', {
    width: 800,
    height: 600,
    padding: 2
  });
  
  treemap.processData(sampleData).render();
  
  // Example of updating with new data
  setTimeout(() => {
    const newData = {
      name: "root",
      children: [
        {
          name: "Category X",
          children: [
            { name: "Sub-X1", value: 40 },
            { name: "Sub-X2", value: 20 }
          ]
        },
        {
          name: "Category Y",
          children: [
            { name: "Sub-Y1", value: 30 },
            { name: "Sub-Y2", value: 10 },
            { name: "Sub-Y3", value: 25 }
          ]
        }
      ]
    };
    treemap.update(newData);
  }, 3000);