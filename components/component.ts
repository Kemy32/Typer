interface ComponentClose {
    onRemove(): void | Promise<void>
}

interface ComponentRendered {
    onRendered(): void
}

abstract class Component<Input = any> {

    public static Components: { [name: string]: Component[] } = {};

    private static LoadedCss: { [name: string]: Promise<void> } = {};

    static GetComponents<ComponentType = any>(object: { name: string }) {
        return <ComponentType[]>this.Components[object.name];
    }

    public createdElement: HTMLElement;

    protected input: Input;

    constructor(protected element?: HTMLElement) { }

    protected abstract internalRender(): HTMLElement | Promise<HTMLElement>

    protected abstract getConfig(): { cssPath?: string }

    public setInput(value: Input) {
        this.input = value;
    }

    public getInput() {
        return this.input;
    }

    private loadCss(cssPath: string) {
        if (Component.LoadedCss[this.constructor.name]) {
            return Component.LoadedCss[this.constructor.name];
        }

        Component.LoadedCss[this.constructor.name] = new Promise<void>(resolve => {
            const link = document.createElement("link");
            link.href = cssPath;
            link.rel = "stylesheet";
            link.setAttribute("component-name", this.constructor.name);
            link.onload = () => {
                resolve();
            }
            document.head.appendChild(link);
        });
    }

    async render() {
        const config = this.getConfig();

        if (Component.Components[this.constructor.name]) {
            Component.Components[this.constructor.name].push(this);
        } else {
            Component.Components[this.constructor.name] = [this]
        }

        if (config.cssPath) {
            await this.loadCss(config.cssPath);
        }

        this.createdElement = await this.internalRender();

        if (this.element) {
            this.element.appendChild(this.createdElement);
        }

        const component = <ComponentRendered><any>this;
        if (component.onRendered) {
            setTimeout(() => {
                component.onRendered();
            }, 30)
        }
    }

    async remove() {
        const component = <ComponentClose><any>this;
        Component.Components[this.constructor.name] = Component.Components[this.constructor.name].filter(c => c !== this)
        if (component.onRemove) {
            await component.onRemove();
        }
        this.element.removeChild(this.createdElement);
    }

    public async reset() {
        const oldElement = this.createdElement;
        this.createdElement = await this.internalRender();
        this.element.replaceChild(this.createdElement, oldElement);
        const component = <ComponentRendered><any>this;
        if (component.onRendered) {
            setTimeout(() => {
                component.onRendered();
            }, 10)
        }
    }

    public hide() {
        this.createdElement.style.display = "none";
    }
    public show() {
        this.createdElement.style.display = null;
    }

}
