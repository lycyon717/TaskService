var NPC = (function (_super) {
    __extends(NPC, _super);
    function NPC(bitmapName, id, panel, stage) {
        var _this = this;
        _super.call(this);
        this.touchEnabled = true;
        this._id = id;
        this._panel = panel;
        this._stage = stage;
        this.bitmapNPC = new egret.Bitmap;
        this.bitmapNPC.texture = RES.getRes(bitmapName);
        var scaleNum = NPC.NPC_HEIGHT / this.bitmapNPC.height; //缩放为设定的大小
        this.bitmapNPC.scaleY = scaleNum;
        this.bitmapNPC.scaleX = scaleNum;
        this.bitmapNPC.y = NPC.EMOJI_SIZE + 10; //NPC位置应在任务图标下方
        this.emoji = new egret.Bitmap;
        this.emoji.height = NPC.EMOJI_SIZE;
        this.emoji.width = NPC.EMOJI_SIZE;
        this.emoji.x = 40;
        this.emoji.y = 0;
        this.addChild(this.bitmapNPC);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.onNPCClick();
        }, this);
    }
    var d = __define,c=NPC,p=c.prototype;
    d(p, "id"
        ,function () {
            return this._id;
        }
    );
    p.onChange = function (task) {
        if (task.fromNpcId == this.id && task._status == TaskStatus.ACCEPTABLE) {
            console.log("mission !");
            this.emoji.texture = RES.getRes("emoji1_png");
            this.addChild(this.emoji);
        }
        else if (task.toNpcId == this.id && task._status == TaskStatus.CAN_SUBMIT) {
            console.log("mission ?");
            this.emoji.texture = RES.getRes("emoji2_png");
            this.addChild(this.emoji);
        }
        else {
            this.emoji.texture = null;
        }
    };
    p.onNPCClick = function () {
        console.log("touch NPC");
        var task = TaskService.taskService.getTaskByCustomRule(this.rule);
        if (task == null) {
            console.log("No Mission On this NPC");
            return ErrorCode.MISSING_TASK;
        }
        this._panel.textField.text = task.desc;
        this._panel.NPCId = this._id;
        this._stage.setChildIndex(this._panel, this._stage.numChildren - 1);
    };
    p.rule = function (taskList) {
        for (var taskid in taskList) {
            if (taskList[taskid]._status == TaskStatus.ACCEPTABLE || taskList[taskid]._status == TaskStatus.CAN_SUBMIT) {
                return taskList[taskid];
            }
        }
        return null;
    };
    NPC.NPC_HEIGHT = 200;
    NPC.EMOJI_SIZE = 50;
    return NPC;
}(egret.DisplayObjectContainer));
egret.registerClass(NPC,'NPC',["Observer"]);
//# sourceMappingURL=NPC.js.map