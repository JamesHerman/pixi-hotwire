import { Application, Sprite, Texture } from 'pixi.js'
import { Skill } from '../static/structures/Skill'

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 1920,
	height: 480
});

const clampy = new Sprite(Texture.from('./clampies/clampy.png'))
clampy.x = 0;
clampy.y = 0;
clampy.scale.set(1)
app.stage.addChild(clampy);
let mining = new Skill()
console.log(mining.getLevel())
while (mining.getLevel() < 5) {
	console.log('Checking mining')
	mining.check({
		successRate: 0.55,
		level: Math.ceil(Math.random()*6),
		outcome: (result: boolean) => {
			if (result) {
				console.log('the mining was a success, mining level: ' + mining.getLevel());
			}else {
				console.log('the mining failed');
			}
		}
	})
}
