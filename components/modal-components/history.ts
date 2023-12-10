interface HistoryModalInput {
    createModalContent: () => HTMLElement
}

class HistoryModal extends Component<HistoryModalInput> {

    public renderOpenModalPromise: Promise<void>;

    protected internalRender(): HTMLElement | Promise<HTMLElement> {
        const divPopUp = this.input.createModalContent();
        divPopUp.classList.add('history-modal');

        const historyString = localStorage.getItem("app-history")
        const history: { name: string, analysis: TypingAnalysis, test: TypingModes }[] = historyString ? JSON.parse(historyString) : [];


        const createUser = (name: string, analysis: TypingAnalysis, test: TypingModes) => {
            const tr = document.createElement("tr");

            tr.classList.add('table-data');

            const percentage = (analysis.accuracyPercentage * 100).toFixed(2) + "%";


            tr.innerHTML = `
            <td>${name}</td>
            <td>${analysis.wordPerTime.toFixed(2)}</td>
            <td>${percentage}</td>
            <td>${Current.TypingConfig[test].label}</td>
            `;
            return tr;
        }

        divPopUp.innerHTML = `
        <span style="display:block; text-align:center; font-weight:bold;">History</span>
        <table>
        <tr class="table-head">
            <th class="name">Name</th>
            <th class="wpm">WPM</th>
            <th class="acc">Acc</th>
            <th class="test">Test</th>
        </tr>
        ${history.map(item => createUser(item.name, item.analysis, item.test).outerHTML).join('\n')}
        </table>

        `;



        const newModal = new Modal(document.getElementById("main"));
        newModal.setInput({
            popPosition: "left",
            blurElement: document.getElementById("content"),
            modalContent: divPopUp,
        })

        this.renderOpenModalPromise = newModal.render();

        return divPopUp;
    }



    protected getConfig(): { cssPath?: string; } {
        return {}
    }

}