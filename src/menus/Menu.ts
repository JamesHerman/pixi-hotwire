import { Container, Graphics, Text } from "pixi.js";

export class Menu extends Container {
    private options: MenuOption[];
    constructor(options: MenuOption[], position?: {x: number, y: number}, scale?: number) {
        super();
        position? this.position = position : this.position = {x: 0, y: 0};
        this.scale.set(scale);
        this.position.set(position?.x,position?.y);
        this.options = options;
        this.options.forEach((option: MenuOption, index: number) => {
            this.createOption(option, index);
        })
        this.onpointerupoutside = () => {
            this.destroy();
        }
        console.log(this)
    }

    private createOption(option: MenuOption, index: number) {
        let optionContainer = new Container;
        let optionText = new Text(option.name);
        let optionBackground = new Graphics;
        optionBackground.beginFill(0x000000);
        optionBackground.drawRect(-100,0,200,30);
        optionBackground.alpha = 0.5;
        optionBackground.endFill();
        optionContainer.addChild(optionBackground);
        optionText.style = {fill: 0xFFFFFF};
        optionText.anchor.set(0.5);
        optionText.x = 0;
        optionText.y = 15;
        optionBackground.addChild(optionText);
        optionContainer.y = index * 30;
        optionContainer.interactive = true;
        optionContainer.on('pointerover', () => {
            optionBackground.alpha = 1;
        })
        optionContainer.on('pointerout', () => {
            optionBackground.alpha = 0.5;
        })
        optionContainer.on('pointerdown', () => {
            option.action();
            this.destroy();
        })
        this.addChild(optionContainer);
    }
}

export interface MenuOption {
    name: string,
    action: Function,
}