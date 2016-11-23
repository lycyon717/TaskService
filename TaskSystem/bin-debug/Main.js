var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.onAddToStage = function (event) {
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    p.onResourceLoadError = function (event) {
        console.warn("Group:" + event.groupName + " has failed to load");
        this.onResourceLoadComplete(event);
    };
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    p.createGameScene = function () {
        var sky = this.createBitmapByName("TaskSys_jpg");
        this.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        var task = new Task("Task01", "欢迎来到迷之游戏！这是新手任务！", TaskStatus.ACCEPTABLE, 0, npctalkcondition);
        var task2 = new Task("Task02", "去杀十个怪！", TaskStatus.UNACCEPTABLE, 10, killcondition);
        var npctalkcondition = new NPCTalkTaskCondition(task, "npc1", "npc2", task._name);
        var killcondition = new KillMonsterTaskCondition(task2, task2._total, "monster1", "npc2", "npc2", task2._name);
        var dia = new DialoguePanel(this);
        var sceneservice = new SceneService();
        var npc1 = new NPC("NPC1_png", "npc1", dia, this, sceneservice);
        var npc2 = new NPC("NPC2_png", "npc2", dia, this, sceneservice);
        var taskPanel = new TaskPanel(sceneservice);
        var mockMonster = new MockKillMonsterButton(sceneservice, "monster1");
        dia.x = 100;
        dia.y = 100;
        npc1.x = 1500;
        npc1.y = 500;
        npc2.x = 300;
        npc2.y = 250;
        mockMonster.x = 1000;
        mockMonster.y = 500;
        dia.x = (stageW - DialoguePanel.TOTAL_WIDTH) / 2;
        dia.y = (stageH - DialoguePanel.TOTAL_HEIGHT) / 2;
        taskPanel.x = stageW - TaskPanel.TOTAL_WIDTH;
        taskPanel.y = (stageH - TaskPanel.TOTAL_HEIGHT) / 2;
        this.addChild(npc1);
        this.addChild(npc2);
        this.addChildAt(dia, 0);
        this.addChild(taskPanel);
        this.addChild(mockMonster);
        var taskservice = new TaskService(sceneservice);
        taskservice.addTask(task);
        taskservice.addTask(task2);
        sceneservice.addTaskCondition(killcondition);
        sceneservice.addTaskCondition(npctalkcondition);
        sceneservice.addsceneStuff(npc1);
        sceneservice.addsceneStuff(npc2);
        sceneservice.addsceneStuff(taskPanel);
    };
    /*private createTask(id:string){
        var data ={
            "111":{name: "欢迎来到Mr.Liang的游戏！",condition:"npctalk"},
            "112":{name: "去杀十个怪！", condition:"killmonster"},
        }
        var info = data[id];
        if(!info){
            console.error("missing task!");

        }
        var condition =createTaskCondition(info.condition);
        return new Task(id,info.name,condition);
    }*/
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
//# sourceMappingURL=Main.js.map