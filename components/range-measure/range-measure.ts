interface RangeInput {
    value: number,
    minRange: number,
    maxRange: number,
    onChange: (value: number) => void
}


class RangeMeasure extends Component<RangeInput> {

    private createSpan(value: string, isMin?: boolean) {
        const span = document.createElement("span");
        span.classList.add(isMin ? "min-value" : "max-value");
        span.innerHTML = value;
        return span;
    }

    protected internalRender(): HTMLElement {
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
        }

        bubble.innerHTML = range.value;
        div.appendChild(this.createSpan(range.min, true))
        div.appendChild(range);
        div.appendChild(this.createSpan(range.max))
        div.appendChild(bubble);

        return div;
    }



    protected getConfig(): { cssPath?: string; } {
        return {
            cssPath: 'components/range-measure/style.css'
        }
    }

}