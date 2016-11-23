var NPC = (function (_super) {
    __extends(NPC, _super);
    function NPC(bitmapName, id, panel, stage, sceneService) {
        var _this = this;
        _super.call(this);
        this.rule = function (taskConditionList) {
            for (var _i = 0, taskConditionList_1 = taskConditionList; _i < taskConditionList_1.length; _i++) {
                var taskCondition = taskConditionList_1[_i];
                if ((taskCondition._task.getTaskStatus() == TaskStatus.ACCEPTABLE
                    && taskCondition._fromNpcId == _this._id)
                    || (taskCondition._task.getTaskStatus() == TaskStatus.CAN_SUBMIT
                        && taskCondition._toNpcId == _this._id)) {
                    return taskCondition;
                }
            }
            return null;
        };
        this.touchEnabled = true;
        this._id = id;
        this._panel = panel;
        this._stage = stage;
        this._sceneService = sceneService;
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
    p.onChange = function () {
        var taskcondition = this.rule(this._sceneService.taskConditionList);
        if (taskcondition == null) {
            console.log("No picture");
            this.emoji.texture = null;
            return ErrorCode.MISSING_TASK;
        }
        if (taskcondition._fromNpcId == this._id && taskcondition._task.getTaskStatus() == TaskStatus.ACCEPTABLE) {
            console.log("mission !");
            this.emoji.texture = RES.getRes("emoji1_png");
            this.addChild(this.emoji);
        }
        else if (taskcondition._toNpcId == this._id && taskcondition._task.getTaskStatus() == TaskStatus.CAN_SUBMIT) {
            console.log("mission ?");
            this.emoji.texture = RES.getRes("emoji2_png");
            this.addChild(this.emoji);
        }
        else {
            console.log("done!");
            this.emoji.texture = null;
        }
    };
    p.onNPCClick = function () {
        console.log("touch NPC");
        var taskcondition = this.rule(this._sceneService.taskConditionList);
        if (taskcondition == null) {
            console.log("No Mission On this NPC");
            return ErrorCode.MISSING_TASK;
        }
        this._panel.touchEnabled = true;
        this._panel.textField.text = taskcondition._desc;
        this._panel.taskcondition = taskcondition;
        if (taskcondition._task.getTaskStatus() == TaskStatus.ACCEPTABLE) {
            this._panel.buttonText.text = "接受";
        }
        else if (taskcondition._task.getTaskStatus() == TaskStatus.CAN_SUBMIT) {
            this._panel.buttonText.text = "完成";
        }
        else {
            this._panel.buttonText.text = "继续";
        }
        this._stage.setChildIndex(this._panel, this._stage.numChildren - 1);
    };
    NPC.NPC_HEIGHT = 200;
    NPC.EMOJI_SIZE = 50;
    return NPC;
}(egret.DisplayObjectContainer));
egret.registerClass(NPC,'NPC',["Observer"]);
//# sourceMappingURL=NPC.js.map