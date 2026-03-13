// SkyWatch AI Globe Engine
// 3D interactive globe with night satellite texture - FULLY LIT

Cesium.Ion.defaultAccessToken = "";

// Create viewer with minimal UI
const viewer = new Cesium.Viewer("cesiumContainer", {
    animation: false,
    timeline: false,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    infoBox: false,
    selectionIndicator: false,
    skyBox: false,
    skyAtmosphere: false
});

// Remove default imagery and add night Earth texture
viewer.imageryLayers.removeAll();
const nightLayer = viewer.imageryLayers.addImageryProvider(
    new Cesium.SingleTileImageryProvider({
        url: "assets/earth_night.jpg",
        rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90)
    })
);

// FULLY LIT GLOBE - No day/night shadow
viewer.scene.globe.enableLighting = false;
viewer.scene.skyAtmosphere.show = false;
viewer.scene.globe.showGroundAtmosphere = false;

// Dark space background
viewer.scene.backgroundColor = Cesium.Color.BLACK;
viewer.scene.sun.show = false;
viewer.scene.moon.show = false;

// Add subtle glow effect to globe
viewer.scene.globe.baseColor = Cesium.Color.BLACK;

// Load country borders with glowing cyan lines
Cesium.GeoJsonDataSource.load("data/countries.geojson", {
    stroke: Cesium.Color.CYAN,
    strokeWidth: 1.5,
    fill: Cesium.Color.TRANSPARENT
}).then(function(dataSource) {
    viewer.dataSources.add(dataSource);
});

// Custom rotation control
let isDragging = false;

viewer.screenSpaceEventHandler.setInputAction(function() {
    isDragging = true;
}, Cesium.ScreenSpaceEventType.LEFT_DOWN);

viewer.screenSpaceEventHandler.setInputAction(function() {
    isDragging = false;
}, Cesium.ScreenSpaceEventType.LEFT_UP);

viewer.screenSpaceEventHandler.setInputAction(function(movement) {
    if (isDragging) {
        viewer.camera.rotateLeft(movement.endPosition.x * 0.00001);
        viewer.camera.rotateUp(movement.endPosition.y * 0.00001);
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

// Initial view - centered on Earth from space
viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(0, 20, 20000000)
});
