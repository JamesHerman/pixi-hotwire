import { Application } from 'pixi.js'
import { Scene } from './scenes/Maptest'

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x007700,
	resizeTo: window,
});

app.renderer.plugins.interaction.autoPreventDefault = false;

app.stage.addChild(new Scene(app.screen.width,app.screen.height))

