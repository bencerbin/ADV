// Sample data with categories
const sampleData = [
    { position: { x: 0, y: 0, z: 0 }, category: 'A', value: 10 },
    { position: { x: 1, y: 1, z: -1 }, category: 'B', value: 20 },
    { position: { x: -1, y: 0.5, z: -0.5 }, category: 'C', value: 15 },
    { position: { x: 0.5, y: -0.5, z: -1 }, category: 'A', value: 25 },
    { position: { x: -0.5, y: 1, z: -1 }, category: 'B', value: 30 }
];

// Advanced A-Frame component for interactive data filtering
AFRAME.registerComponent('filter-controls', {
    init: function() {
        this.createFilterUI();
        this.setupEventListeners();
        this.activeFilters = new Set();
        this.visualizeData();
    },
    
    createFilterUI: function() {
        // Create filter panel
        const panel = document.createElement('a-entity');
        panel.setAttribute('geometry', {
            primitive: 'plane',
            width: 1,
            height: 0.5
        });
        panel.setAttribute('material', {
            color: '#333',
            opacity: 0.8
        });
        panel.setAttribute('position', '0 0.25 0');
        
        // Add filter buttons
        const categories = ['A', 'B', 'C'];
        categories.forEach((cat, i) => {
            const button = document.createElement('a-entity');
            button.setAttribute('geometry', {
                primitive: 'box',
                width: 0.2,
                height: 0.1,
                depth: 0.05
            });
            button.setAttribute('material', {
                color: '#666'
            });
            button.setAttribute('position', {
                x: (i - 1) * 0.25,
                y: 0,
                z: 0.025
            });
            button.setAttribute('class', 'clickable');
            button.setAttribute('data-category', cat);

            // Add text label
            const text = document.createElement('a-text');
            text.setAttribute('value', `Category ${cat}`);
            text.setAttribute('align', 'center');
            text.setAttribute('position', '0 0 0.026');
            text.setAttribute('scale', '0.1 0.1 0.1');
            text.setAttribute('color', '#fff');
            
            button.appendChild(text);
            panel.appendChild(button);
        });
        
        this.el.appendChild(panel);
    },
    
    setupEventListeners: function() {
        const buttons = this.el.querySelectorAll('[data-category]');
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                const category = event.target.getAttribute('data-category');
                this.toggleFilter(category, event.target);
            });
            
            // Add hover effects
            button.addEventListener('mouseenter', (event) => {
                event.target.setAttribute('material', 'color', '#999');
            });
            
            button.addEventListener('mouseleave', (event) => {
                const category = event.target.getAttribute('data-category');
                const isActive = this.activeFilters.has(category);
                event.target.setAttribute('material', 'color', isActive ? '#4CAF50' : '#666');
            });
        });
    },
    
    toggleFilter: function(category, buttonElement) {
        if (this.activeFilters.has(category)) {
            this.activeFilters.delete(category);
            buttonElement.setAttribute('material', 'color', '#666');
        } else {
            this.activeFilters.add(category);
            buttonElement.setAttribute('material', 'color', '#4CAF50');
        }
        
        this.visualizeData();
    },
    
    visualizeData: function() {
        const container = document.querySelector('#dataContainer');
        
        // Clear existing visualization
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        
        // Filter and visualize data
        sampleData.forEach(item => {
            if (this.activeFilters.size === 0 || this.activeFilters.has(item.category)) {
                const sphere = document.createElement('a-sphere');
                sphere.setAttribute('position', item.position);
                sphere.setAttribute('radius', item.value * 0.02);
                sphere.setAttribute('color', this.getCategoryColor(item.category));
                
                // Add hover animation
                sphere.setAttribute('animation__scale', {
                    property: 'scale',
                    to: '1.2 1.2 1.2',
                    dur: 200,
                    startEvents: 'mouseenter'
                });
                
                sphere.setAttribute('animation__return', {
                    property: 'scale',
                    to: '1 1 1',
                    dur: 200,
                    startEvents: 'mouseleave'
                });
                
                container.appendChild(sphere);
            }
        });
    },
    
    getCategoryColor: function(category) {
        const colors = {
            'A': '#FF4444',
            'B': '#44FF44',
            'C': '#4444FF'
        };
        return colors[category] || '#FFFFFF';
    }
});

// Remove loading screen when everything is ready
window.addEventListener('load', function() {
    document.getElementById('loadingScreen').style.display = 'none';
});