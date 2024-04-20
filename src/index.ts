import { Engine } from "@babylonjs/core/Engines/engine";
import { WebGPUEngine } from "@babylonjs/core/Engines/webgpuEngine";
import { getScenesModule } from "./createScene";
import * as GUI from "@babylonjs/gui";
import { Scene } from "@babylonjs/core";


export const babylonInit = async (): Promise<void> => {

    // Reference the scene creators
    const creatorHome = getScenesModule();
    const creatorEasy0 = getScenesModule("easy0");
    const creatorUI = getScenesModule("UI");

    const engineType =
        location.search.split("engine=")[1]?.split("&")[0] || "webgl";
    // Execute the pretasks, if defined
    // await Promise.all(createScenesModule.preTasks || []);

    // Get the canvas element
    const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
    // Generate the BABYLON 3D engine
    let engine: Engine;
    if (engineType === "webgpu") {
        const webGPUSupported = await WebGPUEngine.IsSupportedAsync;
        if (webGPUSupported) {
            // You can decide which WebGPU extensions to load when creating the engine. I am loading all of them
            await import("@babylonjs/core/Engines/WebGPU/Extensions/");
            const webgpu = engine = new WebGPUEngine(canvas, {
                adaptToDeviceRatio: true,
                antialias: true,
            });
            await webgpu.initAsync();
            engine = webgpu;
        } else {
            engine = new Engine(canvas, true);
        }
    } else {
        engine = new Engine(canvas, true);
    }

    // Create the scenes
    // const button = new GUI.Button();
    const UI = await creatorUI.createScene(engine, canvas);
    const home = await creatorHome.createScene(engine, canvas);
    const easy0 = await creatorEasy0.createScene(engine, canvas);

    const scenes: Scene[] = [home, easy0];
    
    let currentScene = home;

    // Switch between scenes
    // (UI.getTextureByName('UI') as GUI.AdvancedDynamicTexture).getControlByName('menuButton')?.onPointerUpObservable.add(()=>{
    //     if(currentScene === menuScene)
    //         {
    //             currentScene = scene0;
    //         }
    //         else
    //         {
    //             currentScene = menuScene;
    //         }    
    // });

    // console.log(GUI.Button.toString());

    if(UI.isReady())
    {
        const buttons: GUI.Control[] = (UI.getTextureByName('UI') as GUI.AdvancedDynamicTexture).getControlsByType('Button');
        if(buttons.length > 0)
        {
            for (let index = 0; index < buttons.length; index++) {
                if(buttons[index].name != 'menuToggle')
                {                
                    buttons[index].onPointerUpObservable.add(()=>
                    {
                        currentScene = scenes[index];
                    }); 
                }               
            }

            // buttons.forEach(b => {
            //     b.onPointerUpObservable.add(()=>
            //     {

            //     })
            // });
        }
    }

    



    // JUST FOR TESTING. Not needed for anything else
    // (window as any).scene = scene;

    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function () {
        currentScene.render();
        UI.render();
    });

    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
        engine.resize();
    });
};

babylonInit().then(() => {
    // scene started rendering, everything is initialized
});
