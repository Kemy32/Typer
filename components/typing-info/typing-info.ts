class TypingInfo extends Component {

    private total: number;

    private updateOutput(span: HTMLElement, count: number) {
        switch (Current.TypingMode) {
            case TypingModes.Words:
                span.innerHTML = count + " / " + this.total;
                break;
            case TypingModes.Time:
                span.innerHTML = count + " Sec";
                break;
        }
    }

    protected internalRender(): HTMLElement {
        const wordsConfig = Current.TypingConfig[TypingModes.Words];
        const timeConfig = Current.TypingConfig[TypingModes.Time];


        switch (Current.TypingMode) {
            case TypingModes.Words:
                this.total = wordsConfig.total;
                break;

            case TypingModes.Time:
                this.total = timeConfig.total;
                break;

            default:
                break;
        }


        const div = document.createElement("div");
        div.classList.add("typing-info");

        const spanLabel = document.createElement("span");
        const spanOutput = document.createElement("span");
        spanOutput.classList.add("typing-count");

        div.appendChild(spanLabel);
        div.appendChild(spanOutput);


        switch (Current.TypingMode) {
            case TypingModes.Words:
                spanLabel.innerHTML = "Words written:";
                this.updateOutput(spanOutput, 0);
                break;
            case TypingModes.Time:
                spanLabel.innerHTML = "Time left:";
                this.updateOutput(spanOutput, this.total);
                break;
        }


        return div;

    }

    public update(count: number) {
        const children = this.createdElement.querySelectorAll('span');
        // const spanLabel = children.item(0);
        const spanOutput = children.item(1);
        this.updateOutput(spanOutput, count);
    }

    protected getConfig(): { cssPath?: string; } {
        return { cssPath: "components/typing-info/style.css" };
    }

}