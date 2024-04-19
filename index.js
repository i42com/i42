var Typer = {
    text: null,
    accessCountimer: null,
    index: 0,
    speed: 3, // Updated typing speed
    file: "i42.txt", // Specific file name included
    accessCount: 0,
    deniedCount: 0,
    init: function() {
        this.accessCountimer = setInterval(function() { Typer.updLstChr(); }, 500);
        $.get(this.file, function(data) {
            Typer.text = data;
            Typer.text = Typer.text.slice(0, Typer.text.length - 1);
        });
    },
    content: function() {
        return $("#console").html();
    },
    write: function(str) {
        $("#console").append(str);
        return false;
    },
    addText: function(key) {
        if (key.keyCode == 18) {
            this.accessCount++;
            if (this.accessCount >= 3) {
                this.makeAccess();
            }
        } else if (key.keyCode == 20) {
            this.deniedCount++;
            if (this.deniedCount >= 3) {
                this.makeDenied();
            }
        } else if (key.keyCode == 27) {
            this.hidepop();
        } else if (this.text) {
            var cont = this.content();
            if (cont.substring(cont.length - 1, cont.length) == "|")
                $("#console").html($("#console").html().substring(0, cont.length - 1));
            if (key.keyCode != 8) {
                this.index += this.speed;
            } else {
                if (this.index > 0)
                    this.index -= this.speed;
            }
            var text = this.text.substring(0, this.index);
            var rtn = new RegExp("\\n", "g");

            $("#console").html(text.replace(rtn, "<br/>"));
            window.scrollBy(0, 50);
        }

        if (key.preventDefault && key.keyCode != 122) {
            key.preventDefault();
        }
        if (key.keyCode != 122) { // other way prevent keys default behavior
            key.returnValue = false;
        }
    },
    updLstChr: function() {
        var cont = this.content();
        if (cont.substring(cont.length - 1, cont.length) == "|")
            $("#console").html($("#console").html().substring(0, cont.length - 1));
        else
            this.write("|"); // else write it
    }
}

// Function to replace URLs in text
function replaceUrls(text) {
    var http = text.indexOf("http://");
    var space = text.indexOf(".me ", http);
    if (space != -1) {
        var url = text.slice(http, space-1);
        return text.replace(url, "<a href=\"" + url + "\">" + url + "</a>");
    } else {
        return text;
    }
}

// Initialize Typer
Typer.init();

// Timer for adding text
var timer = setInterval("t();", 30);
function t() {
    Typer.addText({"keyCode": 123748});
    if (Typer.index > Typer.text.length) {
        clearInterval(timer);
    }
}
