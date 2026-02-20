// radialTree.js
class RadialTree {
    constructor(containerId, data, options = {}) {
        this.containerId = containerId;
        this.data = data;
        this.options = {
            width: options.width || 800,
            height: options.height || 800,
            margin: options.margin || { top: 40, right: 40, bottom: 40, left: 40 },
            duration: options.duration || 750,
            nodeRadius: options.nodeRadius || 4.5,
            nodeColor: options.nodeColor || '#555',
            linkColor: options.linkColor || '#555'
        };
        
        this.radius = Math.min(this.options.width, this.options.height) / 2;
        this.initialize();
    }

    initialize() {
        // Clear any existing content
        d3.select(`#${this.containerId}`).selectAll('*').remove();

        // Create SVG container
        this.svg = d3.select(`#${this.containerId}`)
            .append('svg')
            .attr('width', this.options.width)
            .attr('height', this.options.height)
            .append('g')
            .attr('transform', `translate(${this.options.width / 2},${this.options.height / 2})`);

        // Initialize the tree layout
        this.tree = d3.tree()
            .size([2 * Math.PI, this.radius - 100]);

        // Create the root node from the hierarchy
        this.root = d3.hierarchy(this.data);
        this.root.x0 = 0;
        this.root.y0 = 0;

        // Collapse all nodes initially
        this.root.descendants().forEach(d => {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            }
        });

        this.update(this.root);
    }

    // Project coordinates for radial layout
    project(x, y) {
        const angle = x - Math.PI / 2;
        return [y * Math.cos(angle), y * Math.sin(angle)];
    }

    update(source) {
        const treeData = this.tree(this.root);
        const nodes = treeData.descendants();
        const links = treeData.links();

        // Update nodes
        const node = this.svg.selectAll('g.node')
            .data(nodes, d => d.id || (d.id = ++this.i));

        // Enter new nodes
        const nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr('transform', d => {
                const [x, y] = this.project(source.x0, source.y0);
                return `translate(${x},${y})`;
            })
            .on('click', (event, d) => this.click(d));

        // Add circles for nodes
        nodeEnter.append('circle')
            .attr('r', this.options.nodeRadius)
            .style('fill', d => d._children ? 'lightsteelblue' : '#fff')
            .style('stroke', this.options.nodeColor)
            .style('stroke-width', '1.5px');

        // Add labels
        nodeEnter.append('text')
            .attr('dy', '.31em')
            .attr('x', d => {
                const [x, y] = this.project(d.x, d.y);
                return x < 0 ? -10 : 10;
            })
            .attr('text-anchor', d => {
                const [x, y] = this.project(d.x, d.y);
                return x < 0 ? 'end' : 'start';
            })
            .text(d => d.data.name)
            .style('fill-opacity', 0);

        // Update existing nodes
        const nodeUpdate = node.merge(nodeEnter)
            .transition()
            .duration(this.options.duration)
            .attr('transform', d => {
                const [x, y] = this.project(d.x, d.y);
                return `translate(${x},${y})`;
            });

        nodeUpdate.select('circle')
            .attr('r', this.options.nodeRadius)
            .style('fill', d => d._children ? 'lightsteelblue' : '#fff');

        nodeUpdate.select('text')
            .style('fill-opacity', 1);

        // Remove old nodes
        const nodeExit = node.exit()
            .transition()
            .duration(this.options.duration)
            .attr('transform', d => {
                const [x, y] = this.project(source.x0, source.y0);
                return `translate(${x},${y})`;
            })
            .remove();

        nodeExit.select('circle')
            .attr('r', 0);

        nodeExit.select('text')
            .style('fill-opacity', 0);

        // Update links
        const link = this.svg.selectAll('path.link')
            .data(links, d => d.target.id);

        // Enter new links
        const linkEnter = link.enter().insert('path', 'g')
            .attr('class', 'link')
            .attr('d', d => {
                const o = { x: source.x0, y: source.y0 };
                return this.linkRadial({ source: o, target: o });
            })
            .style('fill', 'none')
            .style('stroke', this.options.linkColor)
            .style('stroke-width', '1.5px');

        // Update existing links
        link.merge(linkEnter)
            .transition()
            .duration(this.options.duration)
            .attr('d', this.linkRadial.bind(this));

        // Remove old links
        link.exit()
            .transition()
            .duration(this.options.duration)
            .attr('d', d => {
                const o = { x: source.x, y: source.y };
                return this.linkRadial({ source: o, target: o });
            })
            .remove();

        // Store old positions for transition
        nodes.forEach(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    linkRadial(d) {
        const [startX, startY] = this.project(d.source.x, d.source.y);
        const [endX, endY] = this.project(d.target.x, d.target.y);
        
        return d3.linkHorizontal()({
            source: [startX, startY],
            target: [endX, endY]
        });
    }

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

// Usage example:
const sampleData = {
    name: "Root",
    children: [
        {
            name: "Branch A",
            children: [
                { name: "Leaf A1" },
                { name: "Leaf A2" }
            ]
        },
        {
            name: "Branch B",
            children: [
                { name: "Leaf B1" },
                { name: "Leaf B2" }
            ]
        }
    ]
};

// Initialize the visualization
document.addEventListener('DOMContentLoaded', () => {
    const tree = new RadialTree('visualization', sampleData, {
        width: 800,
        height: 800,
        nodeColor: '#2196F3',
        linkColor: '#90CAF9'
    });
});