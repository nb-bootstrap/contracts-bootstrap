const fs = require("fs");
const path = require("path");
const DIR = path.join("artifacts");
const COPY_FILES = ["^I.+.json$", "WETH9.json"];
const OUT_PATH = path.join("abi");

const contains = function (name) {
    for (let p in COPY_FILES) {
        if (new RegExp(COPY_FILES[p]).test(name)) {
            return true;
        }
    }
    return false;
};

// 开始读取文件
readDir(DIR);

function readDir(dir) {
    let files = fs.readdirSync(dir);
    files.forEach((item) => {
        if (fs.statSync(path.join(dir, item)).isDirectory()) {
            readDir(path.join(dir, item));
        } else {
            if (contains(item) && !item.includes(".dbg")) {
                fs.writeFileSync(path.join(OUT_PATH, item), fs.readFileSync(path.join(dir, item)));
            }
        }
    });
}
