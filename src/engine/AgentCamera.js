/* eslint-disable comma-dangle */
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
    const dx = this.position.x - this.centerX;
    const dy = this.position.y - this.centerY;

    if (dx === 0.0) {
      if (dy > 0.0) {
        return Math.PI / 2;
      } else {
        return Math.PI / -2;
      }
    } else {
        const result = Math.atan(dy / dx);
      if (dx < 0.0) {
        return result - Math.PI;
      } else {
        return result;
      }
    }
  }

  get zenith() {
    const dx = this.position.x - this.centerX;
    const dy = this.position.y - this.centerY;
    const dz = this.position.z - this.centerZ;

    return Math.acos(dz / Math.sqrt(dx * dx + dy * dy + dz * dz));
  }
  /*
  lookingAt(distance = 1) {
    /// does not return the proper LookAt point one would expept from GLULookAt kinds of functions
    return new Vector3(0, 0, -distance).applyQuaternion(this.quaternion).add(this.position);
  }  */

  // Tracking Methods
  trackPan(trackingX, trackingY, gain = 0.2) {
    const dx = this.position.x - this.centerX;
    const dy = this.position.y - this.centerY;
    const dz = this.position.z - this.centerZ;
    const sina = Math.sin(this.azimuth);
    const cosa = Math.cos(this.azimuth);
    const sinz = Math.sin(this.zenith);
    const cosz = Math.cos(this.zenith);
    const mx = trackingX * gain;
    const my = trackingY * gain;
    // rotate by azimuth, factor vertical mouse input by cos of zenith: look from top=max, look from side=min
    /* const dex = mx * cosa - my * sina * cosz;
    const dey = mx * sina + my * cosa * cosz;
    const dez = my * sinz;
    */
   const dex = -mx * sina + my * cosa;
   const dey = mx * cosa + my * sina;
   const dez = 0; // my * sinz;

    this.aim(this.centerX + dx + dex, this.centerY + dy + dey, this.centerZ + dz + dez, this.centerX + dex, this.centerY + dey, this.centerZ + dez);
  }

  trackZoom(trackingX, trackingY, gain = 0.00001) {
    const dx = this.position.x - this.centerX;
    const dy = this.position.y - this.centerY;
    const dz = this.position.z - this.centerZ;
    const radius = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const delta = -trackingY * gain;
    // consider using the log of the distance
    this.position.x += dx * radius * delta;
    this.position.y += dy * radius * delta;
    this.position.z += dz * radius * delta;
  }

  trackSpinn(trackingX, trackingY, gain = 0.001) {
    const dx = this.position.x - this.centerX;
    const dy = this.position.y - this.centerY;
    const dz = this.position.z - this.centerZ;
    const radius = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const newAzimuth = this.azimuth + trackingX * gain;
    let newZenith = this.zenith + trackingY * gain;
    const zenitMargin = 0.001;
    newZenith = Math.min(Math.max(zenitMargin, newZenith), Math.PI / 2 - zenitMargin);
    // const newPosition = polarToCarthesian(radius, newAzimuth, newZenith);
    if (this.az === undefined) this.az = 0.0;
    if (this.ze === undefined) this.ze = Math.PI / 2;
    this.az += gain * trackingX;
    this.ze += gain * trackingY;
    this.ze = Math.min(Math.max(0, this.ze), Math.PI / 2 - zenitMargin);

    // console.log("az:", this.az / Math.PI * 180, "ze: ", this.ze / Math.PI * 180);

    // const newPosition = polarToCarthesian(radius, this.az, this.ze);

    this.up = new Vector3(Math.cos(newAzimuth + Math.PI / 1), Math.sin(newAzimuth + Math.PI / 1), 0);

    // const newPosition = new Vector3(radius * Math.sin(this.az) * Math.cos(this.ze), radius * Math.cos(this.az) * Math.cos(this.ze), 400);
    const newPosition = new Vector3(
      radius * Math.sin(newZenith) * Math.cos(newAzimuth),
      radius * Math.sin(newZenith) * Math.sin(newAzimuth),
      radius * Math.cos(newZenith)
    );

    this.aim(this.centerX + newPosition.x, this.centerY + newPosition.y, this.centerZ + newPosition.z, this.centerX, this.centerY, this.centerZ);
    // console.log("dx: ", dx, "dy: ", dy, "dz: ", dz);
    console.log("azimut:", this.azimuth / Math.PI * 180, "zenith: ", this.zenith / Math.PI * 180);
  }
}
