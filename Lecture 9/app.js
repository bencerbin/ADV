// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);

// Camera setup
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Objects array to keep track of all objects
const objects = [];

// Function to add a cube
function addCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({
        color: getRandomColor()
    });
    const cube = new THREE.Mesh(geometry, material);
    
    // Random position
    cube.position.x = (Math.random() - 0.5) * 5;
    cube.position.y = (Math.random() - 0.5) * 5;
    
    scene.add(cube);
    objects.push(cube);
}

// Function to add a sphere
function addSphere() {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: getRandomColor()
    });
    const sphere = new THREE.Mesh(geometry, material);
    
    // Random position
    sphere.position.x = (Math.random() - 0.5) * 5;
    sphere.position.y = (Math.random() - 0.5) * 5;
    
    scene.add(sphere);
    objects.push(sphere);
}

// Function to change color of random object
function changeColor() {
    if (objects.length > 0) {
        const randomObject = objects[Math.floor(Math.random() * objects.length)];
        randomObject.material.color.setHex(getRandomColor());
    }
}

// Helper function to generate random colors
function getRandomColor() {
    return Math.random() * 0xffffff;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate all objects
    objects.forEach(obj => {
        obj.rotation.x += 0.01;
        obj.rotation.y += 0.01;
    });

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start animation
animate();