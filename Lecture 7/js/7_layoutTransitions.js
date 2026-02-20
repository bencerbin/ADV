// layoutTransitions.js
class LayoutTransitions {
    constructor(containerId, width = 800, height = 600) {
      this.containerId = containerId;
      this.width = width;
      this.height = height;
      this.margin = { top: 20, right: 20, bottom: 30, left: 40 };
      this.layouts = {
        grid: this.gridLayout.bind(this),
        circular: this.circularLayout.bind(this),
        random: this.randomLayout.bind(this)
      };
      this.currentLayout = 'grid';
      this.initialize();
    }
  
    // Initialize the visualization
    initialize() {
      // Create SVG container
      this.svg = d3.select(`#${this.containerId}`)
        .append('svg')
        .attr('width', this.width)
        .attr('height', this.height);
  
      // Add controls
      this.addControls();
  
      // Initialize with sample data
      this.data = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        value: Math.random() * 100
      }));
  
      // Create initial visualization
      this.updateVisualization();
    }
  
    // Add control buttons
    addControls() {
      const controls = d3.select('#controls');
      
      Object.keys(this.layouts).forEach(layout => {
        controls.append('button')
          .text(`${layout.charAt(0).toUpperCase() + layout.slice(1)} Layout`)
          .on('click', () => {
            this.currentLayout = layout;
            this.transitionLayout();
          });
      });
    }
  
    // Grid layout calculation
    gridLayout(data) {
      const cols = Math.ceil(Math.sqrt(data.length));
      const cellSize = Math.min(
        (this.width - this.margin.left - this.margin.right) / cols,
        (this.height - this.margin.top - this.margin.bottom) / cols
      );
  
      return data.map((d, i) => ({
        ...d,
        x: this.margin.left + (i % cols) * cellSize + cellSize / 2,
        y: this.margin.top + Math.floor(i / cols) * cellSize + cellSize / 2
      }));
    }
  
    // Circular layout calculation
    circularLayout(data) {
      const centerX = this.width / 2;
      const centerY = this.height / 2;
      const radius = Math.min(this.width, this.height) / 3;
  
      return data.map((d, i) => ({
        ...d,
        x: centerX + radius * Math.cos((i / data.length) * 2 * Math.PI),
        y: centerY + radius * Math.sin((i / data.length) * 2 * Math.PI)
      }));
    }
  
    // Random layout calculation
    randomLayout(data) {
      return data.map(d => ({
        ...d,
        x: this.margin.left + Math.random() * (this.width - this.margin.left - this.margin.right),
        y: this.margin.top + Math.random() * (this.height - this.margin.top - this.margin.bottom)
      }));
    }
  
    // Update visualization with transitions
    updateVisualization() {
      const circles = this.svg.selectAll('circle')
        .data(this.layouts[this.currentLayout](this.data), d => d.id);
  
      // Enter selection
      circles.enter()
        .append('circle')
        .attr('r', 10)
        .attr('fill', d => d3.interpolateViridis(d.value / 100))
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
  
      // Update selection
      circles
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
  
      // Exit selection
      circles.exit().remove();
    }
  
    // Handle layout transitions
    transitionLayout() {
      const circles = this.svg.selectAll('circle')
        .data(this.layouts[this.currentLayout](this.data), d => d.id);
  
      circles.transition()
        .duration(750)
        .ease(d3.easeQuadInOut)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    }
  
    // Public method to update data
    updateData(newData) {
      this.data = newData;
      this.updateVisualization();
    }
  }
  
  // Usage example:
  document.addEventListener('DOMContentLoaded', () => {
    // Set the title
    document.getElementById('example-title').textContent = 'Layout Transitions';
    
    // Initialize the component
    const layoutTransitions = new LayoutTransitions('visualization');
  });