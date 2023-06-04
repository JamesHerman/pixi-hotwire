import { Container} from "pixi.js"
import { Grid } from "../structures/Maps/Grid";

export class Scene extends Container {

    constructor(screenWidth: number, screenHeight: number) {
        super()
        const cellSize = 200;
        const map = new Grid(screenWidth/cellSize,screenHeight/cellSize,'hex', cellSize);
        this.addChild(map)
    }
}