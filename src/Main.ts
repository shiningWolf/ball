//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {
 
    private label:egret.TextField
    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json");
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    private textfield: egret.TextField;
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
       this. createBorder();
       this.createText();
    }

    /**
     * 绘制边框
     * Create scene interface
     */
    protected createBorder():void{
        let shp:egret.Shape = new egret.Shape();
        const leftoffset:number  = 30;
        const bottomoffset:number  = 50;
        const lineY:number  = 100;
        const circleD:number = 12;  //小球半径
        let between:number = 2 * circleD;
        shp.graphics.lineStyle( 2, 0x00ff00 );
        shp.graphics.moveTo( leftoffset, this.stage.stageHeight - bottomoffset);
        shp.graphics.lineTo( leftoffset,20);
        shp.graphics.lineTo((this.stage.stageWidth-between)/2,lineY);
        shp.graphics.moveTo( (this.stage.stageWidth-between)/2+between, lineY);
        shp.graphics.lineTo(this.stage.stageWidth - leftoffset,20);
        shp.graphics.lineTo( this.stage.stageWidth - leftoffset, this.stage.stageHeight - bottomoffset);
        shp.graphics.moveTo( leftoffset, lineY+20);
        shp.graphics.lineTo((this.stage.stageWidth-between)/2,lineY+20);
        shp.graphics.moveTo( (this.stage.stageWidth-between)/2+between, lineY+20);
        shp.graphics.lineTo(this.stage.stageWidth-leftoffset,lineY+20);
        shp.graphics.endFill();
        shp.graphics.beginFill( 0xff0000, 1);
        shp.graphics.drawCircle( this.stage.stageWidth/2,lineY + 20+circleD, circleD );
        shp.graphics.endFill();
        shp.graphics.beginFill( 0xffffff, 1);
        shp.graphics.drawCircle( this.stage.stageWidth/2,lineY - 5 - circleD, circleD );
        shp.graphics.endFill();
        this.addChild( shp );
    }

    protected createText():void{
        this.label = new egret.TextField(); 
        this.label.text = "0";
        this.label.x = this.stage.stageWidth - 100;
        this.label.y = 50;
        this.addChild( this.label );
    }
}
