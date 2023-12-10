interface RadioInput {
    label: string,
    name: string,
    isChecked?: boolean
}

class Radio extends Component<RadioInput> {
    protected internalRender(): HTMLElement {
        const div = document.createElement("div");
        div.classList.add("radio");
        div.innerHTML = `	
            <label>
                <input type="radio" name="${this.input.name}"/>
                <span>${this.input.label}</span>
            </label>
        `;

        const element = div.querySelector("input");
        element.checked = this.input.isChecked;

        return div;
    }

    protected getConfig(): { cssPath?: string; } {
        return {
            cssPath: "components/radio/style.css"
        }
    }

}