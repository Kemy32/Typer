class LanguagesModal extends Component {
    internalRender() {
        const divPopUp = this.input.createModalContent();
        const getItems = (search) => {
            return Object.keys(Languages).filter(key => {
                const isNumber = typeof Languages[key] == "number";
                const isMatched = !search || key.toLowerCase().includes(search.toLowerCase());
                return isNumber && isMatched;
            }).map((lang) => {
                return `<div class="item">
                    <i class="fa-solid fa-check" value="${Languages[lang]}" style="transition: opacity ease-in 0.2s; opacity: 0"></i> ${lang}
                    </div>`;
            }).join('\n');
        };
        const highlightLanguage = () => {
            setTimeout(() => {
                const i = (divPopUp.querySelector(`[value="${Current.Language}"]`));
                i.style.opacity = "1";
            }, 250);
        };
        divPopUp.innerHTML = `
                <span style="display:block; text-align: center; font-weight:bold;">Languages</span>
                <input type="text" placeholder="Search Language" style="margin:15px 0 20px; " onkeypress="(function(e) { e.stopPropagation() })(event)"/>
                <div class="list">
                    ${getItems()}
                </div>
            `;
        divPopUp.querySelectorAll(".item").forEach((item) => {
            item.onclick = () => {
                const i = (divPopUp.querySelector(`[value="${Current.Language}"]`));
                i.style.opacity = "0";
                const currentI = item.children[0];
                currentI.style.opacity = "1";
                Current.Language = Number(currentI.getAttribute("value"));
                languageChange.call(Current.Language);
            };
        });
        highlightLanguage();
        const input = divPopUp.querySelector("input");
        input.onkeyup = (e) => {
            e.stopPropagation();
            const list = divPopUp.querySelector(".list");
            list.innerHTML = getItems(input.value);
        };
        const newModal = new Modal(document.getElementById("main"));
        newModal.setInput({
            popPosition: "left",
            blurElement: document.getElementById("content"),
            modalContent: divPopUp,
        });
        this.renderOpenModalPromise = newModal.render();
        return divPopUp;
    }
    getConfig() {
        return {};
    }
}
