var scene, renderer, camera, light;
var stars = [];
var planets = [];
var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;
var nbPlanetsMax = 4;

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
// initialise the world
function initStar() {
    scene = new THREE.Scene(); //创建场景
    camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, .1, 2000); //创建以75度视角，比例与当前页面的比例相等，最远2000，最近.1的相机
    //视野角：fov 纵横比：aspect 相机离视体积最近的距离：near 相机离视体积最远的距离：far
    camera.position.z = 200; //相机位置。
    renderer = new THREE.WebGLRenderer({
        alpha: true, //是否可以设置背景色透明  
        antialias: true //是否开启反锯齿  
    }); //创建渲染器，使用WebGL来绘制场景
    renderer.setSize(WIDTH, HEIGHT); //场景大小
    renderer.shadowMap.enabled = true; //启用在场景中的阴影贴图。
    container = document.getElementById('universe'); //引用元素
    container.appendChild(renderer.domElement); //将渲染器的画布加入到元素中
    // Lights
    ambientLight = new THREE.AmbientLight(0x663344, 2); //环境光，第一个参数是光的颜色，第二个参数是光的强度值
    scene.add(ambientLight); //给场景增加环境光
    light = new THREE.DirectionalLight(0xffffff, 1.5); //平行光
    light.position.set(200, 100, 200); //平行光的位置
    light.castShadow = true; //光照将产生动态阴影
    //light.shadow该属性存储渲染光照阴影的所有相关信息。
    light.shadow.camera.left = -WIDTH / 2;
    light.shadow.camera.right = WIDTH / 2;
    light.shadow.camera.top = HEIGHT / 2;
    light.shadow.camera.bottom = -HEIGHT / 2;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 1000;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    scene.add(light);
    window.addEventListener('resize', handleWindowResize, false); //监控当窗口改变大小时
    addStarts(); //创建星星 
    for (var i = 0; i < nbPlanetsMax; i++) { //创建星球
        new Planet((-3000 / nbPlanetsMax * i - 500), i);
    }
    loop(); //轮换播放动画
}

function addStarts() {
    for (var z = -2000; z < 0; z += 20) {
        var geometry = new THREE.SphereGeometry(0.5, 32, 32) //创建球形星星
        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
        var sphere = new THREE.Mesh(geometry, material) //给星星设置颜色
        sphere.position.x = randomRange(-1 * Math.floor(WIDTH / 2), Math.floor(WIDTH / 2));
        sphere.position.y = randomRange(-1 * Math.floor(HEIGHT / 2), Math.floor(HEIGHT / 2));
        // Then set the z position to where it is in the loop (distance of camera)
        sphere.position.z = z;
        // scale it up a bit
        sphere.scale.x = sphere.scale.y = 2;
        //add the sphere to the scene
        scene.add(sphere);
        //finally push it to the stars array
        stars.push(sphere);
    }
}

function animateStars(z) {
    // loop through each star
    for (var i = 0; i < stars.length; i++) {
        star = stars[i];
        // if the particle is too close move it to the back
        if (star.position.z > z) {
            star.position.z -= 2000;
        } else {
            star.position.z += 1.5;
        };
    }
}
var Colors = ['img/b3.jpg', 'img/b4.jpg', 'img/b6.jpg', 'img/b5.jpg'];
var PlanetPos = [{ x: -20, y: 10 }, { x: 50, y: -30 }, { x: -40, y: -40 }, { x: 40, y: 50 }];
var planetRadius = [18, 18, 18, 16];
var planetsTarget = [10, 20, 30, 40];

function animatePlanets() {
    // loop through each star
    for (var i = 0; i < planets.length; i++) {
        var planet = planets[i];

        // if the particle is too close move it to the back
        if (planet.position.z > planetsTarget[i] || planet.position.z == planetsTarget[i]) {
            planet.position.z = planetsTarget[i];
        } else {
            planet.position.z += (planetsTarget[i] - planet.position.z) / 100;
        };
        planet.rotation.y += 0.003 * (i + 1);

    }
}

var Planet = function(z, i) {
    //console.log(planetRadius[i]);
    var geomPlanet = new THREE.SphereGeometry(planetRadius[i], 40, 40);
    // create a new material for the planet
    var color = Colors[i];
    //console.log(color);
    var matPlanet = getMat(color);
    // create the mesh of the planet
    this.planet = new THREE.Mesh(geomPlanet, matPlanet);
    this.mesh = new THREE.Object3D();
    this.mesh.add(this.planet);
    // Create a global mesh to hold the planet and the ring
    this.planet.castShadow = true;
    this.planet.receiveShadow = true;
    this.mesh.rotation.x = (Math.random() * 2 - 1) * 2 * Math.PI;
    this.mesh.rotation.z = (Math.random() * 2 - 1) * 2 * Math.PI;
    this.mesh.position.set(PlanetPos[i].x, PlanetPos[i].y, z);
    scene.add(this.mesh);
    planets.push(this.mesh);
}

function getMat(color) {
    var material = new THREE.MeshPhongMaterial();
    var texture = new THREE.TextureLoader().load(color);
    material.map = texture;
    return material;
}

function loop() {
    // Adding stars
    animateStars(camera.position.z);
    animatePlanets();
    renderer.render(scene, camera); //渲染结合相机和场景来得到结果画面
    requestAnimationFrame(loop); //循环渲染
}

function handleWindowResize() {
    // Recalculate Width and Height as they had changed
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    // Update the renderer and the camera
    renderer.setSize(WIDTH, HEIGHT); //改变渲染器的大小
    camera.aspect = WIDTH / HEIGHT; //aspect为观察空间的宽高比=实际窗口的纵横比
    camera.updateProjectionMatrix(); //调用updateProjectionMatrix方法,更新相机的投影矩阵. 
}
initStar();