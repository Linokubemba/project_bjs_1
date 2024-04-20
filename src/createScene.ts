import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";

// Change this import to check other scenes
import { UI } from "./scenes/UI";
import { Home } from "./scenes/home";
import { Easy0 } from "./scenes/Exos/Easy/easy0";


export interface CreateSceneClass {
    createScene: (engine: Engine, canvas: HTMLCanvasElement) => Promise<Scene>;
    preTasks?: Promise<unknown>[];
}

export interface CreateSceneModule {
    default: CreateSceneClass;
}

// export interface SceneWithExtras {
//     scene: Scene,
//     button?: GUI.Button
// }

export const getSceneModule = (): CreateSceneClass => {
    return new Home();
}

export const getScenesModule = (sceneName?: string): CreateSceneClass => {
    if (sceneName === "easy0")
    {
        return new Easy0();
    }

    if (sceneName === 'UI')
    {
        return new UI();
    }

    return new Home();
}
