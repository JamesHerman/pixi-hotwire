import { Sprite } from "pixi.js";

export class Character {
    public sprite: Sprite;
    constructor() {
        this.sprite= Sprite.from('./hero.png',{
        });

    }

    public getSprite(): Sprite {
        return this.sprite
    }
}