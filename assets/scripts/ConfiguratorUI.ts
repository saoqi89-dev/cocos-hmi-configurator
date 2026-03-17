import { _decorator, Component, Node, Button, Label, Sprite } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 配置器UI控制器
 * 管理界面按钮和状态显示
 */
@ccclass('ConfiguratorUI')
export class ConfiguratorUI extends Component {
    @property(Button)
    public prevBtn: Button | null = null;

    @property(Button)
    public nextBtn: Button | null = null;

    @property(Button)
    public resetBtn: Button | null = null;

    @property(Label)
    public materialLabel: Label | null = null;

    @property(Node)
    public confirmPanel: Node | null = null;

    @property(Label)
    public configLabel: Label | null = null;

    private _materialNames: string[] = [
        '默认白色',
        '炫酷黑色',
        '科技蓝色',
        '活力橙色',
        '奢华金色'
    ];

    start() {
        this._setupButtons();
        this._updateUI();
    }

    private _setupButtons() {
        if (this.nextBtn) {
            this.nextBtn.node.on('click', this._onNextClick, this);
        }
        if (this.prevBtn) {
            this.prevBtn.node.on('click', this._onPrevClick, this);
        }
        if (this.resetBtn) {
            this.resetBtn.node.on('click', this._onResetClick, this);
        }
    }

    private _onNextClick() {
        const configurator = this.node.scene?.getComponentByName('ProductConfigurator') as any;
        if (configurator?.nextMaterial) {
            configurator.nextMaterial();
            this._updateUI();
        }
    }

    private _onPrevClick() {
        const configurator = this.node.scene?.getComponentByName('ProductConfigurator') as any;
        if (configurator?.setMaterial) {
            const currentIdx = configurator._currentMaterialIndex || 0;
            const prevIdx = currentIdx > 0 ? currentIdx - 1 : this._materialNames.length - 1;
            configurator.setMaterial(prevIdx);
            this._updateUI();
        }
    }

    private _onResetClick() {
        const configurator = this.node.scene?.getComponentByName('ProductConfigurator') as any;
        if (configurator?.resetView) {
            configurator.resetView();
        }
    }

    private _updateUI() {
        if (this.materialLabel) {
            this.materialLabel.string = `当前材质: ${this._materialNames[0]}`;
        }
    }

    /**
     * 显示确认面板
     */
    public showConfirm(config: object) {
        if (this.confirmPanel && this.configLabel) {
            this.confirmPanel.active = true;
            this.configLabel.string = JSON.stringify(config, null, 2);
        }
    }
}
