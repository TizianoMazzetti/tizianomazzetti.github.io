import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Creazione scena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

// Creazione camera
const camera = new THREE.PerspectiveCamera(
      75, 
          window.innerWidth / window.innerHeight, 
              0.1, 
                  1000
                  );
                  camera.position.set(0, 1.5, 3);

                  // Creazione renderer
                  const renderer = new THREE.WebGLRenderer({ antialias: true });
                  renderer.setSize(window.innerWidth, window.innerHeight);
                  renderer.shadowMap.enabled = true;
                  document.getElementById('container').appendChild(renderer.domElement);

                  // Luci
                  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
                  directionalLight.position.set(2, 4, 5);
                  directionalLight.castShadow = true;
                  scene.add(directionalLight);

                  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
                  scene.add(ambientLight);

                  // Caricamento modello 3D
                  const loader = new GLTFLoader();
                  let model = null;

                  loader.load(
                        'models_avatar_tiziano.glb',
                            function (gltf) {
                                      model = gltf.scene;
                                              model.scale.set(1.3, 1.3, 1.3);
                                                      model.position.set(0, 0, 0);
                                                              scene.add(model);
                                                                      console.log('Modello caricato con successo!');
                            },
                                function (xhr) {
                                          console.log((xhr.loaded / xhr.total * 100) + '% caricato');
                                },
                                    function (error) {
                                              console.error('Errore nel caricamento del modello:', error);
                                    }
                                  );

                                  // Funzione di animazione
                                  function animate() {
                                        requestAnimationFrame(animate);
                                            
                                            // Rotazione automatica della scena
                                                if (model) {
                                                          model.rotation.y += 0.005;
                                                }
                                                    
                                                    renderer.render(scene, camera);
                                                    }

                                                    animate();

                                                    // Gestione ridimensionamento finestra
                                                    window.addEventListener('resize', () => {
                                                          camera.aspect = window.innerWidth / window.innerHeight;
                                                              camera.updateProjectionMatrix();
                                                                  renderer.setSize(window.innerWidth, window.innerHeight);
                                                    });
                                                    