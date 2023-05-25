import { Application } from 'pixi.js'
import { Scene } from './scenes/Miningtest'

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	resizeTo: window,
});

app.stage.addChild(new Scene(app.screen.width,app.screen.height))

