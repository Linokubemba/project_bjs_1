/*
* PRIME COUNTER
*/

import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateTorusKnot } from "@babylonjs/core/Meshes/Builders/torusKnotBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CreateSceneClass } from "../createScene";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { AdvancedDynamicTexture, Button, Control, StackPanel, TextBlock } from "@babylonjs/gui";

export class TestScene implements CreateSceneClass {
    createScene = async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        // This creates a basic Babylon Scene object (non-mesh)
        const scene = new Scene(engine);

        // This creates and positions a free camera (non-mesh)
        const cameraRadius: number = 7;
        const camera = new ArcRotateCamera(
            "arcRotateCamera",
            0,
            Math.PI / 2,
            cameraRadius,
            new Vector3(0, 1, 0),
            scene
        );

        camera.minZ = 0.1;
        camera.wheelDeltaPercentage = 0.01;
        camera.upperRadiusLimit = cameraRadius;
        camera.lowerRadiusLimit = cameraRadius;
        camera.panningSensibility = 0;

        // This targets the camera to scene origin
        camera.setTarget(Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        //Create PBR material
        const pbr = new PBRMaterial("pbr", scene);
        pbr.metallic = 0;
        pbr.roughness = 1;
        pbr.subSurface.isRefractionEnabled = true;
        pbr.subSurface.indexOfRefraction = 1.5;
        pbr.subSurface.tintColor = Color3.Black();

        const torus = CreateTorusKnot("torus", {
            radius: 1,
            tube: 0.5,
            radialSegments: 128,
            tubularSegments: 128
        },
            scene
        );

        torus.position.y = 1.2;
        torus.rotation.y = Math.PI / 2;
        torus.material = pbr;

        //* ***************************************
        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI');

        // INSTRUCTIONS
        const userInstructions = new TextBlock();
        userInstructions.text =
            `PRIMER NUMBER COUNTER
            Press - or + to display the
            previous or the next prime number`;
        userInstructions.color = "white";
        userInstructions.fontSize = 20;
        userInstructions.top = '30%';
        advancedTexture.addControl(userInstructions);

        // BUTTONS
        const buttonUp = Button.CreateSimpleButton('buttonUp', '+')
        buttonUp.horizontalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        buttonUp.cornerRadius = 5;
        buttonUp.width = '200px';
        buttonUp.height = '40px';
        buttonUp.color = 'green';
        buttonUp.background = 'teal';
        if (buttonUp.textBlock != undefined)
            buttonUp.textBlock.color = 'white';

        const buttonDown = Button.CreateSimpleButton('buttonDown', '-')
        buttonDown.horizontalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        buttonDown.cornerRadius = 5;
        buttonDown.width = '200px';
        buttonDown.height = '40px';
        buttonDown.color = 'green';
        buttonDown.background = 'teal';
        if (buttonDown.textBlock != undefined)
            buttonDown.textBlock.color = 'white';

        const stackPanel = new StackPanel();
        stackPanel.isVertical = false;
        stackPanel.spacing = 5;
        stackPanel.addControl(buttonDown);
        stackPanel.addControl(buttonUp);
        stackPanel.zIndex = 1000;
        advancedTexture.addControl(stackPanel);

        // INTERACTIONS
        let counter: number = 2;

        const counterDisplay = new TextBlock();
        counterDisplay.text = counter.toString();
        counterDisplay.color = "white";
        counterDisplay.fontSize = 56;
        counterDisplay.top = '-20%';
        advancedTexture.addControl(counterDisplay);

        /**
         * 
         * @param {num: number} 
         * Chiffre actuel du counter
         * @description Il va d'abord vérifier si le nombre est pair. 
         *              S'il est impair alors il rentre dans la boucle for et on va venir 
         *              s'il existe un diviseur. S'il en existe pas, alors c'est un nombre premier ! 
         * @returns un bouléen s'il ets premier ou pas
         */
        //TODO: Do something when buttons are pressed
        function checkPrime(num: number) {
            if (num % 2 === 0) return false;

            for (let i: number = 3; i < Math.floor(num / 2); i++) {
                if (num % i === 0) return false;
            }
            return true;
        }

        /**
         * 
         * @param {counter: number, next: string} 
         * Counter num actuel, next, la direction du prochain 
         * @returns le nombre premier suivant 
         */
        function nextNumber(counter: number, next: string): number {
            if (next === "down") {
                if (counter === 2) return 2;

                for (let i: number = counter; i > 2; i--) {
                    if (checkPrime(i)) return i;
                }
            }

            let num = counter + 1;
            while (!checkPrime(num)) {
                num++;
            }
            return num;
        }


        buttonDown.onPointerUpObservable.add(() => {
            const down: number = nextNumber(counter, "down");
            counterDisplay.text = down.toString();
            counter = down;
        });

        buttonUp.onPointerUpObservable.add(() => {
            const up: number = nextNumber(counter, "")
            counterDisplay.text = up.toString();
            counter = up;
        });
        //* ***************************************


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
            skyboxColor: new Color3(0.01, 0.01, 0.01),
            createGround: false,
        });

        return scene;
    };
}

export default new TestScene();
