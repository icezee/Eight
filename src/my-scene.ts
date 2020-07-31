import * as BABYLON from 'babylonjs';

class Music {
    private _music: BABYLON.Sound
    private _analyser: BABYLON.Analyser

    constructor(scene: BABYLON.Scene) {
        this._music = new BABYLON.Sound(
            "Music", 
            "//www.babylonjs.com/demos/AudioAnalyser/cosmosis.mp3",
            scene, null, { streaming: true, autoplay: true })   

        this._analyser = new BABYLON.Analyser(scene)
        BABYLON.Engine.audioEngine.connectToAnalyser(this._analyser)
        this._analyser.FFT_SIZE = 32
        this._analyser.SMOOTHING = 0.9
    }

    update() {
        let fft = this._analyser.getByteFrequencyData()
        return(fft)
    }

}

export default class MyScene {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.ArcRotateCamera;
    private _light: BABYLON.Light;

    private _sphere: BABYLON.Mesh

    private _m: Music;

    constructor(canvasElement : string) {
        // Create canvas and engine.
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    createScene() : void {
        // Create a basic BJS Scene object.
        this._scene = new BABYLON.Scene(this._engine);

        // Create a FreeCamera, and set its position to (x:0, y:5, z:-10).
        this._camera = new BABYLON.ArcRotateCamera('camera1',0, 0, 10, new BABYLON.Vector3(0, 0, 0), this._scene)
        //this._camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5,-10), this._scene);

        // Target the camera to scene origin.
        this._camera.setTarget(BABYLON.Vector3.Zero());

        // Attach the camera to the canvas.
        this._camera.attachControl(this._canvas, false);

        // Create a basic light, aiming 0,1,0 - meaning, to the sky.
        this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), this._scene);

        // Create a built-in "sphere" shape; with 16 segments and diameter of 2.
        this._sphere = BABYLON.MeshBuilder.CreateSphere('sphere1',
                                {segments: 16, diameter: 2}, this._scene);

        // Move the sphere upward 1/2 of its height.
        this._sphere.position.y = 1;

        // Create a built-in "ground" shape.
        let ground = BABYLON.MeshBuilder.CreateGround('ground1',
                                {width: 6, height: 6, subdivisions: 2}, this._scene);

        this._m = new Music(this._scene)
    }

    update(): void {
        this._scene.registerBeforeRender(() => {
            let a = this._m.update()
            console.log(a)
            this._sphere.scaling = new BABYLON.Vector3(a[20],a[21],a[22])
        })

    }

    doRender() : void {
        // Run the render loop.
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });

        // The canvas/window resize event handler.
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }
}