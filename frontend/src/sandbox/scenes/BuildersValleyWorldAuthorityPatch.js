import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { BuildersValleyWorld } from "../world/BuildersValleyWorld.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;

function installWorldAuthority(scene) {
  const world = new BuildersValleyWorld(scene);
  const runtime = world.install();

  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.worldAuthority = BuildersValleyWorld.STANDARD;
  window.__BUILDERS_VALLEY__.getWorldAuthority = () => world.snapshot();
  window.__BUILDERS_VALLEY__.debugWorldAuthority = () => {
    const snapshot = world.snapshot();
    console.group(`Builders Valley World Authority — ${snapshot.status}`);
    console.log("Ownership", snapshot.ownership);
    console.log("Layout", snapshot.layout);
    console.log("Layers", snapshot.layers);
    console.groupEnd();
    return snapshot;
  };

  return runtime;
}

prototype.create = function createWithWorldAuthority() {
  originalCreate.call(this);
  installWorldAuthority(this);
};
