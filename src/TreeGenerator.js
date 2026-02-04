import { MathUtils, Vector3, Quaternion } from "three";
import { params } from "./params";
import { getHeading, jitteredAngle, rotateLocal } from "./utils";

const axiom = "F";
const rule = "F[+F][&F][-F]";

const UP = new Vector3(0, 1, 0);
const RIGHT = new Vector3(1, 0, 0);
const FWD = new Vector3(0, 0, 1);

export const regenerateTree = () => {
  const str = lSystem();
  const branches = turtleInterpreter(str);

  console.log(branches);
  return branches;
}

const lSystem = () => {
  let current = axiom;

  for (let i = 0; i < params.iterations; i++) {
    current = current.split('').map(c => c == axiom ? rule : c).join('');
  }

  return current;
}

const turtleInterpreter = (str) => {
  let depth = 0;
  let pos = new Vector3(0, 0, 0);
  let orient = new Quaternion();
  const stack = [];
  const branches = [];

  const windRad = MathUtils.degToRad(params.windDirection);
  const windDir = new Vector3(Math.sin(windRad), 0, Math.cos(windRad));

  for (const c of str) {
    switch (c) {
      case 'F': {
        const step = params.branchLength * params.lengthDecay ** depth;
        const start = pos.clone();
        const heading = getHeading(orient).multiplyScalar(step);
        const wind = windDir.clone().multiplyScalar(params.windStrength * depth * 0.02);
        const end = pos.clone().add(heading).add(wind);

        branches.push({ start, end, depth });
        pos.copy(end);
        break;
      }
      case '[':
        stack.push({ pos: pos.clone(), orient: orient.clone(), depth });
        depth++;
        rotateLocal(UP, Math.random() * Math.PI * 2, orient);
        break;
      case ']': {
        const state = stack.pop();
        pos.copy(state.pos);
        orient.copy(state.orient);
        depth = state.depth;
        break;
      }
      case '+': rotateLocal(FWD, jitteredAngle(), orient); break;
      case '-': rotateLocal(FWD, -jitteredAngle(), orient); break;
      case '&': rotateLocal(RIGHT, jitteredAngle(), orient); break;
    }
  }

  return branches;
}
