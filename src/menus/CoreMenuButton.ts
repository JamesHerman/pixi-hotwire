import { Application, Container, Graphics, Sprite, Text } from "pixi.js";
import { Menu, MenuOption } from "./Menu";
import { HexTreeTest } from "../scenes/HexTreeTest";
import { MapTest } from "../scenes/Maptest";
import { MiningTest } from "../scenes/Miningtest";
import { AnimationTest } from "../scenes/Scene";

export class CoreMenuButton extends Sprite {

    private button: Graphics;
    private app: Application;
    private label: Text = new Text('Menu');
    private menuColor: number = 0xAD8154;
    private SceneList: MenuOption[] 
    
    private mainMenuOptions: MenuOption[] = [
        { name: 'New Game', action: () => {console.log('New Game')} },
        { name: 'Party', action: () => {console.log('Party')} },
        { name: 'Select Scene', action: () => {this.openSceneMenu()} },
        { name: 'Load Game', action: () => {console.log('Load Game')} },
        { name: 'Settings', action: () => {console.log('Settings')} },
    ]
    private location: {x: number, y: number} = {x: 0, y: 0};
    constructor(app: Application) {
        super();
        this.app = app;
        this.SceneList = [
                { name: 'Hex Tree Test', action: () => {this.newScene(new HexTreeTest(app))} },
                { name: 'Map Test', action: () => {this.newScene(new MapTest(app))} },
                { name: 'Mining Test', action: () => {this.newScene(new MiningTest(app))} },
                { name: 'Animation Test', action: () => {this.newScene(new AnimationTest())} },
            ]
        this.location.x = app.screen.width/2;
        this.location.y = app.screen.height/2;
        this.button = new Graphics;
        this.button.beginFill(this.menuColor);
        this.button.drawRect(-100,0,100,50);
        this.button.alpha = 0.5;
        this.button.endFill();
        this.label.style = {fill: 0x351505};
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
        this.x = app.screen.width - this.width;
        this.y = 0;
        this.zIndex = 100;
        app.stage.addChild(this);
    }

    private openSceneMenu() {
        let x = this.app.screen.width/2;
        let y = this.app.screen.height/2;
        let menu = new Menu(this.SceneList, {x,y}, 1);
        this.app.stage.addChild(menu);
        menu.onpointerdown = () => {
            menu.destroy();
        }
    }       

    private clearStage(app: Application = this.app) {
        app.stage.children.forEach((child) => {
            if (child !== this&&Container.prototype.isPrototypeOf(child)) {
                child.destroy();
            }
        })
    }

    private newScene(scene: Container) {
        this.clearStage();
        this.app.stage.addChild(scene);
        this.app.stage.setChildIndex(scene,0)
    }


    private openMenu() {
        let x = this.app.screen.width/2;
        let y = this.app.screen.height/2;
        let menu = new Menu(this.mainMenuOptions, {x,y}, 1);
        this.app.stage.addChild(menu);
        this.button.on('pointerdown', () => {
            menu.destroy();
        }, 'once')
    }
}