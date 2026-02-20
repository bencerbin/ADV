// ForceDirectedGraph.js
class EnhancedForceDirectedGraph {
    constructor(containerId, width = 1200, height = 800) {
        this.containerId = containerId;
        this.width = width;
        this.height = height;
        
        // Enhanced default parameters
        this.nodeRadius = 8;
        this.linkDistance = 100;
        this.chargeStrength = -50;
        this.collisionRadius = 15;
        this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        this.zoomExtent = [0.1, 10];
        this.selectedNode = null;
        
        this.initializeSVG();
        this.initializeForces();
        this.initializeControls();
        this.setupEventListeners();
    }

    initializeSVG() {
        // Create the main SVG container with zoom behavior
        this.svg = d3.select(`#${this.containerId}`)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        // Add zoom behavior
        this.zoom = d3.zoom()
            .scaleExtent(this.zoomExtent)
            .on('zoom', (event) => {
                this.container.attr('transform', event.transform);
            });

        this.svg.call(this.zoom);

        // Create a container for all graph elements
        this.container = this.svg.append('g');
        
        // Create groups for different elements
        this.linkLabelsGroup = this.container.append('g').attr('class', 'link-labels');
        this.linksGroup = this.container.append('g').attr('class', 'links');
        this.nodesGroup = this.container.append('g').attr('class', 'nodes');
        this.nodeLabelsGroup = this.container.append('g').attr('class', 'node-labels');

        // Initialize tooltip
        this.tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);
    }

    initializeForces() {
        // Set up the force simulation with multiple forces
        this.simulation = d3.forceSimulation()
            .force('charge', d3.forceManyBody().strength(this.chargeStrength))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force('link', d3.forceLink().distance(this.linkDistance).id(d => d.id))
            .force('collision', d3.forceCollide(this.collisionRadius))
            .force('x', d3.forceX())
            .force('y', d3.forceY())
            .on('tick', () => this.ticked());
    }

    initializeControls() {
        // Create control panel
        const controls = d3.select(`#${this.containerId}`)
            .append('div')
            .attr('class', 'controls')
            .style('position', 'absolute')
            .style('top', '10px')
            .style('left', '10px');

        // Add zoom controls
        controls.append('button')
            .text('Zoom In')
            .on('click', () => this.zoom.scaleBy(this.svg.transition().duration(750), 1.2));

        controls.append('button')
            .text('Zoom Out')
            .on('click', () => this.zoom.scaleBy(this.svg.transition().duration(750), 0.8));

        controls.append('button')
            .text('Reset')
            .on('click', () => this.resetView());

        // Add force control sliders
        this.addForceControl(controls, 'Charge Strength', -100, 0, this.chargeStrength, 
            value => this.updateForceParameter('charge', value));
        
        this.addForceControl(controls, 'Link Distance', 30, 300, this.linkDistance,
            value => this.updateForceParameter('linkDistance', value));
    }

    addForceControl(container, label, min, max, defaultValue, callback) {
        const control = container.append('div')
            .style('margin', '10px');

        control.append('label')
            .text(`${label}: `)
            .style('margin-right', '10px');

        control.append('input')
            .attr('type', 'range')
            .attr('min', min)
            .attr('max', max)
            .attr('value', defaultValue)
            .on('input', function() {
                callback(+this.value);
            });
    }

    setupEventListeners() {
        // Add window resize handler
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        // Update width and height based on container
        const container = document.getElementById(this.containerId);
        this.width = container.clientWidth;
        this.height = container.clientHeight;

        // Update SVG dimensions
        this.svg
            .attr('width', this.width)
            .attr('height', this.height);

        // Update force center
        this.simulation.force('center')
            .x(this.width / 2)
            .y(this.height / 2);

        // Restart simulation
        this.simulation.alpha(0.3).restart();
    }

    setData(nodes, links) {
        this.nodes = nodes.map(d => ({...d})); // Create copies of the data
        this.links = links.map(d => ({...d}));
        
        // Enhance nodes with additional properties
        this.nodes.forEach(node => {
            node.degree = this.links.filter(l => 
                l.source === node.id || l.target === node.id
            ).length;
        });

        // Update simulation with new data
        this.simulation.nodes(this.nodes);
        this.simulation.force('link').links(this.links);
        
        this.render();
    }

    render() {
        // Render links
        const link = this.linksGroup
            .selectAll('line')
            .data(this.links)
            .join('line')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', d => Math.sqrt(d.value || 1));

        // Render link labels
        const linkLabel = this.linkLabelsGroup
            .selectAll('text')
            .data(this.links)
            .join('text')
            .text(d => d.label || '')
            .attr('font-size', '8px')
            .attr('text-anchor', 'middle')
            .attr('dy', -5);

        // Render nodes
        const node = this.nodesGroup
            .selectAll('circle')
            .data(this.nodes)
            .join('circle')
            .attr('r', d => this.nodeRadius * (1 + Math.sqrt(d.degree || 1) / 5))
            .attr('fill', d => this.colorScale(d.group || 0))
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .call(this.drag())
            .on('mouseover', (event, d) => this.handleMouseOver(event, d))
            .on('mouseout', (event, d) => this.handleMouseOut(event, d))
            .on('click', (event, d) => this.handleNodeClick(event, d));

        // Render node labels
        const nodeLabel = this.nodeLabelsGroup
            .selectAll('text')
            .data(this.nodes)
            .join('text')
            .text(d => d.label || d.id)
            .attr('font-size', '10px')
            .attr('text-anchor', 'middle')
            .attr('dy', 20);

        // Add titles for accessibility
        node.append('title')
            .text(d => d.label || d.id);
    }

    handleNodeClick(event, d) {
        if (this.selectedNode === d) {
            // Deselect node
            this.selectedNode = null;
            this.highlightNode(null);
        } else {
            // Select node
            this.selectedNode = d;
            this.highlightNode(d);
        }
    }

    highlightNode(node) {
        // Reset all nodes and links
        this.nodesGroup.selectAll('circle')
            .attr('opacity', 1)
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5);

        this.linksGroup.selectAll('line')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', d => Math.sqrt(d.value || 1));

        if (node) {
            // Get connected nodes and links
            const connectedNodeIds = this.links
                .filter(l => l.source.id === node.id || l.target.id === node.id)
                .flatMap(l => [l.source.id, l.target.id]);

            // Highlight selected node and its connections
            this.nodesGroup.selectAll('circle')
                .attr('opacity', d => 
                    d.id === node.id || connectedNodeIds.includes(d.id) ? 1 : 0.1);

            this.linksGroup.selectAll('line')
                .attr('stroke-opacity', l => 
                    l.source.id === node.id || l.target.id === node.id ? 1 : 0.1)
                .attr('stroke', l => 
                    l.source.id === node.id || l.target.id === node.id ? '#ff0000' : '#999')
                .attr('stroke-width', l => 
                    l.source.id === node.id || l.target.id === node.id 
                        ? Math.sqrt(l.value || 1) * 2 
                        : Math.sqrt(l.value || 1));
        }
    }

    handleMouseOver(event, d) {
        // Show tooltip
        this.tooltip.transition()
            .duration(200)
            .style('opacity', .9);
        
        this.tooltip.html(`
            <strong>${d.label || d.id}</strong><br/>
            Group: ${d.group || 'N/A'}<br/>
            Connections: ${d.degree}<br/>
            ${d.description || ''}
        `)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px');

        // Highlight node temporarily
        if (!this.selectedNode) {
            this.highlightNode(d);
        }
    }

    handleMouseOut(event, d) {
        // Hide tooltip
        this.tooltip.transition()
            .duration(500)
            .style('opacity', 0);

        // Reset highlights if no node is selected
        if (!this.selectedNode) {
            this.highlightNode(null);
        }
    }

    ticked() {
        // Update link positions
        this.linksGroup.selectAll('line')
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        // Update link label positions
        this.linkLabelsGroup.selectAll('text')
            .attr('x', d => (d.source.x + d.target.x) / 2)
            .attr('y', d => (d.source.y + d.target.y) / 2);

        // Update node positions
        this.nodesGroup.selectAll('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

        // Update node label positions
        this.nodeLabelsGroup.selectAll('text')
            .attr('x', d => d.x)
            .attr('y', d => d.y);
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

    updateForceParameter(forceName, value) {
        switch (forceName) {
            case 'charge':
                this.simulation.force('charge').strength(value);
                break;
            case 'linkDistance':
                this.simulation.force('link').distance(value);
                break;
        }
        this.simulation.alpha(0.3).restart();
    }

    resetView() {
        this.svg.transition()
            .duration(750)
            .call(this.zoom.transform, d3.zoomIdentity);
        
        this.selectedNode = null;
        this.highlightNode(null);
    }
}

// Example usage:
const graph = new EnhancedForceDirectedGraph('visualization');

// Generate larger sample dataset
const generateSampleData = (nodeCount = 50, linkCount = 100) => {
    const nodes = Array.from({ length: nodeCount }, (_, i) => ({
        id: i,
        label: `Node ${i}`,
        group: Math.floor(Math.random() * 5),
        description: `This is node ${i} with some sample data`
    }));

    const links = Array.from({ length: linkCount }, () => {
        const source = Math.floor(Math.random() * nodeCount);
        let target;
        do {
            target = Math.floor(Math.random() * nodeCount);
        } while (source === target);

        return {
            source,
            target,
            value: Math.random() * 10,
            label: `Link ${source}-${target}`
        };
    });

    return { nodes, links };
};

// Set the data
const { nodes, links } = generateSampleData();
graph.setData(nodes, links);