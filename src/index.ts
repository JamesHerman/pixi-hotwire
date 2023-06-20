import { Application } from 'pixi.js'
import { Scene } from './scenes/Maptest'
import { CoreMenuButton } from './menus/CoreMenuButton';

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x223322,
	resizeTo: window,
});

app.renderer.plugins.interaction.autoPreventDefault = false;

app.stage.addChild(new Scene(app))
new CoreMenuButton(app);

