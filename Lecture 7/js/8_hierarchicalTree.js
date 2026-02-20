// hierarchicalTree.js
class HierarchicalTreeVis {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            width: options.width || 800,
            height: options.height || 600,
            margin: options.margin || { top: 20, right: 90, bottom: 30, left: 90 },
            nodeRadius: options.nodeRadius || 5,
            duration: options.duration || 750
        };
        
        this.svg = null;
        this.treeLayout = null;
        this.root = null;
        this.i = 0; // Unique identifier counter for nodes
        
        this.initialize();
    }

    initialize() {
        // Set up the SVG container
        this.svg = d3.select(`#${this.containerId}`)
            .append("svg")
            .attr("width", this.options.width)
            .attr("height", this.options.height)
            .append("g")
            .attr("transform", `translate(${this.options.margin.left},${this.options.margin.top})`);

        // Initialize the tree layout
        this.treeLayout = d3.tree()
            .size([
                this.options.height - this.options.margin.top - this.options.margin.bottom,
                this.options.width - this.options.margin.left - this.options.margin.right
            ]);
    }

    // Load and process data
    loadData(data) {
        // Create hierarchy from data
        this.root = d3.hierarchy(data, d => d.children);
        
        // Assign initial positions
        this.root.x0 = this.options.height / 2;
        this.root.y0 = 0;
        
        // Initialize the display
        this.update(this.root);
    }

    // Update the visualization
    update(source) {
        // Generate the new tree layout
        const treeData = this.treeLayout(this.root);
        const nodes = treeData.descendants();
        const links = treeData.links();

        // Normalize for fixed-depth
        nodes.forEach(d => {
            d.y = d.depth * 180;
        });

        // ****************** Nodes section ***************************
        // Update the nodes
        const node = this.svg.selectAll('g.node')
            .data(nodes, d => d.id || (d.id = ++this.i));

        // Enter any new nodes at the parent's previous position
        const nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr("transform", d => `translate(${source.y0},${source.x0})`)
            .on('click', (event, d) => {
                this.click(d);
            });

        // Add Circle for the nodes
        nodeEnter.append('circle')
            .attr('class', 'node')
            .attr('r', 1e-6)
            .style("fill", d => d._children ? "lightsteelblue" : "#fff")
            .style("stroke", "steelblue")
            .style("stroke-width", "2px");

        // Add labels for the nodes
        nodeEnter.append('text')
            .attr("dy", ".35em")
            .attr("x", d => d.children || d._children ? -13 : 13)
            .attr("text-anchor", d => d.children || d._children ? "end" : "start")
            .text(d => d.data.name);

        // UPDATE
        const nodeUpdate = nodeEnter.merge(node);

        // Transition to the proper position for the nodes
        nodeUpdate.transition()
            .duration(this.options.duration)
            .attr("transform", d => `translate(${d.y},${d.x})`);

        // Update the node attributes and style
        nodeUpdate.select('circle.node')
            .attr('r', this.options.nodeRadius)
            .style("fill", d => d._children ? "lightsteelblue" : "#fff")
            .attr('cursor', 'pointer');

        // Remove any exiting nodes
        const nodeExit = node.exit().transition()
            .duration(this.options.duration)
            .attr("transform", d => `translate(${source.y},${source.x})`)
            .remove();

        nodeExit.select('circle')
            .attr('r', 1e-6);

        nodeExit.select('text')
            .style('fill-opacity', 1e-6);

        // ****************** links section ***************************
        // Update the links
        const link = this.svg.selectAll('path.link')
            .data(links, d => d.target.id);

        // Enter any new links at the parent's previous position
        const linkEnter = link.enter().insert('path', "g")
            .attr("class", "link")
            .style("fill", "none")
            .style("stroke", "#ccc")
            .style("stroke-width", "2px")
            .attr('d', d => {
                const o = {x: source.x0, y: source.y0};
                return this.diagonal(o, o);
            });

        // UPDATE
        const linkUpdate = linkEnter.merge(link);

        // Transition back to the parent element position
        linkUpdate.transition()
            .duration(this.options.duration)
            .attr('d', d => this.diagonal(d, d.parent));

        // Remove any exiting links
        link.exit().transition()
            .duration(this.options.duration)
            .attr('d', d => {
                const o = {x: source.x, y: source.y};
                return this.diagonal(o, o);
            })
            .remove();
    }

    // Creates a curved (diagonal) path from parent to the child nodes
    diagonal(s, d) {
        return `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`;
    }

    // Toggle children on click
    click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        this.update(d);
    }
}

// Example usage:
document.addEventListener('DOMContentLoaded', () => {
    // Set the title
    document.getElementById('example-title').textContent = 'Hierarchical Tree Visualization';

    // Sample data
    const treeData = {
        name: "Root",
        children: [
            {
                name: "Level 1 A",
                children: [
                    { name: "Level 2 A-1" },
                    { name: "Level 2 A-2" }
                ]
            },
            {
                name: "Level 1 B",
                children: [
                    { name: "Level 2 B-1" },
                    { name: "Level 2 B-2" }
                ]
            }
        ]
    };

    // Create and initialize the tree visualization
    const treeVis = new HierarchicalTreeVis('visualization', {
        width: 960,
        height: 500
    });
    
    // Load the data
    treeVis.loadData(treeData);
});