import { Grid } from "../../Maps/Grid";
import { Cell } from "../../Maps/MapCell";
import { Sprite, Polygon } from "pixi.js";
import { Selector, ProbabilityDistribution, Condition } from "../../Generators/Selector";

export class Terrain extends Cell {
    public tile: string;
    private sprite: Sprite;
    private notBesideHouses: Condition = {condition: (probability: number, context?: any):number =>{
        if (context) {
            for (let relative of context.relatives) {
                if (relative.entity && (relative.entity.tile === './hextiles/building_cabin_E.png' || relative.entity.tile === './hextiles/building_house_E.png')) {
                    return probability * 0;
                }
            }
        }
        return probability;}}
    private likelyBesideForest: Condition = {condition: (probability: number, context?: any):number =>{
        let newProbability = probability;
        let forestCount = 0;
        if (context) {
            for (let relative of context.relatives) {
                if (relative.entity && relative.entity.tile === './hextiles/grass_forest_W.png') {
                    forestCount++;
                }
            }
        }
        if (forestCount > 1) {
            newProbability = probability * 10;
        }  else if (forestCount > 0) {
            newProbability = probability * 3;
        }
        return newProbability;}}
    private likelyBesideWater: Condition = {condition: (probability: number, context?: any):number =>{
        let newProbability = probability;
        let waterCount = 0;
        if (context) {
            for (let relative of context.relatives) {
                if (relative.entity && relative.entity.tile === './hextiles/water_E.png') {
                    waterCount++;
                }
            }
        }
        if (waterCount > 1) {
            newProbability = probability * 105;
        }  else if (waterCount > 0) {
            newProbability = probability * 5;
        }
        return newProbability;}}
    
    private probabilities: ProbabilityDistribution ={options: [
        {event: './hextiles/building_cabin_E.png', probability: 0.005, conditions: [this.notBesideHouses, this.likelyBesideForest]},
        {event: './hextiles/building_house_E.png', probability: 0.025, conditions: [this.notBesideHouses]},
        {event: './hextiles/building_tower_E.png', probability: 0.0001, conditions: [this.likelyBesideWater]},
        {event: './hextiles/grass_E.png', probability: 0.3},
        {event: './hextiles/water_E.png', probability: 0.05, conditions: [this.likelyBesideWater]},
        {event: './hextiles/sand_E.png', probability: 0.008, conditions: [this.likelyBesideWater]},
        {event: './hextiles/stone_rocks_E.png', probability: 0.01},
        {event: './hextiles/stone_hill_E.png', probability: 0.01},
        {event: './hextiles/stone_mountain_E.png', probability: 0.005, conditions: [this.likelyBesideForest]},
        {event: './hextiles/grass_forest_W.png', probability: 0.1, conditions: [this.likelyBesideForest]},
        {event: './hextiles/dirt_E.png', probability: 0.03},
    ]};

    constructor(x: number, y: number, parent: Grid, type?: 'hex' | 'square') {
        super(x,y,parent,type);
        const spriteSelector = new Selector(this.probabilities);
        let sprite = Sprite.from(spriteSelector.select({
                relatives: this.getNeighbors().map((cell: Cell) => {
                    return {entity: cell, relationship:"neighbor"}
                })  
            }, 1
        ));
        this.tile = sprite.texture.textureCacheIds[0];
        let scale = 0.0095;
        sprite.y = 1
        sprite.scale.set(scale);
        sprite.anchor.set(0.5,0.8)
        this.sprite = sprite;
        let hitArea = new Polygon([1,-0.64,0.5,-0.2,-0.5,-0.2,-1,-0.64,-0.5,-1.08,0.5,-1.08])
        for (let point in hitArea.points) {
            hitArea.points[point] /= scale;
        }
        this.sprite.hitArea = hitArea;
        this.addChild(sprite);
    }
}