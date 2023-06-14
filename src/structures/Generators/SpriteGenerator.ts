import { Sprite, Texture } from "pixi.js";

export class SpriteGenerator {
    private spriteTextures: string[];
    
    constructor(spriteTextures: string[]) {
        this.spriteTextures = spriteTextures;
    }

    public Generate(): Sprite {
        const sprite = new Sprite(Texture.from(this.spriteTextures[Math.floor(Math.random() * this.spriteTextures.length)]));
        return sprite;
    }
}