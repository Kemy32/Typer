class RangeMeasure extends Component {
    createSpan(value, isMin) {
        const span = document.createElement("span");
        span.classList.add(isMin ? "min-value" : "max-value");
        span.innerHTML = value;
        return span;
    }
    internalRender() {
        const div = document.createElement("div");
        div.className = "range-measure";
        const bubble = document.createElement("div");
        bubble.classList.add("bubble");
        const range = document.createElement("input");
        range.type = "range";
        range.min = this.input.minRange.toString();
        range.max = this.input.maxRange.toString();
        range.value = this.input.value.toString();
        range.onchange = () => {
            const val = parseInt(range.value);
            this.input.onChange(val);
            bubble.innerHTML = range.value;
        };
        bubble.innerHTML = range.value;
        div.appendChild(this.createSpan(range.min, true));
        div.appendChild(range);
        div.appendChild(this.createSpan(range.max));
        div.appendChild(bubble);
        return div;
    }
    getConfig() {
        return {
            cssPath: 'components/range-measure/style.css'
        };
    }
}
