interface ModesModalInput {
    createModalContent: () => HTMLElement
}

class ModesModal extends Component<ModesModalInput> {
    public renderOpenModalPromise: Promise<void>;

    private applyChangesToRange(rangeMeasure: RangeMeasure) {
        const config = Current.TypingConfig[Current.TypingMode];

        rangeMeasure.setInput({
            minRange: config.min,
            maxRange: config.max,
            value: config.total,
            onChange: (value) => {
                config.total = value;
                Component.GetComponents<TypingBox>(TypingBox)[0].reset();
                Component.GetComponents<TypingInfo>(TypingInfo)[0].reset();
            }
        });
    }

    private createHeader(label: string) {
        const Header = document.createElement("span");
        Header.innerHTML = label;
        Header.style.marginBottom = "20px";
        Header.style.display = "block";
        Header.style.fontSize = "17px";
        Header.style.fontWeight = "bold";
        Header.style.marginTop = "30px";

        return Header;
    }

    protected async internalRender(): Promise<HTMLElement> {

        const divPopUp = this.input.createModalContent();

        divPopUp.innerHTML = `<span style="display:block; text-align: center; font-weight:bold;">Modes</span>`;

        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.justifyContent = "space-between";
        div.style.margin = "20px 0 0";
        div.style.alignItems = "center";

        divPopUp.appendChild(div);

        const rangeMeasure = new RangeMeasure(div);
        const btnSelector = new ButtonSelector(div);

        const textFormatHeader = this.createHeader("Text Formats");

        btnSelector.setInput({
            btns: [
                { label: "Time" },
                { label: "Word" }
            ],
            initialSelectedIndex: Current.TypingMode === TypingModes.Time ? 0 : 1,
            onChange: (selected) => {
                if (selected == 0) {
                    Current.TypingMode = TypingModes.Time;
                }
                else {
                    Current.TypingMode = TypingModes.Words;
                }

                Component.GetComponents<TypingBox>(TypingBox)[0].reset();
                Component.GetComponents<TypingInfo>(TypingInfo)[0].reset();

                this.applyChangesToRange(rangeMeasure);
                rangeMeasure.reset();
            }
        });

        await btnSelector.render();

        this.applyChangesToRange(rangeMeasure);

        await rangeMeasure.render();

        divPopUp.appendChild(textFormatHeader);

        const promises = [];

        const checkboxes = ["Numbers", "Punctuation"].map((value, index) => {
            const checkbox = new Checkbox(divPopUp);
            const initail = value === "Numbers" ? Current.TextFormat.hasNumbers : Current.TextFormat.hasPunctuation;
            checkbox.setInput({
                initail: initail,
                label: value,
                onChange: (mark) => {
                    if (value === "Numbers") {
                        Current.TextFormat.hasNumbers = mark;
                    } else {
                        Current.TextFormat.hasPunctuation = mark;
                    }
                    Component.GetComponents<TypingBox>(TypingBox)[0].reset();
                    Component.GetComponents<TypingInfo>(TypingInfo)[0].reset();
                }
            });
            const task = checkbox.render().then(() => {
                if (index != 0) {
                    checkbox.createdElement.style.marginTop = "15px";
                }
            });

            promises.push(task);

            return checkbox;
        })

        await Promise.all(promises);

        divPopUp.appendChild(this.createHeader("Display Modes"));

        const radios = Object.keys(Current.ModesConfig).map((value, index) => {
            const mode = <DisplayModes><any>value;
            const radio = new Radio(divPopUp);

            radio.setInput({
                label: Current.ModesConfig[mode].label,
                name: "displayMode",
                isChecked: Current.Mode == mode
            });

            radio.render();

            return radio;
        });

        const newModal = new Modal(document.getElementById("main"));
        newModal.setInput({
            popPosition: "left",
            blurElement: document.getElementById("content"),
            modalContent: divPopUp,
            onRemove: () => {
                btnSelector.remove()
                rangeMeasure.remove()
                checkboxes.forEach(checkbox => checkbox.remove());
                radios.forEach(radio => radio.remove());
            }
        })

        this.renderOpenModalPromise = newModal.render();


        return divPopUp;
    }

    protected getConfig(): { cssPath?: string; } {
        return {};
    }

} 