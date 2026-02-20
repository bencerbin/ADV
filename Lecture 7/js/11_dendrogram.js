// dendrogram.js
class Dendrogram {
    constructor(containerId, options = {}) {
        this.config = {
            width: options.width || 800,
            height: options.height || 600,
            margin: options.margin || { top: 20, right: 90, bottom: 30, left: 90 },
            nodeRadius: options.nodeRadius || 4,
            duration: options.duration || 750,
            nodeColor: options.nodeColor || "#555",
            linkColor: options.linkColor || "#555"
        };

        this.containerId = containerId;
        this.initialize();
    }

    initialize() {
        // Clear any existing SVG
        d3.select(`#${this.containerId}`).selectAll("*").remove();

        this.width = this.config.width - this.config.margin.left - this.config.margin.right;
        this.height = this.config.height - this.config.margin.top - this.config.margin.bottom;

        this.svg = d3.select(`#${this.containerId}`)
            .append("svg")
            .attr("width", this.config.width)
            .attr("height", this.config.height)
            .append("g")
            .attr("transform", `translate(${this.config.margin.left},${this.config.margin.top})`);

        this.cluster = d3.cluster()
            .size([this.height, this.width - 160]);

        this.linkGenerator = d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x);
    }

    update(data) {
        const root = d3.hierarchy(data);
        this.cluster(root);

        // Update links
        const links = this.svg.selectAll('.link')
            .data(root.links());

        links.enter()
            .append("path")
            .attr("class", "link")
            .merge(links)
            .attr("d", this.linkGenerator)
            .style("fill", "none")
            .style("stroke", this.config.linkColor)
            .style("stroke-width", 1.5);

        links.exit().remove();

        // Update nodes
        const nodes = this.svg.selectAll('.node')
            .data(root.descendants());

        const nodesEnter = nodes.enter()
            .append("g")
            .attr("class", "node");

        nodesEnter.append("circle")
            .attr("r", this.config.nodeRadius)
            .style("fill", this.config.nodeColor);

        nodesEnter.append("text")
            .attr("dy", ".31em")
            .attr("x", d => d.children ? -6 : 6)
            .style("text-anchor", d => d.children ? "end" : "start")
            .text(d => d.data.name);

        const nodesUpdate = nodes.merge(nodesEnter)
            .attr("transform", d => `translate(${d.y},${d.x})`);

        nodes.exit().remove();
    }
}

// Create sample data
const sampleData = {
    name: "Computer Science",
    children: [
        {
            name: "Programming",
            children: [
                { name: "Python" },
                { name: "Java" },
                { name: "JavaScript" }
            ]
        },
        {
            name: "Databases",
            children: [
                { name: "SQL" },
                { name: "MongoDB" }
            ]
        },
        {
            name: "Web Dev",
            children: [
                { name: "HTML" },
                { name: "CSS" },
                { name: "React" }
            ]
        }
    ]
};

// Initialize and render the dendrogram
document.addEventListener('DOMContentLoaded', () => {
    // Update the title
    document.getElementById('example-title').textContent = 'Dendrogram';

    // Create the dendrogram
    const dendrogram = new Dendrogram("visualization", {
        width: document.getElementById('visualization').clientWidth,
        height: 500,
        nodeColor: "#2196F3",
        linkColor: "#90CAF9"
    });

    // Render the data
    dendrogram.update(sampleData);
});