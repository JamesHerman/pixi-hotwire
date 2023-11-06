import { Container, Sprite, Texture, Text, Application } from "pixi.js"
import * as Particles from '@pixi/particle-emitter'
import { Skill } from '../structures/Skill'
import * as particleSettings from '../emitters/rockspray.json'

export class MiningTest extends Container {

    constructor (app: Application) {
        super()
        const screenWidth = app.screen.width;
        const screenHeight = app.screen.height;
        const rock = new Sprite(Texture.from('../hexTiles/stone_hill_E.png'))
        const rockSpray = new Container();
        let text = new Text('clink', {fill: 0xFFFFFF, fontSize:90}) as any;
        text.anchor.set(0.5);
        text.x = text.width/2;
        text.y = text.height/2;

        const rockSpraySettings = Particles.upgradeConfig(particleSettings, [
            '../Clink!.png',
        ])
        const rockEmitter = new Particles.Emitter(rockSpray,rockSpraySettings);
        rock.anchor.set(.5)
        rockEmitter.emit = true;
        rockEmitter.autoUpdate = true;
        rock.x = screenWidth/2;
        rock.y = screenHeight/2;
        rock.scale.set(2)
        rockSpray.scale.set(1)
        rock.addChild(rockSpray);
        this.addChild(rock);
        rockEmitter.playOnce()
        let mining = new Skill()
        rock.interactive = true;
        const miningLevelDisplay = new Text("Mining Level: " + mining.getLevel())
        rock.on('pointertap', () => {
            console.log('Checking mining')
            mining.check({
                successRate: 0.55,
                level: Math.ceil(Math.random()*6),
                outcome: (result: boolean) => {
                    if (result) {
                        rockEmitter.playOnce()
                        miningLevelDisplay.text = "Mining level: " + mining.getLevel()
                        console.log('the mining was a success, mining level: ' + mining.getLevel());                    
                    }else {
                        console.log('the mining failed');
                    }
                }
            })
        })
        miningLevelDisplay.y= screenHeight-miningLevelDisplay.height
        this.addChild(miningLevelDisplay)
    }

}