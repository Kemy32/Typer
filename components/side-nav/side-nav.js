var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class SideNav extends Component {
    createModalContent() {
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
    internalRender() {
        var nav = document.createElement("nav");
        nav.classList.add('side-nav');
        const icons = [
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
        ];
        nav.innerHTML = icons.map((i) => `
            <div class="icon-text-contanier ${i.class || ""} ${i.isSelected ? " selected" : ""}" style="--icon-color:${i.color}">
                <i class="${i.icon}"></i>
                <p class="icon-text">${i.label}</p>
            </div>
        `).join(" ");
        this.modalOnClick(nav, 0, () => __awaiter(this, void 0, void 0, function* () {
            const modal = new LanguagesModal();
            modal.setInput({
                createModalContent: this.createModalContent
            });
            modal.render();
            this.renderOpenModalPromise = modal.renderOpenModalPromise;
        }));
        this.modalOnClick(nav, 1, () => __awaiter(this, void 0, void 0, function* () {
            const modal = new ModesModal();
            modal.setInput({
                createModalContent: this.createModalContent
            });
            modal.render();
            this.renderOpenModalPromise = modal.renderOpenModalPromise;
        }));
        this.modalOnClick(nav, 2, () => __awaiter(this, void 0, void 0, function* () {
            const modal = new HistoryModal();
            modal.setInput({
                createModalContent: this.createModalContent
            });
            modal.render();
            this.renderOpenModalPromise = modal.renderOpenModalPromise;
        }));
        return nav;
    }
    modalOnClick(navElement, iconIndex, method) {
        const icon = navElement.children[iconIndex];
        icon.onclick = (ev) => __awaiter(this, void 0, void 0, function* () {
            ev.stopPropagation();
            const openedModal = Component.Components.Modal ? Component.Components.Modal[0] : null;
            if (openedModal) {
                yield this.renderOpenModalPromise;
                openedModal.remove();
            }
            const openNewModal = iconIndex !== this.lastOpenedIconIndex;
            if (openNewModal) {
                method();
                this.lastOpenedIconIndex = iconIndex;
            }
            else {
                this.lastOpenedIconIndex = null;
            }
        });
    }
    getConfig() {
        return { cssPath: "components/side-nav/style.css" };
    }
}
