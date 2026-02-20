// tree.js
// treeVisualization.js

// First, let's define our sample data structure
const treeData = {
    "name": "Root",
    "children": [
        {
            "name": "Level 1: A",
            "children": [
                { "name": "Level 2: A1" },
                { "name": "Level 2: A2" }
            ]
        },
        {
            "name": "Level 1: B",
            "children": [
                { "name": "Level 2: B1" },
                { "name": "Level 2: B2" }
            ]
        }
    ]
};

// Main visualization code
document.addEventListener('DOMContentLoaded', function() {
    // Set the dimensions and margins of the diagram
    const margin = {top: 20, right: 90, bottom: 30, left: 90};
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Clear any existing SVG
    d3.select("#visualization").selectAll("*").remove();

    // Append the SVG object to the visualization div
    const svg = d3.select("#visualization").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Declares a tree layout and assigns the size
    const treemap = d3.tree().size([height, width]);

    // Assigns parent, children, height, depth
    let root = d3.hierarchy(treeData, d => d.children);
    root.x0 = height / 2;
    root.y0 = 0;

    // Collapse function to hide children
    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    // Collapse the root's children initially
    if (root.children) {
        root.children.forEach(collapse);
    }

    let i = 0; // Used for node ids
    
    // Update function to handle the visualization update
    function update(source) {
        // Assigns the x and y position for the nodes
        const treeData = treemap(root);

        // Compute the new tree layout
        const nodes = treeData.descendants();
        const links = treeData.links();

        // Normalize for fixed-depth
        nodes.forEach(d => {
            d.y = d.depth * 180;
        });

        // ************** Nodes section ***************
        
        // Update the nodes
        const node = svg.selectAll('g.node')
            .data(nodes, d => d.id || (d.id = ++i));

        // Enter any new nodes at the parent's previous position
        const nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${source.y0},${source.x0})`)
            .on('click', function(event, d) {
                // Toggle children on click
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
                }
                update(d);
            });

        // Add Circle for the nodes
        nodeEnter.append('circle')
            .attr('class', 'node')
            .attr('r', 1e-6)
            .style('fill', d => d._children ? "lightsteelblue" : "#fff")
            .style('stroke', 'steelblue')
            .style('stroke-width', '2px');

        // Add labels for the nodes
        nodeEnter.append('text')
            .attr('dy', '.35em')
            .attr('x', d => d.children || d._children ? -13 : 13)
            .attr('text-anchor', d => d.children || d._children ? 'end' : 'start')
            .text(d => d.data.name);

        // UPDATE
        const nodeUpdate = nodeEnter.merge(node);

        // Transition to the proper position for the node
        nodeUpdate.transition()
            .duration(750)
            .attr('transform', d => `translate(${d.y},${d.x})`);

        // Update the node attributes and style
        nodeUpdate.select('circle.node')
            .attr('r', 10)
            .style('fill', d => d._children ? "lightsteelblue" : "#fff")
            .attr('cursor', 'pointer');

        // Remove any exiting nodes
        const nodeExit = node.exit().transition()
            .duration(750)
            .attr('transform', d => `translate(${source.y},${source.x})`)
            .remove();

        nodeExit.select('circle')
            .attr('r', 1e-6);

        nodeExit.select('text')
            .style('fill-opacity', 1e-6);

        // ****************** links section ***************************

        // Update the links
        const link = svg.selectAll('path.link')
            .data(links, d => d.target.id);

        // Enter any new links at the parent's previous position
        const linkEnter = link.enter().insert('path', 'g')
            .attr('class', 'link')
            .style('fill', 'none')
            .style('stroke', '#ccc')
            .style('stroke-width', '2px')
            .attr('d', function(d) {
                const o = {x: source.x0, y: source.y0};
                return diagonal(o, o);
            });

        // UPDATE
        const linkUpdate = linkEnter.merge(link);

        // Transition back to the parent element position
        linkUpdate.transition()
            .duration(750)
            .attr('d', d => diagonal(d.source, d.target));

        // Remove any exiting links
        link.exit().transition()
            .duration(750)
            .attr('d', function(d) {
                const o = {x: source.x, y: source.y};
                return diagonal(o, o);
            })
            .remove();

        // Store the old positions for transition
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });

        // Creates a curved (diagonal) path from parent to the child nodes
        function diagonal(s, d) {
            return `M ${s.y} ${s.x}
                    C ${(s.y + d.y) / 2} ${s.x},
                      ${(s.y + d.y) / 2} ${d.x},
                      ${d.y} ${d.x}`;
        }
    }

    // Initial update call
    update(root);
});