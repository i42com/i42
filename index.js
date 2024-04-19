class Typer {
    constructor() {
        this.text = '';
        this.index = 0;
        this.speed = 3;
        this.file = 'i42.txt';
        this.accessCount = 0;
        this.deniedCount = 0;
        this.consoleElement = document.getElementById('console');
        this.init();
    }

    init() {
        setInterval(() => this.updLstChr(), 500);
        fetch(this.file)
            .then(response => response.text())
            .then(data => {
                this.text = data.slice(0, -1);
            });
        document.onkeydown = this.handleKeyDown.bind(this);
    }

    content() {
        return this.consoleElement.innerHTML;
    }

    write(str) {
        this.consoleElement.innerHTML += str;
    }

    addText(key) {
        if ([18, 20].includes(key.keyCode)) {
            const countProp = key.keyCode === 18 ? 'accessCount' : 'deniedCount';
            this[countProp]++;
            if (this[countProp] >= 3) {
                this[key.keyCode === 18 ? 'makeAccess' : 'makeDenied']();
            }
        } else if (key.keyCode === 27) {
            this.hidepop();
        } else if (this.text) {
            let content = this.content();
            if (content.endsWith('|')) {
                this.consoleElement.innerHTML = content.slice(0, -1);
            }
            this.index += (key.keyCode !== 8 ? this.speed : Math.max(0, this.index - this.speed));
            const text = this.text.substring(0, this.index).replace(/\n/g, '<br/>');
            this.consoleElement.innerHTML = text;
            window.scrollBy(0, 50);
        }

        if (key.preventDefault && key.keyCode !== 122) {
            key.preventDefault();
        }
        if (key.keyCode !== 122) {
            key.returnValue = false;
        }
    }

    updLstChr() {
        let content = this.content();
        this.consoleElement.innerHTML = content.endsWith('|') ? content.slice(0, -1) : content + '|';
    }

    handleKeyDown(e) {
        if (e.keyCode === 27) { // Fast forward text
            this.index = this.text.length;
        }
    }
}

const typer = new Typer();

function replaceUrls(text) {
    const httpPos = text.indexOf('http://');
    const spacePos = text.indexOf('.me ', httpPos);

    if (spacePos !== -1) {
        const url = text.slice(httpPos, spacePos - 1);
        return text.replace(url, `<a href="${url}">${url}</a>`);
    }
    return text;
}

let timer = setInterval(() => {
    typer.addText({keyCode: 123748});
    if (typer.index > typer.text.length) {
        clearInterval(timer);
    }
}, 30);
