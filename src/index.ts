import { Application } from 'pixi.js'
import { CoreMenuButton } from './menus/CoreMenuButton';
import { MiningTest } from './scenes/Miningtest';

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x223322,
	resizeTo: window,
});

app.stage.addChild(new MiningTest(app))
new CoreMenuButton(app);

