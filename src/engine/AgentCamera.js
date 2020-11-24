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

// **********************************
// AgentCamera
// **********************************

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

  // Tracking Methods
  trackPan(trackingX, trackingY, gain = 0.2) {
    const dx = this.position.x - this.centerX;
    const dy = this.position.y - this.centerY;
    const dz = this.position.z - this.centerZ;
    const sina = Math.sin(this.azimuth);
    const cosa = Math.cos(this.azimuth);
    const mx = trackingX * gain;
    const my = trackingY * gain;
    const dex = -mx * sina + my * cosa;
    const dey = mx * cosa + my * sina;
    const dez = 0;

    this.aim(this.centerX + dx + dex, this.centerY + dy + dey, this.centerZ + dz + dez, this.centerX + dex, this.centerY + dey, this.centerZ + dez);
  }

  trackZoom(trackingX, trackingY, gain = 0.0004) {
    const maxRadius = 5000;
    let dx = this.position.x - this.centerX;
    let dy = this.position.y - this.centerY;
    let dz = this.position.z - this.centerZ;
    const radius = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const delta = -trackingY * gain * Math.log(radius);
    dx += dx * delta;
    dy += dy * delta;
    dz += dz * delta;
    const radius2 = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (radius2 > maxRadius) return;
    this.position.x += dx * delta;
    this.position.y += dy * delta;
    this.position.z += dz * delta;
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
    this.up = new Vector3(Math.cos(newAzimuth + Math.PI / 1), Math.sin(newAzimuth + Math.PI / 1), 0);
    const newPosition = new Vector3(
      radius * Math.sin(newZenith) * Math.cos(newAzimuth),
      radius * Math.sin(newZenith) * Math.sin(newAzimuth),
      radius * Math.cos(newZenith)
    );
    this.aim(this.centerX + newPosition.x, this.centerY + newPosition.y, this.centerZ + newPosition.z, this.centerX, this.centerY, this.centerZ);
    console.log("azimut:", this.azimuth / Math.PI * 180, "zenith: ", this.zenith / Math.PI * 180);
  }
}
