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

function polarToCarthesian(radius, azimuth, zenith) {
  return new Vector3(
    radius * Math.sin(azimuth) * Math.cos(zenith),
    radius * Math.sin(zenith),
    radius * Math.cos(azimuth) * Math.cos(zenith));
}

//* *********************************
// AgentCamera
//* *********************************

export class AgentCamera extends PerspectiveCamera {
  aim(x, y, z, centerX, centerY, centerZ) {
    this.position.set(x, y, z);
    this.lookAt(centerX, centerY, centerZ);
    // need to save look at position because it cannot be easily retrieved/computed
    this.centerX = centerX;
    this.centerY = centerY;
    this.centerZ = centerZ;
  }

  get azimuth() {
    // const lookingAt = this.lookingAt();
    const dx = this.position.x - this.centerX;
    const dz = this.position.z - this.centerZ;

    if (dz === 0.0) {
      if (dx > 0.0) {
        return Math.PI / 2;
      } else {
        return Math.PI / -2;
      }
    } else {
        const result = Math.atan(dx / dz);
      if (dz < 0.0) {
        return result + Math.PI;
      } else {
        return result;
      }
    }
  }

  get zenith() {
    const dx = this.position.x - this.centerX;
    const dy = this.position.y - this.centerY;
    const dz = this.position.z - this.centerZ;

    return Math.asin(dy / Math.sqrt(dx * dx + dy * dy + dz * dz));
  }
  /*
  lookingAt(distance = 1) {
    /// does not return the proper LookAt point one would expept from GLULookAt kinds of functions
    return new Vector3(0, 0, -distance).applyQuaternion(this.quaternion).add(this.position);
  }  */

  // Tracking Methods
  trackPan(trackingX, trackingY, gain = 1.0) {
    const dx = this.position.x - this.centerX;
    const dy = this.position.y - this.centerY;
    const dz = this.position.z - this.centerZ;
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

    this.aim(this.centerX + dx + dex, this.centerY + dy + dey, this.centerZ + dz + dez, this.centerX + dex, this.centerY + dey, this.centerZ + dez);
  }

  trackZoom(trackingX, trackingY, gain = 10.0) {
    const dx = this.position.x - this.centerX;
    const dy = this.position.y - this.centerY;
    const dz = this.position.z - this.centerZ;
    const radius = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const delta = -trackingY * gain;

    this.position.x += dx / radius * delta;
    this.position.y += dy / radius * delta;
    this.position.z += dz / radius * delta;
  }

  trackSpinn(trackingX, trackingY, gain = 0.005) {
    const dx = this.position.x - this.centerX;
    const dy = this.position.y - this.centerY;
    const dz = this.position.z - this.centerZ;
    const radius = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const newAzimuth = this.azimuth + trackingX * gain;
    const newZenith = this.zenith - trackingY * gain;
    // const newPosition = polarToCarthesian(radius, newAzimuth, newZenith);

    if (!this.az) this.az = 0.0;
    if (!this.ze) this.ze = 0.0;
    this.az += gain * trackingX;
    this.ze += gain * trackingY;

    // const newPosition = polarToCarthesian(radius, this.az, this.ze);

    this.up = new Vector3(Math.sin(this.az + Math.PI / 1), Math.cos(this.az + Math.PI / 1), 0);

    const newPosition = new Vector3(1000 * Math.sin(this.az) * Math.cos(this.ze), 1000 * Math.cos(this.az) * Math.cos(this.ze), 400);

    this.aim(this.centerX + newPosition.x, this.centerY + newPosition.y, this.centerZ + newPosition.z, this.centerX, this.centerY, this.centerZ);
    // this.aim(this.position.x, this.position.y, this.position.z, this.centerX, this.centerY, this.centerZ);
  }
}
