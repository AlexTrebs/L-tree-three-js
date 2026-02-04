import { MathUtils, Quaternion, Vector3 } from "three";
import { params } from "./params";

export const getHeading = (orientation) => new Vector3(0, 1, 0).applyQuaternion(orientation);

export const rotateLocal = (axis, angle, orientation) => {
  const q = new Quaternion().setFromAxisAngle(axis, angle);
  orientation.multiply(q);
};


export const jitteredAngle = () => {
  const jitter = (Math.random() - 0.5) * 2 * params.randomness;
  return MathUtils.degToRad(params.angle + jitter * params.angle);
};
