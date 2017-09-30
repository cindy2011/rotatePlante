var scene, renderer, camera, light, earthMesh;
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
    //  addStarts(); //创建星星
    //创建星球
    // var geometry = new THREE.SphereGeometry(18, 40, 40);
    // var material = new THREE.MeshPhongMaterial();
    // var texture = new THREE.TextureLoader().load('img/earth4.jpg');
    // material.map = texture;
    // //var texture2 = new THREE.TextureLoader().load('img/b4.jpg');
    // // material.bumpMap = texture2;
    // // material.bumpScale = 0.2;
    // earthMesh = new THREE.Mesh(geometry, material);
    // earthMesh.position.set(-20, 20, -2000);
    // earthMesh.rotation.y = 5;
    // earthMesh.castShadow = true;
    // scene.add(earthMesh);
    // //创建星球2
    // var geometry2 = new THREE.SphereGeometry(18, 40, 40);
    // var material2 = new THREE.MeshPhongMaterial();
    // var texture2 = new THREE.TextureLoader().load('img/b6.jpg');
    // material2.map = texture2;
    // //var texture2 = new THREE.TextureLoader().load('img/b4.jpg');
    // // material.bumpMap = texture2;
    // // material.bumpScale = 0.2;
    // earthMesh2 = new THREE.Mesh(geometry2, material2);
    // earthMesh2.position.set(50, 50, -2000);
    // earthMesh2.rotation.y = 5;
    // earthMesh2.castShadow = true;
    // scene.add(earthMesh2);
    // 创建星球
    // for (var i = 0; i < nbPlanetsMax; i++) { //创建星球
    //     planets.push(new Planet(-2000 / nbPlanetsMax * i - 500));
    // }
    loop(); //轮换播放动画
}
var Colors = {
    red: ,
    orange: ,
    yellow: ,
    beige:
};
var Colors = ['img/earth4.jpg', 'img/b4.jpg', 'img/b6.jpg', 'img/b5.jpg'];
var colorsLength = Object.keys(Colors).length;

function getRandomColor() {
    var colIndx = Math.floor(Math.random() * colorsLength);
    var colorStr = Object.keys(Colors)[colIndx];
    return Colors[colorStr];
}

function getMat(color) {
    console.log(color);
    var material = new THREE.MeshPhongMaterial();
    var texture = new THREE.TextureLoader().load(color);
    material.map = texture;
    return material;
}
var Planet = function(z) {
    console.log("z:"+z);
    // the geometry of the planet is a tetrahedron
    this.planetRadius = randomRange(12, 30);
    var geomPlanet = new THREE.SphereGeometry(this.planetRadius, 40, 40);
    // create a new material for the planet
    var color = getRandomColor();
    var matPlanet = getMat(color);
    // create the mesh of the planet
    this.planet = new THREE.Mesh(geomPlanet, matPlanet);
    
    // Create a global mesh to hold the planet and the ring
    this.planet.castShadow = true;
    this.planet.receiveShadow = true;
    var posX = randomRange(-1 * Math.floor(WIDTH / 4), Math.floor(WIDTH / 4));
    var posY = randomRange(-1 * Math.floor(HEIGHT / 4), Math.floor(HEIGHT / 4));
    posX = shiftPosition(posX, this.planetRadius);
    posY = shiftPosition(posY, this.planetRadius);
    console.log("x:"+posX+",y:"+posY);
    this.planet.position.set(posX, posY,10);
    scene.add(this.mesh);
    planets.push(this.mesh);
}

function shiftPosition(pos, radius) {
    if (Math.abs(pos) < radius) {
        if (pos >= 0) {
            return pos + radius;
        } else {
            return pos - radius;
        }
    } else {
        return pos;
    }
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
            star.position.z += 3;
        };
    }
    // for (var i = 0; i < planets.length; i++) {
    //     if (planets[i].planet.position.z > 0) {
    //         planets[i].planet.position.z = 50;
    //     } else {
    //         planets[i].planet.position.z += 3;
    //     }
    // }
}

function loop() {
    // Adding stars
    // animateStars(camera.position.z);
    //
    // RENDER !
    //
    renderer.render(scene, camera); //渲染结合相机和场景来得到结果画面
    //
    // REQUEST A NEW FRAME
    //
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