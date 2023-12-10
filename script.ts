enum DisplayModes {
    Default,
    Single_Line
}

enum TypingModes {
    Words = "words",
    Time = "time",
}

enum Languages {
    English = 0,
    Arabic = 1,
    French = 2,
    German = 3,
}

class TextFormat {
    constructor(
        public hasLetters = true,
        public hasNumbers = false,
        public hasPunctuation = false
    ) { }
}

const components: ({ path: string } | string)[] = [
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
]

class Current {
    static Mode = DisplayModes.Default;
    static TypingMode = TypingModes.Time;

    static TypingConfig = {
        [TypingModes.Words]: { label: "Words", total: 10, min: 5, max: 200 },
        [TypingModes.Time]: { label: "Time", total: 60, min: 5, max: 360 }
    }

    static ModesConfig = {
        [DisplayModes.Default]: { label: "Default" },
        [DisplayModes.Single_Line]: { label: "Single line" }
    }

    static TextFormat = new TextFormat();

    static Language = Languages.English
}

class Emitter {

    private methods: { name: string, method: (value: any) => void }[] = [];

    public add(name: string, method: (value: any) => void) {
        this.methods.push({
            name,
            method
        })
    }

    public call(value: any) {
        this.methods.forEach((obj) => {
            obj.method(value);
        });
    }

    public remove(name: string) {
        this.methods = this.methods.filter((func) => {
            if (func.name == name) {
                return false;
            } else {
                return true;
            }
        })

    }
}

function loadComponents() {
    const loads = components.map(component => {
        return new Promise<void>(resolve => {
            const script = document.createElement("script");
            const isFullPath = typeof component != "string";
            const path = isFullPath ? component.path : component;

            script.src = "./components/" + (isFullPath ? path : component + "/" + component) + ".js";
            script.onload = () => resolve()
            document.head.appendChild(script);
        })
    })

    return Promise.all(loads);
}

loadComponents().then(() => {
    const nav = new SideNav(document.body);
    nav.render();

    const typingBox = new TypingBox(document.getElementById("typingBox"));
    typingBox.render();

    const resetBtn = <HTMLElement>document.querySelector(".reset-btn");
    resetBtn.onclick = () => {
        const analysis = Component.GetComponents<TypingAnalysisBox>(TypingAnalysisBox);
        if (analysis?.length) {
            analysis[0].remove();
        }
        typingBox.reset();
        typingInfo.reset();
    }

    const typingBoxBar = <HTMLElement>document.querySelector(".typingbox-bar");
    const typingInfo = new TypingInfo(typingBoxBar);
    typingInfo.render();
})

window.onclick = () => {
    const openModal = Component.GetComponents<Modal>(Modal);
    const sideNav = Component.GetComponents<SideNav>(SideNav);
    if (openModal?.length) {
        openModal[0].remove();
        sideNav[0].lastOpenedIconIndex = null;
    }

}

const languageChange = new Emitter();
/**
 class {
    methods: functions[]

    add(function) { method.add(function) }

    call() {  }

 }
 */
