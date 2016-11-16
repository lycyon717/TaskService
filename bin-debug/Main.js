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
        var taskService = new TaskService();
        var dialoguePanel = new DialoguePanel(this);
        var taskPanel = new TaskPanel();
        var npc_0 = new NPC("NPC1_png", "npc_0", dialoguePanel, this);
        var npc_1 = new NPC("NPC2_png", "npc_1", dialoguePanel, this);
        var task = new Task("01", "Begin", "npc_0", "npc_1", TaskStatus.ACCEPTABLE);
        task.desc = "欢迎来到 Mr.Liang 的游戏。";
        npc_0.x = 1500;
        npc_0.y = 500;
        npc_1.x = 300;
        npc_1.y = 250;
        dialoguePanel.x = (stageW - DialoguePanel.TOTAL_WIDTH) / 2;
        dialoguePanel.y = (stageH - DialoguePanel.TOTAL_HEIGHT) / 2;
        taskPanel.x = stageW - TaskPanel.TOTAL_WIDTH;
        taskPanel.y = (stageH - TaskPanel.TOTAL_HEIGHT) / 2;
        taskService.addObserver(npc_0);
        taskService.addObserver(npc_1);
        taskService.addObserver(taskPanel);
        taskService.addTask(task);
        this.addChild(npc_0);
        this.addChild(npc_1);
        this.addChildAt(dialoguePanel, 0);
        this.addChild(taskPanel);
    };
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