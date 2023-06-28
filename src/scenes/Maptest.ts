import { Application, Container, Rectangle } from "pixi.js"
import { Grid } from "../structures/Maps/Grid";
import { Character } from "../structures/Character";
import { Menu } from "../menus/Menu";
import { Linear } from "../structures/Maps/Linear";
import { Terrain } from "../structures/Generators/Cells/Terrain";
import { Graphics } from "pixi.js";
export class Scene extends Container {
    private app : Application;
    private hero: Character;
    private spriteMask: Graphics;

    constructor(app: Application) {
        super()
        this.app = app;
        const cellHeight = app.screen.height/30;
        //const cellWidth = cellHeight * 3/1.732;
        const hero = new Character();
        this.hero = hero;
        const map = new Grid(1,1,'hex', cellHeight, Terrain);
        this.addChild(map);

        hero.sprite.scale.set(0.0014);
        hero.sprite.anchor.set(.5,.66);
        hero.sprite.hitArea = new Rectangle(0,0,0,0)
        map.getCell(0,0).addChild(hero.sprite);
        let spriteMask = new Graphics();
        this.spriteMask = spriteMask;
        spriteMask.beginFill(0xFFFFFF);
        spriteMask.drawRect(-.5,-.25,1,.75);
        map.on('pointertap',(event) => {
            let menu = new Menu([
                {name: 'Go here', action: ()=>this.goToCell(map.getSelectedCell())},
                {name: 'Cancel', action: ()=>{map.setSelectedCell()}},
                {name: 'Explore', action: ()=> {
                    this.explore(map.getSelectedCell())
                    this.visible=false;
                }}
            ], {x: event.global.x, y: event.global.y-30}, 1);
            this.addChild(menu);
            menu.onpointerdown = () => {
                menu.destroy();
            }
            map.on('pointertap', () => {
                menu.destroy();
            }, 'once')
        });
    }

    private goToCell = (cell: any) => {
        cell.addChild(this.hero.sprite);

        if (cell.tile==='./hextiles/water_E.png') {
            this.hero.sprite.y = .75;
            cell.addChild(this.spriteMask);
            this.hero.sprite.mask = this.spriteMask;
        } else {
            this.hero.sprite.y = 0;
            this.spriteMask.parent? this.spriteMask.parent.removeChild(this.spriteMask):null;
            this.hero.sprite.mask = null;
        }
        if (cell.tile==='./hextiles/stone_mountain_E.png') {
            this.hero.sprite.y = -1.33;
        }
        if (cell.tile==='./hextiles/building_house_E.png') {
            this.hero.sprite.scale.set(0.0008);
            this.hero.sprite.y = 0.33
            this.hero.sprite.x = 0.25
        } else if (cell.tile==='./hextiles/building_cabin_E.png') {
            this.hero.sprite.scale.set(0.0008);
            this.hero.sprite.y = -0.01
            this.hero.sprite.x = 0
        } else {
            this.hero.sprite.scale.set(0.0014);
            this.hero.sprite.x = 0
        }
    }

    private explore = (cell: any) => {
        let linear = new Linear(cell.tile);
        linear.addChild(this.hero.sprite);
        this.hero.sprite.x = screen.width/4;
        this.hero.sprite.y = screen.height/2;
        this.hero.sprite.scale.set(0.3)
        this.hero.sprite.mask = null;
        this.app.stage.addChild(linear);
        linear.on('pointertap', () => {
            linear.destroy();
            this.visible = true;
            this.goToCell(cell);
        })
    }
}