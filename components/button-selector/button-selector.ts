interface ButtonConfig {
    label: string,
}

interface ButtonInput {
    btns: ButtonConfig[],
    initialSelectedIndex: number,
    onChange: (selected: number) => void
}

class ButtonSelector extends Component<ButtonInput> {

    protected internalRender(): HTMLElement {
        const div = document.createElement("div");
        div.classList.add("btn-selector-group");
        const numOfBtns = this.input.btns.length;

        for (let i = 0; i < numOfBtns; i++) {
            const btn = document.createElement("div");
            btn.classList.add("btn-selector");
            if (i === this.input.initialSelectedIndex) {
                btn.classList.add("selected");
            }
            btn.innerHTML = `<span class="label">${this.input.btns[i].label} </span>`;
            btn.onclick = () => {
                if (btn.classList.contains("selected")) {
                    return;
                }
                Array.from(div.children).forEach((child: HTMLElement) => {
                    child.classList.remove("selected");
                })

                btn.classList.add("selected");
                this.input.onChange(i);
            };
            div.appendChild(btn);
        }

        /*
            ${this.input[i].description?.text ? `<span class="description-text">${this.input[i].description.text}</span>` : ''}
            ${this.input[i].description?.img ? `<img src="${this.input[i].description.img}" />` : ''}
        */

        return div;
    }


    protected getConfig(): { cssPath?: string; } {
        return { cssPath: "components/button-selector/style.css" }
    }

}