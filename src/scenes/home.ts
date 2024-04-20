import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

import * as GUI from "@babylonjs/gui";

// If you don't need the standard material you will still need to import it since the scene requires it.
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CreateSceneClass } from "../createScene";

import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { Color3 } from "@babylonjs/core/Maths";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";

import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Animations/animatable"
import "@babylonjs/core/Helpers/sceneHelpers";

// Assets
import toolboxModel from "../../assets/glb/toolbox_centered.glb";

export class Home implements CreateSceneClass {
    createScene = async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        // This creates a basic Babylon Scene object (non-mesh)
        const scene = new Scene(engine);

        // Uncomment to load the inspector (debugging) asynchronously

        // void Promise.all([
        //     import("@babylonjs/core/Debug/debugLayer"),
        //     import("@babylonjs/inspector"),
        // ]).then((_values) => {
        //     console.log(_values);
        //     scene.debugLayer.show({
        //         handleResize: true,
        //         overlay: true,
        //         globalRoot: document.getElementById("#root") || undefined,
        //     });
        // });

        /////////
        // CAMERA
        /////////
        const camera = new ArcRotateCamera(
            "my first camera",
            0,
            Math.PI/2.6,
            10,
            new Vector3(0, 1, 0),
            scene
        );

        camera.minZ = 0.1;
        camera.wheelDeltaPercentage = 0.01;
        camera.upperRadiusLimit = 10;
        camera.lowerRadiusLimit = 2;
        camera._panningMouseButton = 0;
        camera.target = new Vector3(0,2,0);
        
        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);
        // Automatically position an ArcRotateCamera when its target is set to a mesh
        camera.useFramingBehavior = true
        
        /////////
        // LIGHTS
        /////////
        //Directional light               
        const dlightPosition = new Vector3(0.02, -0.05, -0.05);
        const dLightOrientation = new Vector3(0, 20, 0);
        const dLight = new DirectionalLight(
            "dLight",
            dlightPosition,
            scene
        );
        dLight.intensity = 0.5;
        dLight.position.y = 10;

        //Directional light orientation
        dLight.position = dLightOrientation;

        //Point light
        const pLightPosition: Vector3 = new Vector3(5, 10, -5);
        const pLight = new PointLight(
            "pLight",
            pLightPosition,
            scene
        );

        //Light colors
        pLight.diffuse = new Color3(0.53, 0.66, 0.74);
        pLight.specular = new Color3(0.83, 0.86, 0.89);
    
        /////////
        // ENV
        /////////        
        const env = scene.createDefaultEnvironment({
            createSkybox: true,
            skyboxSize: 150,
            skyboxColor: new Color3(0.3,0.3,0.3),
            createGround: true,
            groundSize: 100,
            groundColor: new Color3(0.7,0.7,0.7),
            enableGroundShadow: true,
            groundYBias: 0,
        });

        //////////////
        // SCENE ELEMS
        //////////////    
        const importResult = await SceneLoader.ImportMeshAsync(
            "",
            "",
            toolboxModel,
            scene,
            undefined,
            ".glb"
        );

        // just scale it so we can see it better
        importResult.meshes[0].scaling.scaleInPlace(7);
        
        const shadowGenerator = new ShadowGenerator(512, dLight)
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.blurScale = 2;
        shadowGenerator.setDarkness(0.2);
        
        shadowGenerator.addShadowCaster(importResult.meshes[0], true)

        scene.registerBeforeRender(() => {
            //Slowly rotate camera
            camera.alpha += (0.00005 * scene.getEngine().getDeltaTime());
            });

        return scene;
    };
}

export default new Home();
