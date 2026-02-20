// SunburstChart.js
class SunburstChart {
    constructor(containerId, options = {}) {
      this.containerId = containerId;
      this.width = options.width || 800;
      this.height = options.height || 800;
      this.margin = options.margin || { top: 10, right: 10, bottom: 10, left: 10 };
      this.radius = Math.min(this.width - this.margin.left - this.margin.right,
                            this.height - this.margin.top - this.margin.bottom) / 2;
      this.transitionDuration = options.transitionDuration || 750;
      this.colors = options.colors || d3.schemeCategory10;
      this.tooltip = options.tooltip || true;
  
      this.initialize();
    }
  
    initialize() {
      // Create SVG container
      this.svg = d3.select(`#${this.containerId}`)
        .append('svg')
          .attr('width', this.width)
          .attr('height', this.height)
        .append('g')
          .attr('transform', `translate(${this.width / 2},${this.height / 2})`);
  
      // Initialize partition layout
      this.partition = d3.partition()
        .size([2 * Math.PI, this.radius]);
  
      // Initialize arc generator
      this.arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .innerRadius(d => d.y0)
        .outerRadius(d => d.y1);
  
      // Initialize color scale
      this.colorScale = d3.scaleOrdinal(this.colors);
  
      // Initialize tooltip if enabled
      if (this.tooltip) {
        this.tooltipDiv = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('opacity', 0);
      }
    }
  
    // Process data into hierarchical structure
    processData(data) {
      return d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);
    }
  
    // Main render function
    render(data) {
      const root = this.processData(data);
      const nodes = this.partition(root).descendants();
  
      // Join data with path elements
      const paths = this.svg.selectAll('path')
        .data(nodes, d => d.data.name);
  
      // Handle enter selection
      const pathsEnter = paths.enter()
        .append('path')
        .attr('d', this.arc)
        .style('fill', d => this.colorScale(d.data.name))
        .style('opacity', 0)
        .on('mouseover', (event, d) => this.handleMouseOver(event, d))
        .on('mouseout', (event, d) => this.handleMouseOut(event, d))
        .on('click', (event, d) => this.handleClick(event, d));
  
      // Handle update selection
      paths
        .transition()
        .duration(this.transitionDuration)
        .attr('d', this.arc)
        .style('fill', d => this.colorScale(d.data.name))
        .style('opacity', 1);
  
      // Handle exit selection
      paths.exit()
        .transition()
        .duration(this.transitionDuration)
        .style('opacity', 0)
        .remove();
  
      // Merge enter and update selections
      paths.merge(pathsEnter)
        .transition()
        .duration(this.transitionDuration)
        .attr('d', this.arc)
        .style('opacity', 1);
    }
  
    // Event handlers
    handleMouseOver(event, d) {
      if (this.tooltip) {
        this.tooltipDiv.transition()
          .duration(200)
          .style('opacity', .9);
        
        this.tooltipDiv.html(`
          <strong>${d.data.name}</strong><br/>
          Value: ${d.value}<br/>
          Depth: ${d.depth}
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      }
  
      // Highlight current path
      d3.select(event.currentTarget)
        .transition()
        .duration(200)
        .style('opacity', 0.8)
        .style('stroke', '#fff')
        .style('stroke-width', '2px');
    }
  
    handleMouseOut(event, d) {
      if (this.tooltip) {
        this.tooltipDiv.transition()
          .duration(500)
          .style('opacity', 0);
      }
  
      // Reset path style
      d3.select(event.currentTarget)
        .transition()
        .duration(200)
        .style('opacity', 1)
        .style('stroke', 'none');
    }
  
    handleClick(event, d) {
      // Implement zoom functionality here if desired
      this.dispatchEvent('click', d);
    }
  
    // Custom event dispatcher
    dispatchEvent(eventName, data) {
      const event = new CustomEvent(`sunburst:${eventName}`, { detail: data });
      document.dispatchEvent(event);
    }
  
    // Update methods
    updateColors(newColors) {
      this.colors = newColors;
      this.colorScale.range(newColors);
      this.svg.selectAll('path')
        .transition()
        .duration(this.transitionDuration)
        .style('fill', d => this.colorScale(d.data.name));
    }
  
    updateSize(width, height) {
      this.width = width;
      this.height = height;
      this.radius = Math.min(this.width - this.margin.left - this.margin.right,
                            this.height - this.margin.top - this.margin.bottom) / 2;
  
      d3.select(`#${this.containerId} svg`)
        .attr('width', this.width)
        .attr('height', this.height);
  
      this.svg.attr('transform', `translate(${this.width / 2},${this.height / 2})`);
      this.partition.size([2 * Math.PI, this.radius]);
    }
  }
  
  // Usage example:
  document.addEventListener('DOMContentLoaded', () => {
    // Sample hierarchical data
    const data = {
      name: "root",
      children: [
        {
          name: "Category A",
          children: [
            { name: "Sub A1", value: 20 },
            { name: "Sub A2", value: 10 },
            { name: "Sub A3", value: 30 }
          ]
        },
        {
          name: "Category B",
          children: [
            { name: "Sub B1", value: 15 },
            { name: "Sub B2", value: 25 }
          ]
        },
        { name: "Category C", value: 40 }
      ]
    };
  
    // Create sunburst chart instance
    const sunburst = new SunburstChart('visualization', {
      width: 800,
      height: 800,
      colors: d3.schemeSet3
    });
  
    // Render the chart
    sunburst.render(data);
  
    // Example of listening to custom events
    document.addEventListener('sunburst:click', (event) => {
      console.log('Clicked node:', event.detail);
    });
  });