class TypingAnalysis {
    constructor() {
        this.numberWordMistakes = 0;
        this.numberWordCorrect = 0;
        this.numberCharMistakes = 0;
        this.numberCharCorrect = 0;
    }
    get words() {
        return this.numberWordCorrect + this.numberWordMistakes;
    }
    get chars() {
        return this.numberCharCorrect + this.numberCharMistakes;
    }
}
class TypingAnalysisBox extends Component {
    onRendered() {
        this.createdElement.querySelectorAll('circle.outer-circle').forEach((circle) => {
            const strokeDashValue = circle.getAttribute("stroke-dashoffset");
            circle.style.strokeDashoffset = strokeDashValue;
        });
    }
    internalRender() {
        const div = document.createElement("div");
        div.classList.add("analysis-info");
        div.appendChild(this.createAnalysisItem([
            {
                label: "Time",
                color: "red",
                highlight: {
                    icon: "fa-solid fa-stopwatch",
                    value: (this.input.timeMinutes * 60).toFixed(0) + "s"
                }
            },
            {
                label: "Word/Min",
                color: "blue",
                highlight: {
                    icon: "fa-solid fa-pencil",
                    value: (this.input.wordPerTime).toFixed(2)
                }
            },
            {
                label: "Char/Min",
                color: "green",
                highlight: {
                    icon: "fa-solid fa-i-cursor",
                    value: (this.input.charPerTime).toFixed(2)
                }
            }
        ]));
        div.appendChild(this.createAnalysisItem([
            {
                label: "Accuarcy",
                color: "#ff3b3b",
                circle: {
                    percentage: this.input.accuracyPercentage,
                    secondaryColor: "#cc2222"
                },
            },
            {
                label: "Words",
                color: "#466bff",
                circle: {
                    percentage: this.input.numberWordCorrect / this.input.words,
                    secondaryColor: "#34698a",
                    description: {
                        value: this.input.numberWordCorrect,
                        total: this.input.words
                    }
                },
            },
            {
                label: "Characters",
                color: "#3fff4e",
                circle: {
                    percentage: this.input.numberCharCorrect / this.input.chars,
                    secondaryColor: "#29da55",
                    description: {
                        value: this.input.numberCharCorrect,
                        total: this.input.chars
                    }
                },
            }
        ], true));
        const btnContainer = document.createElement("div");
        btnContainer.classList.add("buttons-container");
        const btn = document.createElement("div");
        btn.classList.add("web-btn");
        btn.innerHTML = "Save";
        btn.onclick = (e) => {
            e.stopPropagation();
            const popUp = new Modal(document.body);
            popUp.setInput({
                popPosition: "center",
                blurElement: document.getElementById("content"),
                modalContent: this.createInput(popUp),
            });
            popUp.render();
        };
        btnContainer.appendChild(btn);
        div.appendChild(btnContainer);
        return div;
    }
    createInput(modal) {
        const div = document.createElement("div");
        div.classList.add('popup-name');
        div.innerHTML = `
            <input type="text" onkeypress="(function(e) { e.stopPropagation() })(event)" placeholder="Enter your name" />
            <div class="buttons-container">
                <div class="web-btn ok">Ok</div>
                <div class="web-btn cancel">Cancel</div>
            </div>
        `;
        const btns = Array.from(div.querySelectorAll('.web-btn'));
        btns[0].onclick = (e) => {
            const key = "app-history";
            const name = div.querySelector("input").value;
            if (name) {
                const historyString = localStorage.getItem(key);
                const history = historyString ? JSON.parse(historyString) : [];
                history.unshift({ name: name, analysis: this.input, test: Current.TypingMode });
                const data = JSON.stringify(history);
                localStorage.setItem(key, data);
                const resetBtn = document.querySelector(".reset-btn");
                resetBtn.click();
                modal.remove();
            }
        };
        btns[1].onclick = (e) => {
            modal.remove();
        };
        return div;
    }
    getRadius(index, radiusSize) {
        return radiusSize + (index * 20);
    }
    getSize(numberOfCircles, radiusSize, strokeWidth) {
        let size = this.getRadius(numberOfCircles - 1, radiusSize);
        size = size + (size + strokeWidth);
        return size;
    }
    createAnalysisItem(configs, isCircle) {
        const div = document.createElement("div");
        div.classList.add("analysis-item");
        if (isCircle) {
            div.classList.add("circle-item");
            let circleConfigs = configs.map(config => {
                return {
                    value: config.circle.percentage,
                    color: config.color,
                    secondaryColor: config.circle.secondaryColor
                };
            });
            circleConfigs.reverse();
            div.innerHTML = `
                ${this.createCircles(circleConfigs, 75, 10, true)}
                <div>
                    ${configs.map(config => {
                const circle = config.circle;
                const description = config.circle.description;
                const getDescription = (color, secondColor) => {
                    if (description) {
                        return `<span style="color: ${color};">${description.value}</span> / <span style="color:${secondColor}">${(description.total - description.value)}</span>`;
                    }
                    else {
                        const percentage = circle.percentage * 100;
                        return `<span style="color: ${color};">${percentage.toFixed(2) + "%"}</span> / <span style="color:${secondColor}"> ${(100 - percentage).toFixed(2)}%</span>`;
                    }
                };
                return `
                        <div class="analysis-percentage-description">
                            ${this.createCircles([{ value: 0.5, color: circle.secondaryColor, secondaryColor: config.color }], 15, 5)}
                            <span class="description-label">${config.label}</span>
                            <span class="description-details">${getDescription(config.color, circle.secondaryColor)}</span>
                        </div>`;
            }).join('\n')}
                </div>
            `;
        }
        else {
            configs.forEach(config => {
                div.innerHTML += `
                    <div class="item-container${config.color ? " " + config.color : ""}">
                        <div class="item-icon"><i class="${config.highlight.icon}"></i> </div>
                        <div class="item-content">
                            <span class="analysis-result">${config.highlight.value}</span>
                            <span class="analysis-type">${config.label}</span>
                        </div>
                    </div>
                    `;
            });
        }
        return div;
    }
    createCircles(configs, radiusSize, strokeWidth, isRounded) {
        const size = this.getSize(configs.length, radiusSize, strokeWidth);
        return `
            <svg width="${size}" height="${size}">
                ${configs.map((config, index) => {
            const position = size / 2;
            const radius = this.getRadius(index, radiusSize);
            const circumference = 2 * Math.PI * radius;
            const emptyCount = circumference * (1 - config.value);
            return `
                        <circle class="inner-circle" cx="${position}" cy="${position}" r="${radius}" style="stroke: ${config.secondaryColor}; stroke-width: ${strokeWidth};" />
                        <circle class="outer-circle" stroke-dashoffset="${emptyCount}" style="stroke-linecap: ${isRounded ? "round" : "square"}; stroke: ${config.color}; stroke-dasharray: ${circumference}; stroke-dashoffset: ${circumference}; stroke-width: ${strokeWidth};" cx="${position}" cy="${position}" r="${radius}" />
                    `;
        })}
            </svg>`;
    }
    getConfig() {
        return { cssPath: "components/typing-analysis/style.css" };
    }
}
