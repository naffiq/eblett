import * as THREE from 'three';

var camera, scene, renderer;
var mesh;
const eblettTexture = require('../textures/eblett.jpg')

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var audioElement = document.getElementById('audioElement');
var audioSrc = audioCtx.createMediaElementSource(audioElement);
var analyser = audioCtx.createAnalyser();


// Bind our analyser to the media element source.
audioSrc.connect(analyser);
audioSrc.connect(audioCtx.destination);
//var frequencyData = new Uint8Array(analyser.frequencyBinCount);
var frequencyData = new Uint8Array(200);

init();
animate();
function init() {
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 400;
  scene = new THREE.Scene();
  var texture = new THREE.TextureLoader().load( eblettTexture );
  var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
  var material = new THREE.MeshBasicMaterial( { map: texture } );
  mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  //
  window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
  requestAnimationFrame( animate );
  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.01;

  // Copy frequency data to frequencyData array.
  analyser.getByteFrequencyData(frequencyData);
  const sum = frequencyData.reduce((total, frData) => total + frData, 0)
  const scaleFactor = (sum / frequencyData.length) / 256
  mesh.scale.set(scaleFactor, scaleFactor, scaleFactor)
  
  renderer.render( scene, camera );
}