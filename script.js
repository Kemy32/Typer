var DisplayModes;
(function (DisplayModes) {
    DisplayModes[DisplayModes["Default"] = 0] = "Default";
    DisplayModes[DisplayModes["Single_Line"] = 1] = "Single_Line";
})(DisplayModes || (DisplayModes = {}));
var TypingModes;
(function (TypingModes) {
    TypingModes["Words"] = "words";
    TypingModes["Time"] = "time";
})(TypingModes || (TypingModes = {}));
var Languages;
(function (Languages) {
    Languages[Languages["English"] = 0] = "English";
    Languages[Languages["Arabic"] = 1] = "Arabic";
    Languages[Languages["French"] = 2] = "French";
    Languages[Languages["German"] = 3] = "German";
})(Languages || (Languages = {}));
class TextFormat {
    constructor(hasLetters = true, hasNumbers = false, hasPunctuation = false) {
        this.hasLetters = hasLetters;
        this.hasNumbers = hasNumbers;
        this.hasPunctuation = hasPunctuation;
    }
}
const components = [
    { path: "modal-components/languages" },
    { path: "modal-components/modes" },
    { path: "modal-components/history" },
    "checkbox",
    "radio",
    "range-measure",
    "button-selector",
    "side-nav",
    "modal",
    "typing-info",
    "typing-analysis",
    "typing-box",
];
class Current {
}
Current.Mode = DisplayModes.Default;
Current.TypingMode = TypingModes.Time;
Current.TypingConfig = {
    [TypingModes.Words]: { label: "Words", total: 10, min: 5, max: 200 },
    [TypingModes.Time]: { label: "Time", total: 60, min: 5, max: 360 }
};
Current.ModesConfig = {
    [DisplayModes.Default]: { label: "Default" },
    [DisplayModes.Single_Line]: { label: "Single line" }
};
Current.TextFormat = new TextFormat();
Current.Language = Languages.English;
class Emitter {
    constructor() {
        this.methods = [];
    }
    add(name, method) {
        this.methods.push({
            name,
            method
        });
    }
    call(value) {
        this.methods.forEach((obj) => {
            obj.method(value);
        });
    }
    remove(name) {
        this.methods = this.methods.filter((func) => {
            if (func.name == name) {
                return false;
            }
            else {
                return true;
            }
        });
    }
}
function loadComponents() {
    const loads = components.map(component => {
        return new Promise(resolve => {
            const script = document.createElement("script");
            const isFullPath = typeof component != "string";
            const path = isFullPath ? component.path : component;
            script.src = "./components/" + (isFullPath ? path : component + "/" + component) + ".js";
            script.onload = () => resolve();
            document.head.appendChild(script);
        });
    });
    return Promise.all(loads);
}
loadComponents().then(() => {
    const nav = new SideNav(document.body);
    nav.render();
    const typingBox = new TypingBox(document.getElementById("typingBox"));
    typingBox.render();
    const resetBtn = document.querySelector(".reset-btn");
    resetBtn.onclick = () => {
        const analysis = Component.GetComponents(TypingAnalysisBox);
        if (analysis === null || analysis === void 0 ? void 0 : analysis.length) {
            analysis[0].remove();
        }
        typingBox.reset();
        typingInfo.reset();
    };
    const typingBoxBar = document.querySelector(".typingbox-bar");
    const typingInfo = new TypingInfo(typingBoxBar);
    typingInfo.render();
});
window.onclick = () => {
    const openModal = Component.GetComponents(Modal);
    const sideNav = Component.GetComponents(SideNav);
    if (openModal === null || openModal === void 0 ? void 0 : openModal.length) {
        openModal[0].remove();
        sideNav[0].lastOpenedIconIndex = null;
    }
};
const languageChange = new Emitter();
/**
 class {
    methods: functions[]

    add(function) { method.add(function) }

    call() {  }

 }
 */
