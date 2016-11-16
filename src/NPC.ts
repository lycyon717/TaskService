
class NPC extends egret.DisplayObjectContainer implements Observer {

	public static NPC_HEIGHT = 200;
	public static EMOJI_SIZE = 50;

	private emoji: egret.Bitmap;
	private bitmapNPC: egret.Bitmap;
	private _id: string;
	private _panel: any;
	private _stage: any;

	public constructor(bitmapName: string, id: string, panel: egret.DisplayObjectContainer, stage: egret.DisplayObjectContainer) {

		super();

		this.touchEnabled = true;

		this._id = id;
		this._panel = panel;
		this._stage = stage;

		this.bitmapNPC = new egret.Bitmap;
		this.bitmapNPC.texture = RES.getRes(bitmapName);

		var scaleNum = NPC.NPC_HEIGHT / this.bitmapNPC.height;   //缩放为设定的大小
		this.bitmapNPC.scaleY = scaleNum;
		this.bitmapNPC.scaleX = scaleNum;
		this.bitmapNPC.y = NPC.EMOJI_SIZE + 10;                  //NPC位置应在任务图标下方

		this.emoji = new egret.Bitmap;
		this.emoji.height = NPC.EMOJI_SIZE;
		this.emoji.width = NPC.EMOJI_SIZE;
		this.emoji.x = 40;
		this.emoji.y = 0;

		this.addChild(this.bitmapNPC);

		this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.onNPCClick();
		}, this);
	}

	public get id() {
		return this._id;
	}

	onChange(task: Task) {

		if (task.fromNpcId == this.id && task._status == TaskStatus.ACCEPTABLE) {     //此NPC有可接任务
			console.log("mission !");
			this.emoji.texture = RES.getRes("emoji1_png");
			this.addChild(this.emoji);
		}

		else if (task.toNpcId == this.id && task._status == TaskStatus.CAN_SUBMIT) {   //此NPC有可交任务
			console.log("mission ?");
			this.emoji.texture = RES.getRes("emoji2_png");
			this.addChild(this.emoji);
		}

		else {                           //此NPC无任务
			this.emoji.texture = null;
		}
	}

	onNPCClick() {

		console.log("touch NPC");

		var task = TaskService.taskService.getTaskByCustomRule(this.rule);

		if (task == null) {
			console.log("No Mission On this NPC");
			return ErrorCode.MISSING_TASK;
		}

		this._panel.textField.text = task.desc;
		
		this._panel.NPCId = this._id;
		this._stage.setChildIndex(this._panel, this._stage.numChildren - 1);
	}

	private rule(taskList: any): Task {

		for (let taskid in taskList) {
			if (taskList[taskid]._status == TaskStatus.ACCEPTABLE || taskList[taskid]._status == TaskStatus.CAN_SUBMIT) {
				return taskList[taskid];
			}
		}
		return null;
	}
}