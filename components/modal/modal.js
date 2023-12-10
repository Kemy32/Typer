class Modal extends Component {
    onRendered() {
        if (this.input.popPosition == "left") {
            this.createdElement.style.left = "86.5px";
        }
        else {
            this.createdElement.style.opacity = "1";
        }
    }
    onRemove() {
        var _a;
        if ((_a = this.input) === null || _a === void 0 ? void 0 : _a.blurElement) {
            this.input.blurElement.style.filter = null;
            this.input.blurElement.style.pointerEvents = null;
        }
        if (this.input.popPosition == "left") {
            return new Promise(done => {
                this.createdElement.style.left = null;
                setTimeout(() => {
                    done();
                    if (this.input.onRemove) {
                        this.input.onRemove();
                    }
                }, 805);
            });
        }
        else {
            return new Promise(done => {
                this.createdElement.style.opacity = null;
                setTimeout(() => {
                    done();
                    if (this.input.onRemove) {
                        this.input.onRemove();
                    }
                }, 505);
            });
        }
    }
    internalRender() {
        var _a, _b;
        const div = document.createElement("div");
        div.classList.add("pop-up");
        if (((_a = this.input) === null || _a === void 0 ? void 0 : _a.popPosition) == "left") {
            div.classList.add("left-position");
        }
        div.appendChild(this.input.modalContent);
        if ((_b = this.input) === null || _b === void 0 ? void 0 : _b.blurElement) {
            this.input.blurElement.style.filter = "blur(2px)";
            this.input.blurElement.style.pointerEvents = "none";
        }
        this.element.style.position = "relative";
        div.onclick = (e) => {
            e.stopPropagation();
        };
        if (this.input.isAboveAll) {
            div.style.zIndex = "2";
        }
        return div;
    }
    getConfig() {
        return { cssPath: "components/modal/style.css" };
    }
}
