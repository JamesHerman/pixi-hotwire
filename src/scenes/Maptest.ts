import { Application, Container, Graphics, Rectangle } from "pixi.js"
import { Grid } from "../structures/Maps/Grid";
import { Character } from "../structures/Character";
import { Condition, Generator, ProbabilityDistribution } from "../structures/Generators/Generator";
import { Menu } from "../menus/Menu";
import { Linear } from "../structures/Maps/Linear";
export class Scene extends Container {
    private app : Application;

    constructor(app: Application) {
        super()
        this.app = app;
        const cellHeight = app.screen.height/30;
        //const cellWidth = cellHeight * 3/1.732;
        const hero = new Character();
        const notBesideHouses: Condition = {condition: (probability: number, context?: any):number =>{
            if (context) {
                for (let relative of context.relatives) {
                    if (relative.relative !== undefined && (relative.relative.tile === './hextiles/building_cabin_E.png' || relative.relative.tile === './hextiles/building_house_E.png')) {
                        return probability * 0;
                    }
                }
            }
            return probability;}}
        const likelyBesideForest: Condition = {condition: (probability: number, context?: any):number =>{
            let newProbability = probability;
            let forestCount = 0;
            if (context) {
                for (let relative of context.relatives) {
                    if (relative.relative !== undefined && relative.relative.tile === './hextiles/grass_forest_W.png') {
                        forestCount++;
                    }
                }
            }
            if (forestCount > 1) {
                newProbability = probability * 25;
            }  else if (forestCount > 0) {
                newProbability = probability * 5;
            }
            return newProbability;}}
        const likelyBesideWater: Condition = {condition: (probability: number, context?: any):number =>{
            let newProbability = probability;
            let waterCount = 0;
            if (context) {
                for (let relative of context.relatives) {
                    if (relative.relative !== undefined && relative.relative.tile === './hextiles/water_E.png') {
                        waterCount++;
                    }
                }
            }
            if (waterCount > 1) {
                newProbability = probability * 150;
            }  else if (waterCount > 0) {
                newProbability = probability * 10;
            }
            return newProbability;}}
        const probabilities: ProbabilityDistribution ={options: [
            {event: './hextiles/building_cabin_E.png', probability: 0.005, conditions: [notBesideHouses, likelyBesideForest]},
            {event: './hextiles/building_house_E.png', probability: 0.025, conditions: [notBesideHouses]},
            {event: './hextiles/building_tower_E.png', probability: 0.0001, conditions: [likelyBesideWater]},
            {event: './hextiles/grass_E.png', probability: 0.3},
            {event: './hextiles/water_E.png', probability: 0.02, conditions: [likelyBesideWater,likelyBesideForest]},
            {event: './hextiles/sand_E.png', probability: 0.008, conditions: [likelyBesideWater]},
            {event: './hextiles/stone_rocks_E.png', probability: 0.01},
            {event: './hextiles/stone_hill_E.png', probability: 0.01},
            {event: './hextiles/stone_mountain_E.png', probability: 0.005, conditions: [likelyBesideForest]},
            {event: './hextiles/grass_forest_W.png', probability: 0.1, conditions: [likelyBesideForest]},
            {event: './hextiles/dirt_E.png', probability: 0.03},
        ]};
        const spriteGenerator = new Generator(probabilities);
        const map = new Grid(1,1,'hex', cellHeight, spriteGenerator);
        this.addChild(map);

        hero.sprite.scale.set(0.0014);
        hero.sprite.anchor.set(.5,.66);
        hero.sprite.hitArea = new Rectangle(0,0,0,0)
        map.getCell(0,0).addChild(hero.sprite);
        let spriteMask = new Graphics();
        spriteMask.beginFill(0xFFFFFF);
        spriteMask.drawRect(-.5,-.25,1,.75);
        map.on('pointertap',(event) => {
            let menu = new Menu([
                {name: 'Go here', action: ()=>gotToSelectedCell(map)},
                {name: 'Cancel', action: ()=>{}},
                {name: 'Explore', action: ()=> {
                    this.explore(map.getSelectedCell())
                    this.visible=false;
                }}
            ], {x: event.global.x, y: event.global.y-30}, 1);
            this.addChild(menu);
            menu.onpointerleave = () => {
                menu.destroy();
            }
        });
        

        let gotToSelectedCell = (map: Grid) => {
            let cell = map.getSelectedCell();
            cell.addChild(hero.sprite);
            console.log(cell.tile);
            if (cell.tile==='./hextiles/water_E.png') {
                hero.sprite.y = .75;
                cell.addChild(spriteMask);
                hero.sprite.mask = spriteMask;
            } else {
                hero.sprite.y = 0;
                spriteMask.parent? spriteMask.parent.removeChild(spriteMask):null;
                hero.sprite.mask = null;
            }
            if (cell.tile==='./hextiles/stone_mountain_E.png') {
                hero.sprite.y = -1.33;
            }
            if (cell.tile==='./hextiles/building_house_E.png') {
                hero.sprite.scale.set(0.0008);
                hero.sprite.y = 0.33
                hero.sprite.x = 0.25
            } else if (cell.tile==='./hextiles/building_cabin_E.png') {
                hero.sprite.scale.set(0.0008);
                hero.sprite.y = -0.01
                hero.sprite.x = 0
            } else {
                hero.sprite.scale.set(0.0014);
                hero.sprite.x = 0
            }
        }


    }
    private explore = (cell: any) => {
        let linear = new Linear(cell.tile);
        this.app.stage.addChild(linear);
        linear.on('pointertap', () => {
            linear.destroy();
            this.visible = true;
        })
    }
}