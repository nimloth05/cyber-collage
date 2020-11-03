
//**********************************
// Transformation Functions  
//**********************************

function rotateX(x, y, z, angle) {
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);

    return new THREE.Vector3(x, y * cos - z * sin, y * sin + z * cos);
}


function rotateY(x, y, z, angle) {
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);

    return new THREE.Vector3(x * cos + z * sin, y, z * cos - x * sin);

}


function rotateZ(x, y, z, angle) {
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);

    return new THREE.Vector3(x * cos - y * sin, x * sin + y * cos, z);

}


//**********************************
// AgentCamera 
//**********************************

class AgentCamera extends THREE.PerspectiveCamera {

    constructor(fov, aspect, near, far) {
        super(fov, aspect, near, far);
    }

    aim(x, y, z, centerX, centerY, centerZ) {
        this.position.set(x, y, z);
        this.lookAt(centerX, centerY, centerZ);
    }

    get azimuth() {
        let lookingAt = this.lookingAt(),
            x = this.position.x - lookingAt.x,
            z = this.position.z - lookingAt.z;

        if (z == 0.0)
            if (x > 0.0)
                return Math.PI / 2
            else
                return Math.PI / -2
        else {
            let result = Math.atan(x / z);
            if (z < 0.0)
                return result + Math.PI;
            else
                return result;
        }
    }

    get zenith() {
        let lookingAt = this.lookingAt(),
            x = this.position.x - lookingAt.x,
            y = this.position.y - lookingAt.y,
            z = this.position.z - lookingAt.z;

        return Math.asin(y / Math.sqrt(x * x + y * y + z * z));
    }

    lookingAt(distance = 1) {
        /// does not return the proper LookAt point one would expept from GLULookAt kinds of functions
        return new THREE.Vector3(0, 0, - distance).applyQuaternion(this.quaternion).add(this.position);
    }

    // Tracking Methods
    trackPan(trackingX, trackingY, gain = 1.0) {
        let lookingAt = this.lookingAt(),
            dx = this.position.x - lookingAt.x,
            dy = this.position.y - lookingAt.y,
            dz = this.position.z - lookingAt.z,
            sina = Math.sin(this.azimuth),
            cosa = Math.cos(this.azimuth),
            sinz = Math.sin(this.zenith),
            cosz = Math.cos(this.zenith),
            mx = trackingX * gain,
            my = -trackingY * gain,
            // rotate by azimuth, factor vertical mouse input by cos of zenith: look from top=max, look from side=min
            dex = mx * cosa - my * sina * cosz,
            dey = mx * sina + my * cosa * cosz,
            dez = my * sinz;

        this.aim(lookingAt.x + dx + dex, lookingAt.y + dy + dey, lookingAt.z + dz + dez, lookingAt.x + dex, lookingAt.y + dey, lookingAt.z + dez)
    }


    trackZoom(trackingX, trackingY, gain = 10.0) {
        let lookingAt = this.lookingAt(),
            dx = this.position.x - lookingAt.x,
            dy = this.position.y - lookingAt.y,
            dz = this.position.z - lookingAt.z,
            length = Math.sqrt(dx * dx + dy * dy + dz * dz),
            delta = -trackingY * gain;

        this.position.x += dx / length * delta;
        this.position.y += dy / length * delta;
        this.position.z += dz / length * delta;
    }

}