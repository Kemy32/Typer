var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Component {
    static GetComponents(object) {
        return this.Components[object.name];
    }
    constructor(element) {
        this.element = element;
    }
    setInput(value) {
        this.input = value;
    }
    getInput() {
        return this.input;
    }
    loadCss(cssPath) {
        if (Component.LoadedCss[this.constructor.name]) {
            return Component.LoadedCss[this.constructor.name];
        }
        Component.LoadedCss[this.constructor.name] = new Promise(resolve => {
            const link = document.createElement("link");
            link.href = cssPath;
            link.rel = "stylesheet";
            link.setAttribute("component-name", this.constructor.name);
            link.onload = () => {
                resolve();
            };
            document.head.appendChild(link);
        });
    }
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = this.getConfig();
            if (Component.Components[this.constructor.name]) {
                Component.Components[this.constructor.name].push(this);
            }
            else {
                Component.Components[this.constructor.name] = [this];
            }
            if (config.cssPath) {
                yield this.loadCss(config.cssPath);
            }
            this.createdElement = yield this.internalRender();
            if (this.element) {
                this.element.appendChild(this.createdElement);
            }
            const component = this;
            if (component.onRendered) {
                setTimeout(() => {
                    component.onRendered();
                }, 30);
            }
        });
    }
    remove() {
        return __awaiter(this, void 0, void 0, function* () {
            const component = this;
            Component.Components[this.constructor.name] = Component.Components[this.constructor.name].filter(c => c !== this);
            if (component.onRemove) {
                yield component.onRemove();
            }
            this.element.removeChild(this.createdElement);
        });
    }
    reset() {
        return __awaiter(this, void 0, void 0, function* () {
            const oldElement = this.createdElement;
            this.createdElement = yield this.internalRender();
            this.element.replaceChild(this.createdElement, oldElement);
            const component = this;
            if (component.onRendered) {
                setTimeout(() => {
                    component.onRendered();
                }, 10);
            }
        });
    }
    hide() {
        this.createdElement.style.display = "none";
    }
    show() {
        this.createdElement.style.display = null;
    }
}
Component.Components = {};
Component.LoadedCss = {};
