import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateTorusKnot } from "@babylonjs/core/Meshes/Builders/torusKnotBuilder";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CreateSceneClass } from "../createScene";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { AdvancedDynamicTexture, Control, InputText } from "@babylonjs/gui";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Culling/ray";

export class TestScene implements CreateSceneClass {
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

        // This creates and positions a free camera (non-mesh)
        const camera = new ArcRotateCamera(
            "arcRotateCamera",
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

        // This targets the camera to scene origin
        camera.setTarget(Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        //Create PBR material
        const pbr = new PBRMaterial("pbr", scene);
        pbr.metallic = 0;
        pbr.roughness = 0;
        // pbr.albedoColor = new Color3(0.3, 0.3, 0.8);  
        pbr.subSurface.isRefractionEnabled = true;
        pbr.subSurface.indexOfRefraction = 1.5;
        pbr.subSurface.tintColor = new Color3(0.0, 0.5, 0.1);

        const torus = CreateTorusKnot("torus",{
            radius: 1,
            tube: 0.5,
            radialSegments: 128,
            tubularSegments: 128
        },
            scene
        );

        torus.position.y = 1;
        torus.rotation.y = Math.PI/2;
        torus.material = pbr;

        /**************************** */
        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI', true, scene);

        const input = new InputText();
        input.width = 0.2;
        input.maxWidth = 0.2;
        input.height = "40px";
        input.text = "Type your guess here";
        input.autoStretchWidth = true;
        input.thickness = 0;
        input.color = "#AAAAAAAA";
        input.background = "#332533FF";
        input.focusedBackground = "#221522FF";
        input.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        // input.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        input.top = '20%';

        advancedTexture.addControl(input);   
        
        /**************************** */


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
        dLight.intensity = 0.2;
        dLight.position.y = 10;

        //Directional light orientation
        dLight.position = dLightOrientation;

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const hLight = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        hLight.intensity = 0.7;

        const env = scene.createDefaultEnvironment({
            createSkybox: true,
            skyboxSize: 150,
            skyboxColor: new Color3(0.01,0.01,0.01),
            createGround: false,
        });

        const shadowGenerator = new ShadowGenerator(512, dLight)
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.blurScale = 2;
        shadowGenerator.setDarkness(0.2);

        shadowGenerator.getShadowMap()!.renderList!.push(torus);

        return scene;
    };
}

export default new TestScene();
