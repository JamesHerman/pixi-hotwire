import { Container, Sprite, Texture, Text, } from "pixi.js"
import * as Particles from '@pixi/particle-emitter'
import { Skill } from '../structures/Skill'
import * as particleSettings from '../emitters/rockspray.json'

export class Scene extends Container {

    constructor(screenWidth: number, screenHeight: number) {
        super()
        const rock = new Sprite(Texture.from('./clampies/rock.png'))
        const rockSpray = new Container();
        const rockSpraySettings = Particles.upgradeConfig(particleSettings, [ './rocks/Stones_ores_gems_without_grass-0.png',
            './rocks/Stones_ores_gems_without_grass-1.png',
            './rocks/Stones_ores_gems_without_grass-2.png',
            './rocks/Stones_ores_gems_without_grass-3.png',
            './rocks/Stones_ores_gems_without_grass-4.png',
            './rocks/Stones_ores_gems_without_grass-5.png',
            './rocks/Stones_ores_gems_without_grass-6.png',
            './rocks/Stones_ores_gems_without_grass-7.png',
            './rocks/Stones_ores_gems_without_grass-8.png',
            './rocks/Stones_ores_gems_without_grass-9.png',
            './rocks/Stones_ores_gems_without_grass-10.png',
            './rocks/Stones_ores_gems_without_grass-11.png',
            './rocks/Stones_ores_gems_without_grass-12.png',
            './rocks/Stones_ores_gems_without_grass-13.png',
            './rocks/Stones_ores_gems_without_grass-14.png',
            './rocks/Stones_ores_gems_without_grass-15.png',
            './rocks/Stones_ores_gems_without_grass-16.png',
            './rocks/Stones_ores_gems_without_grass-17.png',
            './rocks/Stones_ores_gems_without_grass-18.png',
            './rocks/Stones_ores_gems_without_grass-19.png',
            './rocks/Stones_ores_gems_without_grass-20.png',
            './rocks/Stones_ores_gems_without_grass-21.png',
            './rocks/Stones_ores_gems_without_grass-22.png',
            './rocks/Stones_ores_gems_without_grass-23.png',
            './rocks/Stones_ores_gems_without_grass-24.png',
            './rocks/Stones_ores_gems_without_grass-25.png',
            './rocks/Stones_ores_gems_without_grass-26.png',
            './rocks/Stones_ores_gems_without_grass-27.png',
            './rocks/Stones_ores_gems_without_grass-28.png',
            './rocks/Stones_ores_gems_without_grass-29.png',
            './rocks/Stones_ores_gems_without_grass-30.png',
            './rocks/Stones_ores_gems_without_grass-31.png',
            './rocks/Stones_ores_gems_without_grass-32.png',
            './rocks/Stones_ores_gems_without_grass-33.png',
            './rocks/Stones_ores_gems_without_grass-34.png',
            './rocks/Stones_ores_gems_without_grass-35.png',
            './rocks/Stones_ores_gems_without_grass-36.png',
            './rocks/Stones_ores_gems_without_grass-37.png',
            './rocks/Stones_ores_gems_without_grass-38.png',
            './rocks/Stones_ores_gems_without_grass-39.png',
            './rocks/Stones_ores_gems_without_grass-40.png',
            './rocks/Stones_ores_gems_without_grass-41.png',
            './rocks/Stones_ores_gems_without_grass-42.png',
            './rocks/Stones_ores_gems_without_grass-43.png',
            './rocks/Stones_ores_gems_without_grass-44.png',
            './rocks/Stones_ores_gems_without_grass-45.png',
            './rocks/Stones_ores_gems_without_grass-46.png',
            './rocks/Stones_ores_gems_without_grass-47.png',
            './rocks/Stones_ores_gems_without_grass-48.png',
            './rocks/Stones_ores_gems_without_grass-49.png',
            './rocks/Stones_ores_gems_without_grass-50.png',
            './rocks/Stones_ores_gems_without_grass-51.png',
            './rocks/Stones_ores_gems_without_grass-52.png',
            './rocks/Stones_ores_gems_without_grass-53.png',
            './rocks/Stones_ores_gems_without_grass-54.png',
            './rocks/Stones_ores_gems_without_grass-55.png',
            './rocks/Stones_ores_gems_without_grass-56.png',
            './rocks/Stones_ores_gems_without_grass-57.png',
            './rocks/Stones_ores_gems_without_grass-58.png'
        ])
        const rockEmitter = new Particles.Emitter(rockSpray,rockSpraySettings);
        rock.anchor.set(.5)
        rockEmitter.autoUpdate = true;
        rockEmitter.emit = true;
        rock.x = screenWidth/2;
        rock.y = screenHeight/2;
        rock.scale.set(screenHeight/2000)
        rockSpray.scale.set(2)
        rock.cursor ="url('./clampies/pickaxe.png'),auto"
        rock.addChild(rockSpray);
        this.addChild(rock);
        rockEmitter.playOnce()
        let mining = new Skill()
        console.log(mining.getLevel())
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