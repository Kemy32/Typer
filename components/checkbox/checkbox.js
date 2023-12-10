class Checkbox extends Component {
    internalRender() {
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
        };
        return div;
    }
    getConfig() {
        return {
            cssPath: "components/checkbox/style.css",
        };
    }
}
