import { Application, Graphics, Sprite, Text } from "pixi.js";
import { Menu, MenuOption } from "./Menu";

export class CoreMenuButton extends Sprite {
    private button: Graphics;
    private app: Application;
    private label: Text = new Text('Menu');
    private mainMenuOptions: MenuOption[] = [
        { name: 'New Game', action: () => {console.log('New Game')} },
        { name: 'Party', action: () => {console.log('Party')} },
        { name: 'Load Game', action: () => {console.log('Load Game')} },
        { name: 'Settings', action: () => {console.log('Settings')} },
    ]
    private location: {x: number, y: number} = {x: 0, y: 0};
    constructor(application: Application) {
        super();
        this.app = application;
        this.location.x = application.screen.width/2;
        this.location.y = application.screen.height/2;
        this.button = new Graphics;
        this.button.beginFill(0x000000);
        this.button.drawRect(-100,0,100,50);
        this.button.alpha = 0.5;
        this.button.endFill();
        this.label.style = {fill: 0xFFFFFF};
        this.label.anchor.set(0.5);
        this.label.x = -50;
        this.label.y = 25;
        this.button.addChild(this.label);
        this.button.interactive = true;
        this.button.on('pointerover', () => {
            this.button.alpha = 1;
        })
        this.button.on('pointerout', () => {
            this.button.alpha = 0.5;
        })
        this.button.on('pointerdown', () => {
            this.openMenu();
        })
        this.addChild(this.button);
        this.anchor.set(1,0);
        this.x = application.screen.width - this.width;
        this.y = 0;
        this.zIndex = 100;
        application.stage.addChild(this);
    }

    private openMenu() {
        let x = this.app.screen.width/2;
        let y = this.app.screen.height/2;
        let menu = new Menu(this.mainMenuOptions, {x,y}, 1);
        this.app.stage.addChild(menu);
    }
}