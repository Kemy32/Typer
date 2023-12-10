class TypingBox extends Component implements ComponentRendered {

    rootDiv: HTMLElement;
    shadowDiv: HTMLElement;

    // each mode has a render function
    // unique must be in one function
    private currentWord: number;
    private currentChar: number;
    private lines: HTMLElement[][] = [];
    private timerId: number;
    public analysis = new TypingAnalysis();
    private currentTime: number;
    private arabicSpecialChar = "أارزوؤدذ";

    constructor(element?: HTMLElement) {
        super(element);
        languageChange.add(TypingBox.name, () => {
            this.reset();
        })
    }

    private getChar(value: string, previous: string, next: string) {
        let before = "";
        let after = "";

        if (!this.arabicSpecialChar.includes(previous) && previous) {
            before = "&zwj;";
        }
        if (!this.arabicSpecialChar.includes(value) && next) {
            after = "&zwj;";
        }

        return before + value + after;
    }

    private setUpDefaultMode(div: HTMLElement, previousWords?: string, isFirstRound?: boolean) {
        if (!div.classList.contains("text-box")) {
            div.classList.add("text-box");
        }

        if (!this.shadowDiv) {
            this.shadowDiv = document.createElement('div');
            this.shadowDiv.classList.add("shadow");
        }

        if (!this.rootDiv.contains(this.shadowDiv)) {
            this.rootDiv.appendChild(this.shadowDiv);
        }

        this.shadowDiv.innerHTML = '';
        div.innerHTML = '';

        const wordsConfig = Current.TypingConfig[TypingModes.Words];
        const totalWords = Current.TypingMode == TypingModes.Time ? 35 : wordsConfig.total;
        const input = (previousWords ? previousWords + ' ' : '') + TextGenerator.Generate({ exact: totalWords });

        const words = input.split(' ');
        const elements: HTMLElement[][] = [];

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const whiteSpace = document.createElement("span");
            const wordDiv = document.createElement("div");

            elements.push([]);

            whiteSpace.innerHTML = "&nbsp;";
            whiteSpace["character"] = " ";
            whiteSpace.classList.add("white-space");


            for (let y = 0; y < word.length; y++) {
                const char = word[y];
                const span = document.createElement("span");
                span.classList.add("char");
                span["character"] = char;


                const previousPrev = word[y - 2] || "";
                const previous = word[y - 1] || "";
                const next = word[y + 1] || "";
                const nextNex = word[y + 2] || "";

                if (y == word.length - 1) {
                    span.innerHTML = `<span class="shadow-char">${this.getChar(previous, previousPrev, char)}</span>${this.getChar(char, previous, next)}`;
                }
                else {
                    span.innerHTML = `<span class="shadow-char">${this.getChar(previous, previousPrev, char)}</span>${this.getChar(char, previous, next)}<span class="shadow-char">${this.getChar(next, char, nextNex)}</span>`
                }

                if (i == 0 && y == 0) {
                    span.classList.add("char-indicator");
                }

                elements[i].push(span);

                wordDiv.appendChild(span);
            }


            this.shadowDiv.appendChild(wordDiv);

            if (i != words.length - 1) {
                wordDiv.appendChild(whiteSpace);
                elements[i].push(whiteSpace);
            }
        }

        let currentLine = 0;

        window.onkeypress = (e) => {
            e.preventDefault();
            const typingInfo = <TypingInfo>Component.Components["TypingInfo"][0];

            // If key press and the typing is last char in round then return nothing
            const isFinalWordsMode = this.currentWord >= words.length && Current.TypingMode == TypingModes.Words;
            const isFinalTimeMode = this.currentTime == 0 && Current.TypingMode == TypingModes.Time;

            if (isFinalWordsMode || isFinalTimeMode) {
                return;
            }

            // Starting typing for this round
            if (this.currentWord == 0 && this.currentChar == 0 && isFirstRound === true) {

                // Starting time 
                this.analysis.timeMinutes = Date.now();

                if (Current.TypingMode == TypingModes.Time) {
                    this.timerId = setInterval(() => {
                        this.currentTime--;
                        if (this.currentTime == 0) {
                            clearInterval(this.timerId);
                            this.onFinish();
                        }
                        typingInfo.update(this.currentTime);
                    }, 1000);
                }
            }

            // Getting typed char and current word and char
            const key: string = e.key;
            const current_element = elements[this.currentWord][this.currentChar];
            const current_key = current_element["character"];

            // Get current line and checking if entering new line
            const line = this.findWordLine(current_element.parentElement);

            // Showing words
            if (currentLine !== line) {
                ++currentLine;
                if (line % 4 == 2 || line % 4 == 0) {
                    const nextLines = this.lines.slice(currentLine, currentLine + 3);
                    if (nextLines.length < 4) {
                        let words = "";

                        for (let i = 0; i < nextLines.length; i++) {
                            for (let y = 0; y < nextLines[i].length; y++) {
                                const chars = <HTMLElement[]>Array.from(nextLines[i][y].querySelectorAll('.char'));
                                const word = chars.map(span => span["character"]).join('');
                                words += words.length == 0 ? word : " " + word;
                            }
                        }
                        this.currentWord = 0;
                        this.currentChar = 0;
                        this.lines = [];
                        this.setUpDefaultMode(div, words);
                        this.onRendered();
                        return;
                    } else {
                        this.showLines(currentLine, currentLine + 3);
                    }
                }
            }

            // Setting char as correct or wrong
            if (key == current_key) {
                current_element.classList.add("correct");
                this.analysis.numberCharCorrect++;
            }
            else {
                current_element.classList.add("wrong");
                this.analysis.numberCharMistakes++;
            }

            current_element.classList.remove("char-indicator");

            const nextChar = this.currentChar + 1;

            // Moving the indicator to the next char
            // If last char then we check if word is correct or wrong
            if (nextChar < elements[this.currentWord].length) {
                ++this.currentChar;
            }
            else {
                ++this.currentWord;
                this.currentChar = 0;

                if (current_element.parentElement.querySelector('.char.wrong')) {
                    this.analysis.numberWordMistakes++;
                }
                else {
                    this.analysis.numberWordCorrect++;
                }
            }

            if (this.currentWord < elements.length && this.currentChar < elements[this.currentWord].length) {
                elements[this.currentWord][this.currentChar].classList.add("char-indicator");
            }

            // Updating type info
            if (Current.TypingMode == TypingModes.Words) {
                typingInfo.update(this.currentWord);
            }

            // last word
            if (this.currentWord == words.length) {
                // Finished
                if (Current.TypingMode == TypingModes.Words) {
                    this.onFinish();
                } else {
                    this.currentWord = 0;
                    this.currentChar = 0;
                    this.lines = [];
                    this.setUpDefaultMode(div);
                    this.onRendered();
                }
            }

        }
    }

    protected internalRender(): HTMLElement {
        this.rootDiv = document.createElement("div");
        const div = document.createElement("div");

        this.currentWord = 0;
        this.currentChar = 0;
        this.lines = [];
        this.currentTime = Current.TypingConfig[TypingModes.Time].total;
        this.analysis = new TypingAnalysis();

        clearInterval(this.timerId);

        switch (Current.Mode) {
            case DisplayModes.Default:
                this.setUpDefaultMode(div, '', true);
                break;

            case DisplayModes.Single_Line:

                break;
            default:
                break;
        }


        this.rootDiv.appendChild(div);
        this.rootDiv.style.position = "relative";

        if (Current.Language == Languages.Arabic) {
            div.classList.add("ar");
        }
        return this.rootDiv;
    }

    onRendered(): void {
        setTimeout(() => {
            let line = 0;
            let currentBottom: number;

            const children = <HTMLElement[]>Array.from(this.shadowDiv.children);

            for (let index = 0; index < children.length; index++) {
                const wordDiv = children[index];
                if (index == 0) {
                    currentBottom = wordDiv.getBoundingClientRect().bottom;
                }

                if (wordDiv.getBoundingClientRect().bottom !== currentBottom) {
                    ++line;
                    currentBottom = wordDiv.getBoundingClientRect().bottom;
                }

                if (this.lines[line] == undefined) {
                    this.lines.push([]);
                }

                this.lines[line].push(wordDiv);
            }

            this.showLines(0, 3);
        }, 50);
    }

    private showLines(from: number, to: number) {
        const textBox = this.rootDiv.querySelector('.text-box');
        textBox.innerHTML = '';

        for (let index = 0; index < this.lines.length; index++) {
            const line = this.lines[index];
            for (let y = 0; y < line.length; y++) {
                const wordDiv = line[y];

                if (index >= from && index <= to) {
                    wordDiv.remove();
                    textBox.appendChild(wordDiv);
                }
            }
        }
    }

    private findWordLine(wordDiv: HTMLElement) {
        for (let index = 0; index < this.lines.length; index++) {
            if (this.lines[index].includes(wordDiv)) {
                return index;
            }
        }
        return -1;
    }

    private onFinish() {
        this.hide();
        this.analysis.timeMinutes = (Date.now() - this.analysis.timeMinutes) / 1000 / 60;
        this.analysis.wordPerTime = this.analysis.words / this.analysis.timeMinutes;
        this.analysis.charPerTime = this.analysis.chars / this.analysis.timeMinutes;
        this.analysis.accuracyPercentage = (this.analysis.numberCharCorrect / this.analysis.chars);

        Component.GetComponents<TypingInfo>(TypingInfo)[0].hide();
        const analysisBox = new TypingAnalysisBox(<HTMLElement>document.querySelector("#content"));
        analysisBox.setInput(this.analysis);
        analysisBox.render();
    }

    protected getConfig(): { cssPath?: string; } {
        return { cssPath: "components/typing-box/style.css" }

    }

}