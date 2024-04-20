import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

import * as GUI from "@babylonjs/gui";

import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CreateSceneClass } from "../createScene";

// If you don't need the standard material you will still need to import it since the scene requires it.
// import "@babylonjs/core/Materials/standardMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";

import toolboxTextureUrl from "../../assets/img/toolbox.png"
import menuTextureUrl from "../../assets/img/menu.png"

import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Culling/ray";
import menu from "./home";

export class UI implements CreateSceneClass {
    createScene = async (
        engine: Engine,
        canvas: HTMLCanvasElement,
        button?: GUI.Button
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
            "my first camera",
            0,
            Math.PI / 3,
            10,
            new Vector3(0, 0, 0),
            scene
        );

        // This targets the camera to scene origin
        camera.setTarget(Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        // GUI
        const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI', true, scene);

        const container = new GUI.Container();
        container.background = '#FFFFFF55';
        container.width = 0.2;
        container.zIndex = 999;

        // Click effect
        container.onPointerDownObservable.add(()=>{
            container.background = '#FFFFFF65';
        });
        container.onPointerUpObservable.add(()=>{
            container.background = '#FFFFFF55';
        });

        container.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        container.isPointerBlocker = true;
        container.isVisible = false;

        advancedTexture.addControl(container);

        // Menu toggle
        // const menuToggle = new GUI.ToggleButton();
        const menuToggle = GUI.Button.CreateImageOnlyButton('menuToggle', menuTextureUrl)
        menuToggle.width = '0.03';
        menuToggle.fixedRatio = 1;
        menuToggle.verticalAlignment = 10;
        menuToggle.horizontalAlignment = 200;
        menuToggle.color = "#00000000";
        menuToggle.zIndex = 1000;
        menuToggle.onPointerUpObservable.add(()=>{
            container.isVisible = !container.isVisible;
        })
        advancedTexture.addControl(menuToggle);

        const homeButton = GUI.Button.CreateImageOnlyButton('toolbox', toolboxTextureUrl)
        homeButton.width = '0.5';
        homeButton.fixedRatio = 1;
        homeButton.verticalAlignment = 20;
        homeButton.color = "#00000000";
        container.addControl(homeButton);


        const button0 = GUI.Button.CreateSimpleButton('button0', '0')
        button0.cornerRadius = 5;
        button0.width = '0.6';
        button0.height = '40px';
        button0.color = '#00000000';
        button0.background = '#000000AA';
        if(button0.textBlock != undefined)
            button0.textBlock.color = 'white';

        // const button1 = GUI.Button.CreateSimpleButton('button1', '1')
        // button1.width = '0.6';
        // button1.height = '40px';
        // button1.color = 'white';
        // button1.background = 'black';
        
        // const button2 = GUI.Button.CreateSimpleButton('button2', '2')
        // button2.width = '0.6';
        // button2.height = '40px';
        // button2.color = 'white';
        // button2.background = 'black';


        const stackPanel = new GUI.StackPanel();
        stackPanel.spacing = 10;
        stackPanel.addControl(button0);
        container.addControl(stackPanel);

        

        // const buttonScene0 = GUI.Button.CreateSimpleButton('buttonScene0', 'Switch');
        // buttonScene0.width = '200px';
        // buttonScene0.height = '40px';
        // buttonScene0.color = 'white';
        // buttonScene0.background = 'teal';
        // buttonScene0.onPointerUpObservable.add(() => 
        //     {
                
        //     });

        // button = buttonScene0;
        // advancedTexture.addControl(buttonScene0);

        // Allows loading overlapping scenes
        // so the last scene doesn't erase the previous one(s)
        scene.autoClear = false;

        return scene;
    };
}

export default new UI();
