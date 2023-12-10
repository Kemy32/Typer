class Radio extends Component {
    internalRender() {
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
    getConfig() {
        return {
            cssPath: "components/radio/style.css"
        };
    }
}
