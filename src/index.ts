import { Application } from 'pixi.js'
import { Scene } from './scenes/Scene';

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 1920,
	height: 480
});

const sceny: Scene = new Scene()

app.stage.addChild(sceny);