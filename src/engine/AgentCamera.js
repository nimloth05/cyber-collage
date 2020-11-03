//* *********************************
// Transformation Functions
//* *********************************

import {PerspectiveCamera, Vector3} from "three";

export function rotateX(x, y, z, angle) {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);

  return new Vector3(x, y * cos - z * sin, y * sin + z * cos);
}

export function rotateY(x, y, z, angle) {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);

  return new Vector3(x * cos + z * sin, y, z * cos - x * sin);
}

export function rotateZ(x, y, z, angle) {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);

  return new Vector3(x * cos - y * sin, x * sin + y * cos, z);
}

//* *********************************
// AgentCamera
//* *********************************

export class AgentCamera extends PerspectiveCamera {
  aim(x, y, z, centerX, centerY, centerZ) {
    this.position.set(x, y, z);
    this.lookAt(centerX, centerY, centerZ);
  }

  get azimuth() {
    const lookingAt = this.lookingAt();
    const x = this.position.x - lookingAt.x;
    const z = this.position.z - lookingAt.z;

    if (z === 0.0) {
      if (x > 0.0) {
        return Math.PI / 2;
      } else {
        return Math.PI / -2;
      }
    } else {
      const result = Math.atan(x / z);
      if (z < 0.0) {
        return result + Math.PI;
      } else {
        return result;
      }
    }
  }

  get zenith() {
    const lookingAt = this.lookingAt();
    const x = this.position.x - lookingAt.x;
    const y = this.position.y - lookingAt.y;
    const z = this.position.z - lookingAt.z;

    return Math.asin(y / Math.sqrt(x * x + y * y + z * z));
  }

  lookingAt(distance = 1) {
    /// does not return the proper LookAt point one would expept from GLULookAt kinds of functions
    return new Vector3(0, 0, -distance).applyQuaternion(this.quaternion).add(this.position);
  }

  // Tracking Methods
  trackPan(trackingX, trackingY, gain = 1.0) {
    const lookingAt = this.lookingAt();
    const dx = this.position.x - lookingAt.x;
    const dy = this.position.y - lookingAt.y;
    const dz = this.position.z - lookingAt.z;
    const sina = Math.sin(this.azimuth);
    const cosa = Math.cos(this.azimuth);
    const sinz = Math.sin(this.zenith);
    const cosz = Math.cos(this.zenith);
    const mx = trackingX * gain;
    const my = -trackingY * gain;
    // rotate by azimuth, factor vertical mouse input by cos of zenith: look from top=max, look from side=min
    const dex = mx * cosa - my * sina * cosz;
    const dey = mx * sina + my * cosa * cosz;
    const dez = my * sinz;

    this.aim(lookingAt.x + dx + dex, lookingAt.y + dy + dey, lookingAt.z + dz + dez, lookingAt.x + dex, lookingAt.y + dey, lookingAt.z + dez);
  }

  trackZoom(trackingX, trackingY, gain = 10.0) {
    const lookingAt = this.lookingAt();
    const dx = this.position.x - lookingAt.x;
    const dy = this.position.y - lookingAt.y;
    const dz = this.position.z - lookingAt.z;
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const delta = -trackingY * gain;

    this.position.x += dx / length * delta;
    this.position.y += dy / length * delta;
    this.position.z += dz / length * delta;
  }
}
