import { _decorator, Component, Node, MeshRenderer, Material, Vec3, input, Input, EventTouch, tween, Texture2D, resources } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 3D产品配置器主控制器
 * 功能：材质切换、旋转控制、配置预览
 */
@ccclass('ProductConfigurator')
export class ProductConfigurator extends Component {
    @property(Node)
    public productModel: Node | null = null;

    @property(Material[])
    public materials: Material[] = [];

    @property(number)
    public rotateSpeed: number = 50;

    private _currentMaterialIndex: number = 0;
    private _isRotating: boolean = false;
    private _autoRotate: boolean = true;

    start() {
        this._setupInput();
        this._applyMaterial(0);
        this._startAutoRotate();
    }

    update(deltaTime: number) {
        if (this._autoRotate && this._isRotating) {
            this.productModel?.rotate(Vec3.UP, this.rotateSpeed * deltaTime);
        }
    }

    /**
     * 设置输入事件
     */
    private _setupInput() {
        input.on(Input.EventType.TOUCH_START, this._onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this._onTouchEnd, this);
    }

    private _onTouchStart(event: EventTouch) {
        this._isRotating = true;
        this._autoRotate = false;
    }

    private _onTouchEnd(event: EventTouch) {
        this._isRotating = false;
        // 3秒后恢复自动旋转
        setTimeout(() => {
            this._autoRotate = true;
        }, 3000);
    }

    /**
     * 切换到下一個材质
     */
    public nextMaterial() {
        this._currentMaterialIndex = (this._currentMaterialIndex + 1) % this.materials.length;
        this._applyMaterial(this._currentMaterialIndex);
    }

    /**
     * 切换到指定材质
     */
    public setMaterial(index: number) {
        if (index >= 0 && index < this.materials.length) {
            this._currentMaterialIndex = index;
            this._applyMaterial(index);
        }
    }

    /**
     * 应用材质到模型
     */
    private _applyMaterial(index: number) {
        if (!this.productModel) return;

        const meshRenderers = this.productModel.getComponentsInChildren(MeshRenderer);
        meshRenderers.forEach((renderer: MeshRenderer) => {
            if (this.materials[index]) {
                renderer.setMaterial(this.materials[index], 0);
            }
        });

        console.log(`[ProductConfigurator] Material changed to: ${index}`);
    }

    /**
     * 开始自动旋转
     */
    private _startAutoRotate() {
        this._autoRotate = true;
    }

    /**
     * 重置视角
     */
    public resetView() {
        if (this.productModel) {
            tween(this.productModel)
                .to(0.5, { eulerAngles: Vec3.ZERO })
                .start();
        }
    }

    /**
     * 获取当前配置信息
     */
    public getCurrentConfig(): object {
        return {
            materialIndex: this._currentMaterialIndex,
            materialName: `Material_${this._currentMaterialIndex}`,
            timestamp: Date.now()
        };
    }
}
