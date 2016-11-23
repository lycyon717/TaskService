
class NPC extends egret.DisplayObjectContainer implements Observer {

	public static NPC_HEIGHT = 200;
	public static EMOJI_SIZE = 50;
	public _id: string;

	private emoji: egret.Bitmap;

	private bitmapNPC: egret.Bitmap;
	private _panel: any;
	private _stage: any;

	private _sceneService: SceneService;

	public constructor(bitmapName: string, id: string, panel: egret.DisplayObjectContainer, stage: egret.DisplayObjectContainer, sceneService: SceneService) {

		super();

		this.touchEnabled = true;

		this._id = id;
		this._panel = panel;
		this._stage = stage;
		this._sceneService = sceneService;

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

	onChange() {

		var taskcondition = this.rule(this._sceneService.taskConditionList);
		if (taskcondition == null) {
			console.log("No picture");
			this.emoji.texture = null;
			return ErrorCode.MISSING_TASK;
		}

		if (taskcondition._fromNpcId == this._id && taskcondition._task.getTaskStatus() == TaskStatus.ACCEPTABLE) {     //此NPC有可接任务
			console.log("mission !");
			this.emoji.texture = RES.getRes("emoji1_png");
			this.addChild(this.emoji);
		}

		else if (taskcondition._toNpcId == this._id && taskcondition._task.getTaskStatus() == TaskStatus.CAN_SUBMIT) {   //此NPC有可交任务
			console.log("mission ?");
			this.emoji.texture = RES.getRes("emoji2_png");
			this.addChild(this.emoji);
		}

		else {                           //此NPC无任务
			console.log("done!");
			this.emoji.texture = null;
		}
	}

	onNPCClick() {

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
	}

	private rule = (taskConditionList: TaskCondition[]): TaskCondition => {

		for (let taskCondition of taskConditionList) {
			if ((taskCondition._task.getTaskStatus() == TaskStatus.ACCEPTABLE
				&& taskCondition._fromNpcId == this._id)
				|| (taskCondition._task.getTaskStatus() == TaskStatus.CAN_SUBMIT
					&& taskCondition._toNpcId == this._id)) {
				return taskCondition;
			}
		}
		return null;
	}
}