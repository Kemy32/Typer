interface SideNavIcon {
    isSelected?: boolean,
    label: string,
    icon: string,
    color: string,
    class?: string
}

class SideNav extends Component {

    private renderOpenModalPromise: Promise<void>;
    public lastOpenedIconIndex: number;

    private createModalContent() {
        const divPopUp = document.createElement("div");
        divPopUp.style.display = "flex";
        divPopUp.style.flexDirection = "column";
        divPopUp.style.width = "440px";

        divPopUp.style.borderTopRightRadius = "25px";
        divPopUp.style.borderBottomRightRadius = "25px";
        divPopUp.style.padding = "28px";

        divPopUp.style.background = "white";
        divPopUp.style.fontSize = "20px";
        divPopUp.style.color = "black";

        return divPopUp;
    }

    protected internalRender(): HTMLElement {
        var nav = document.createElement("nav");
        nav.classList.add('side-nav');
        const icons: SideNavIcon[] = [
            // {
            //     label: "Keyboard",
            //     icon: "fa-regular fa-keyboard",
            // },
            {
                label: "Language",
                icon: "fa-solid fa-language",
                color: "#fff"
                // color: "#453C67"
            },
            {
                label: "Modes",
                icon: "fa-solid fa-gamepad",
                color: "#fff"
                // color: "#D21312"
            },
            {
                label: "History",
                icon: "fa-solid fa-box-archive",
                color: "#fff"
                // color: "#03C988"
            },
            {
                label: "Info",
                icon: "fa-solid fa-circle-info",
                color: "#414343",
                class: "display-bottom"
            },
            {
                label: "Settings",
                icon: "fa-solid fa-gear",
                color: "#414343"
            }
        ]

        nav.innerHTML = icons.map((i) => `
            <div class="icon-text-contanier ${i.class || ""} ${i.isSelected ? " selected" : ""}" style="--icon-color:${i.color}">
                <i class="${i.icon}"></i>
                <p class="icon-text">${i.label}</p>
            </div>
        `).join(" ")

        this.modalOnClick(nav, 0, async () => {
            const modal = new LanguagesModal();
            modal.setInput({
                createModalContent: this.createModalContent
            });
            modal.render();
            this.renderOpenModalPromise = modal.renderOpenModalPromise;
        })

        this.modalOnClick(nav, 1, async () => {
            const modal = new ModesModal();
            modal.setInput({
                createModalContent: this.createModalContent
            });
            modal.render();
            this.renderOpenModalPromise = modal.renderOpenModalPromise;
        })

        this.modalOnClick(nav, 2, async () => {
            const modal = new HistoryModal();
            modal.setInput({
                createModalContent: this.createModalContent
            });
            modal.render();
            this.renderOpenModalPromise = modal.renderOpenModalPromise;
        })

        return nav;
    }


    private modalOnClick(navElement: HTMLElement, iconIndex: number, method: () => void) {
        const icon = <HTMLElement>navElement.children[iconIndex];
        icon.onclick = async (ev) => {
            ev.stopPropagation()
            const openedModal: Modal = Component.Components.Modal ? <Modal>Component.Components.Modal[0] : null
            if (openedModal) {
                await this.renderOpenModalPromise;
                openedModal.remove();
            }

            const openNewModal = iconIndex !== this.lastOpenedIconIndex;

            if (openNewModal) {
                method();
                this.lastOpenedIconIndex = iconIndex;
            } else {
                this.lastOpenedIconIndex = null
            }
        }
    }

    protected getConfig(): { cssPath?: string; } {
        return { cssPath: "components/side-nav/style.css" }
    }

}