//***************************************************
//  Mouse, Scroll, and Touch Handlers
//***************************************************

function onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    app.agentCube.mouseMove.x = (event.clientX / window.innerWidth) * 2 - 1;
    app.agentCube.mouseMove.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener('mousemove', onMouseMove, false);


function onMouseClick(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    app.agentCube.mouseClick.x = (event.clientX / window.innerWidth) * 2 - 1;
    app.agentCube.mouseClick.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener('click', onMouseClick, false);


function onMouseWheel(event) {
    const cameraIncrement = 0.001;
    const scrollToZoomRatio = 0.5;
    event.preventDefault();
    if (event.shiftKey) {
        app.agentCube.camera.trackZoom(event.deltaX, event.deltaY);
        //app.agentCube.camera.position.z += event.deltaY * scrollToZoomRatio;
        //app.agentCube.camera.position.x += event.deltaX * app.agentCube.camera.position.z * cameraIncrement;
        //app.agentCube.controls.update();
        //console.log(app.agentCube.camera.position.z);
    } else {
        app.agentCube.camera.trackPan(event.deltaX, event.deltaY);
        // make x/y sensitity proportional to camera distance, e.g., if you are close only small increments
        // app.agentCube.camera.position.x += event.deltaX * app.agentCube.camera.position.z * cameraIncrement;
        // app.agentCube.camera.position.y -= event.deltaY * app.agentCube.camera.position.z * cameraIncrement;
        //app.agentCube.controls.update();
        // prevent scrolling beyond a min/max value
        //camera.position.clampScalar( 0, 10 );
    }
}

window.addEventListener('wheel', onMouseWheel, { passive: false, capture: true });