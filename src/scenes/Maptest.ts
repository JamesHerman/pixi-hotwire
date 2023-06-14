import { Container } from "pixi.js"
import { Grid } from "../structures/Maps/Grid";
import { Character } from "../structures/Character";
import { SpriteGenerator } from "../structures/Generators/SpriteGenerator";

export class Scene extends Container {

    constructor(screenWidth: number, screenHeight: number) {
        super()
        const cellSize = 60;
        const hero = new Character();
        const spriteGenerator = new SpriteGenerator([
            './hextiles/building_cabin_E.png',
            './hextiles/building_house_E.png',
            './hextiles/building_tower_E.png',
            './hextiles/grass_E.png',
            './hextiles/water_E.png',
            './hextiles/sand_E.png',
            './hextiles/stone_rocks_E.png',
            './hextiles/stone_hill_E.png',
            './hextiles/stone_mountain_E.png',
            './hextiles/dirt_E.png',
        ]);
        const map = new Grid(screenWidth/cellSize,screenHeight/cellSize,'hex', cellSize, spriteGenerator);
        this.addChild(map);
        hero.sprite.scale.set(0.0014);
        hero.sprite.anchor.set(.5,.66);
        map.getCell(Math.floor(screenWidth/(2*cellSize)),Math.floor(screenHeight/(2*cellSize))).addChild(hero.sprite);
        map.on('pointertap',() => {
            map.getSelectedCell().addChild(hero.sprite);
        });
    }
}