interface ModalInputs {
    blurElement?: HTMLElement,
    popPosition?: "left" | "center"
    modalContent: HTMLElement
    isAboveAll?: boolean
    onRemove?: () => void
}

class Modal extends Component<ModalInputs> implements ComponentClose, ComponentRendered {

    onRendered(): void {
        if (this.input.popPosition == "left") {
            this.createdElement.style.left = "86.5px";
        }
        else {
            this.createdElement.style.opacity = "1";
        }

    }

    onRemove(): Promise<void> {
        if (this.input?.blurElement) {
            this.input.blurElement.style.filter = null;
            this.input.blurElement.style.pointerEvents = null;
        }

        if (this.input.popPosition == "left") {
            return new Promise<void>(done => {
                this.createdElement.style.left = null;
                setTimeout(() => {
                    done();
                    if (this.input.onRemove) {
                        this.input.onRemove()
                    }
                }, 805)
            })
        }
        else {
            return new Promise<void>(done => {
                this.createdElement.style.opacity = null;
                setTimeout(() => {
                    done();
                    if (this.input.onRemove) {
                        this.input.onRemove()
                    }
                }, 505)
            })
        }
    }

    protected internalRender(): HTMLElement {
        const div = document.createElement("div");
        div.classList.add("pop-up");

        if (this.input?.popPosition == "left") {
            div.classList.add("left-position");
        }

        div.appendChild(this.input.modalContent);

        if (this.input?.blurElement) {
            this.input.blurElement.style.filter = "blur(2px)";
            this.input.blurElement.style.pointerEvents = "none";
        }

        this.element.style.position = "relative";

        div.onclick = (e) => {
            e.stopPropagation()
        }

        if (this.input.isAboveAll) {
            div.style.zIndex = "2"
        }

        return div;
    }

    protected getConfig(): { cssPath?: string; } {
        return { cssPath: "components/modal/style.css" }
    }


}