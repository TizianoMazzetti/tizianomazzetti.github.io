/* Floating particle mesh background (Three.js) for skill pages */
import * as THREE from 'three';

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('bg-particles');

if (canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const COUNT = window.innerWidth < 720 ? 600 : 1100;
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT * 3; i++) positions[i] = (Math.random() - 0.5) * 16;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        size: 0.028,
        color: new THREE.Color(0x35d0d6),
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let mx = 0, my = 0, tmx = 0, tmy = 0;
    window.addEventListener('mousemove', e => {
        tmx = e.clientX / window.innerWidth - 0.5;
        tmy = e.clientY / window.innerHeight - 0.5;
    });

    const clock = new THREE.Clock();
    function render() {
        if (!prefersReduced) {
            const t = clock.getElapsedTime();
            points.rotation.y = t * 0.04;
            points.rotation.x = t * 0.015;
            mx += (tmx - mx) * 0.04;
            my += (tmy - my) * 0.04;
            camera.position.x = mx * 1.2;
            camera.position.y = -my * 1.2;
            camera.lookAt(scene.position);
        }
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    render();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, { passive: true });
}
