class TaskPanel extends egret.DisplayObjectContainer implements Observer {

	private textField: egret.TextField;
	private belowPanel: egret.Shape;
	private _sceneService: SceneService;

	public static TOTAL_WIDTH = 200;
	public static TOTAL_HEIGHT = 300;

	public constructor(sceneService: SceneService) {

		super();

		this._sceneService = sceneService;

		this.textField = new egret.TextField();
		this.textField.width = TaskPanel.TOTAL_WIDTH;

		this.belowPanel = new egret.Shape();
        this.belowPanel.graphics.beginFill(0x000000, 0.5);
        this.belowPanel.graphics.drawRect(0, 0, DialoguePanel.TOTAL_WIDTH, DialoguePanel.TOTAL_HEIGHT);
        this.belowPanel.graphics.endFill();

        this.addChild(this.belowPanel);
		this.addChild(this.textField);

	}

	onChange() {
		for (let taskCondition of this._sceneService.taskConditionList) {
			if (taskCondition._task.getTaskStatus() == TaskStatus.DURING || taskCondition._task.getTaskStatus() == TaskStatus.CAN_SUBMIT) {
				this.textField.text = taskCondition._task.getTaskId() + ": " + taskCondition._task.getName();;
			}
			else{
				this.textField.text = " ";
			}
		}
	}
}