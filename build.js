const {
    execSync
} = require("child_process");

const fs = require("fs");
const PATH = require("path");

function clean(lang) {
    const txt = fs.readFileSync(`./languages/${lang}.txt`).toString().split("\n");
    const set = new Set(txt);

    let cleanText = Array.from(set).join("\n");

    fs.writeFileSync(`./languages/${lang}.txt`, cleanText);
}

function readFiles(extension, action = function (str) {}, path = ".") {
    const files = fs.readdirSync(path);
    files.forEach(item => {
        const _extension = PATH.extname(item);
        const location = PATH.resolve(path + "\\" + item);

        if (item.endsWith("." + extension)) {
            action(location)
        }

        if (!_extension) {
            readFiles(extension, action, location);
        }

    })
}

const isClear = process.argv[process.argv.length - 1] == "--clear";

if (isClear) {
    readFiles("js", (location) => {
        if (location !== __dirname + "\\build.js") {
            fs.unlinkSync(location);
        }
    })
    readFiles("css", (location) => {
        if (!location.startsWith(__dirname + "\\fonts")) {
            fs.unlinkSync(location);
        }
    })
} else {
    execSync("tsc");

    const langs = [
        "english",
        "arabic",
        "french",
        "german",
    ];

    const map = {};

    for (var lang of langs) {
        map[lang] = fs.readFileSync(`./languages/${lang}.txt`).toString().split('\n').map(t => t.trim())
    }

    const words = [];

    for (let index = 0; index < map.english.length; index++) {
        const wordList = [];
        for (var lang of langs) {
            wordList.push(map[lang][index]);
        }

        words.push(JSON.stringify(wordList));
    }

    let content = fs.readFileSync('./text-generator.js').toString();

    content = content.replace('var words = [];', `var words = [${words.join(',\n')}];`)

    fs.writeFileSync('./text-generator.js', content);

    readFiles("less", (location) => {
        const cssPath = location.slice(0, location.length - 4) + "css";
        execSync(`lessc ${location} ${cssPath}`);
    });
}