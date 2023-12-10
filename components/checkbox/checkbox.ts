interface CheckboxInput {
    label: string
    initail: boolean
    onChange: (value: boolean) => void
}

class Checkbox extends Component<CheckboxInput> {
    protected internalRender(): HTMLElement {
        const div = document.createElement("div");
        div.classList.add("checkbox-rect");

        const id = Math.random().toString().slice(3, 8);

        div.innerHTML = ` 
            <input type="checkbox" id="${id}">
            <label for="${id}">${this.input.label}</label>
            `;

        const element = div.querySelector("input");

        element.checked = this.input.initail;

        element.onchange = () => {
            this.input.onChange(element.checked);
        }

        return div;
    }
    protected getConfig(): { cssPath?: string; } {
        return {
            cssPath: "components/checkbox/style.css",
        }
    }

}