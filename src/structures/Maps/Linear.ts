import { Container, Graphics, Text } from "pixi.js";

export class Linear extends Container {
    constructor(tile: string) {
        super();
        this.interactive = true;
        let ground = new Graphics;
        ground.beginFill(0x99BB99);
        ground.drawRect(0,0,screen.width,screen.height/2)
        ground.endFill();
        ground.y = screen.height/2;

        let sky = new Graphics;
        sky.beginFill(0x99BBFF);
        sky.drawRect(0,0,screen.width,screen.height/2)
        sky.endFill();

        let type = new Text(tile);
        type.style = {fill: 0xFFFFFF};
        type.anchor.set(0.5);
        type.x = screen.width/2;
        type.y = screen.height * 0.75;

        this.addChild(type);
        this.addChild(ground);
        this.addChild(sky);
    }
}