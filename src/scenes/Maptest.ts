import { Container } from "pixi.js"
import { Grid } from "../structures/Maps/Grid";
import { Character } from "../structures/Character";

export class Scene extends Container {

    constructor(screenWidth: number, screenHeight: number) {
        super()
        const cellSize = 60;
        const hero = new Character();
        const map = new Grid(screenWidth/cellSize,screenHeight/cellSize,'hex', cellSize);
        this.addChild(map);
        hero.sprite.scale.set(0.0014);
        hero.sprite.anchor.set(.5,.66);
        map.getCell(0,0).addChild(hero.sprite);
    }
}