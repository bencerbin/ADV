// ForceParameters.js
// force-directed-graph.js

// Set the title in the existing HTML
document.getElementById('example-title').textContent = 'Force Directed Graph';

class ForceGraph {
    constructor() {
        // Set fixed dimensions for testing
        this.width = 800;
        this.height = 600;
        
        // Create SVG with fixed dimensions
        this.svg = d3.select('#visualization')
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .style('border', '1px solid #ccc'); // Add border to see the boundaries
            
        // Create a group for the graph
        this.g = this.svg.append('g');
        
        // Initialize data
        this.generateData();
        
        // Initialize the simulation
        this.initializeSimulation();
        
        // Create controls
        this.createControls();
        
        // Initial render
        this.updateVisualization();
        
        // Add zoom behavior after everything else
        this.zoom = d3.zoom()
            .on('zoom', (event) => {
                this.g.attr('transform', event.transform);
            });
        this.svg.call(this.zoom);
    }
    
    generateData() {
        // Generate a small dataset first to ensure it works
        this.nodes = [
            { id: 0, group: 0 },
            { id: 1, group: 1 },
            { id: 2, group: 1 },
            { id: 3, group: 2 }
        ];
        
        this.links = [
            { source: 0, target: 1 },
            { source: 1, target: 2 },
            { source: 2, target: 3 },
            { source: 3, target: 0 }
        ];
        
        console.log('Generated Data:', { nodes: this.nodes, links: this.links });
    }
    
    initializeSimulation() {
        // Create simulation with fixed center
        this.simulation = d3.forceSimulation(this.nodes)
            .force('charge', d3.forceManyBody().strength(-30))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force('link', d3.forceLink(this.links).id(d => d.id).distance(50))
            .force('collide', d3.forceCollide(10))
            .on('tick', () => this.ticked());
            
        console.log('Simulation initialized');
    }
    
    createControls() {
        const controls = d3.select('#controls').html(''); // Clear existing controls
        
        // Add sliders
        this.addSliderControl(controls, {
            label: 'Charge Strength',
            min: -100,
            max: 0,
            value: -30,
            step: 1,
            onChange: (value) => {
                this.simulation.force('charge').strength(value);
                this.simulation.alpha(1).restart();
            }
        });
        
        // Add button to generate more nodes
        controls.append('button')
            .text('Add Nodes')
            .on('click', () => {
                // Add a new node connected to a random existing node
                const newId = this.nodes.length;
                const targetId = Math.floor(Math.random() * this.nodes.length);
                
                this.nodes.push({ id: newId, group: Math.floor(Math.random() * 3) });
                this.links.push({ source: newId, target: targetId });
                
                this.updateVisualization();
            });
    }
    
    addSliderControl(container, options) {
        const control = container.append('div')
            .style('margin', '10px 0');
            
        control.append('label')
            .text(options.label + ': ')
            .style('display', 'inline-block')
            .style('width', '120px');
            
        const value = control.append('span')
            .text(options.value)
            .style('margin-right', '10px');
            
        control.append('input')
            .attr('type', 'range')
            .attr('min', options.min)
            .attr('max', options.max)
            .attr('value', options.value)
            .attr('step', options.step)
            .style('width', '200px')
            .on('input', function() {
                const val = +this.value;
                value.text(val);
                options.onChange(val);
            });
    }
    
    updateVisualization() {
        console.log('Updating visualization');
        
        // Update links
        this.link = this.g.selectAll('.link')
            .data(this.links)
            .join('line')
            .attr('class', 'link')
            .style('stroke', '#999')
            .style('stroke-width', 1);
            
        // Update nodes
        this.node = this.g.selectAll('.node')
            .data(this.nodes)
            .join('circle')
            .attr('class', 'node')
            .attr('r', 8)
            .style('fill', d => d3.schemeCategory10[d.group])
            .style('stroke', '#fff')
            .style('stroke-width', 1.5)
            .call(this.drag());
            
        // Add labels
        this.label = this.g.selectAll('.label')
            .data(this.nodes)
            .join('text')
            .attr('class', 'label')
            .text(d => d.id)
            .style('font-size', '8px')
            .style('text-anchor', 'middle')
            .style('dominant-baseline', 'middle')
            .style('pointer-events', 'none');
            
        // Update simulation
        this.simulation.nodes(this.nodes);
        this.simulation.force('link').links(this.links);
        this.simulation.alpha(1).restart();
        
        console.log('Visualization updated');
    }
    
    ticked() {
        // Constrain nodes to visualization bounds
        this.nodes.forEach(node => {
            node.x = Math.max(10, Math.min(this.width - 10, node.x));
            node.y = Math.max(10, Math.min(this.height - 10, node.y));
        });
        
        // Update link positions
        if (this.link) {
            this.link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
        }
        
        // Update node positions
        if (this.node) {
            this.node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
        }
        
        // Update label positions
        if (this.label) {
            this.label
                .attr('x', d => d.x)
                .attr('y', d => d.y);
        }
    }
    
    drag() {
        return d3.drag()
            .on('start', (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on('drag', (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on('end', (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            });
    }
}

// Create the visualization when the page loads
window.addEventListener('load', () => {
    console.log('Creating force graph');
    const forceGraph = new ForceGraph();
});