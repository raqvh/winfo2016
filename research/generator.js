(function() {
    "use strict";

    var titles = [];
    var sums = [];
    var callsLeft = null;
    var sumsCallsLeft = null;

    window.onload = function() {
        var generate = document.getElementById("gen");
        generate.onclick = test;
        document.getElementById("file_input").addEventListener('change', uploadText, false);
        document.getElementById("file_input").addEventListener('change', uploadText, false);
        //     document.getElementById("image_input").addEventListener('change', uploadImage, false);
    };

    function test() {
        //var client = Algorithmia.client("sim1xkhR27Dzh5uFbgL17cFx0NC1");
        var input = document.getElementById("input_text").value;
        Algorithmia.client("sim1xkhR27Dzh5uFbgL17cFx0NC1")
            .algo("algo://nlp/AutoTag/1.0.0")
            .pipe(input)
            .then(function(output) {

                getArticles(output.result);
            });
    }

    function uploadText(event) {
        console.log("uploading a file...");
        var reader = new FileReader();
        reader.onload = function(event) {
            var contents = event.target.result;
            document.getElementById("input_text").value = reader.result;
        };
        reader.onerror = function(event) {
            console.error("File could not be read! Code " + event.target.error.code);
        };
        reader.readAsText(event.target.files[0]);
    }

    function uploadImage(event) {
        var input = event.target.files[0];
        console.log("reading image: " + input);
        Algorithmia.client("sim1xkhR27Dzh5uFbgL17cFx0NC1")
            .algo("algo://ocr/RecognizeCharacters/0.2.2")
            .pipe(input)
            .then(function(output) {
                console.log(output);
            });
    }

    function uploadText(event) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var contents = event.target.result;
            document.getElementById("input_text").value = reader.result;
        };
        reader.onerror = function(event) {
            console.error("File could not be read! Code " + event.target.error.code);
        };
        reader.readAsText(event.target.files[0]);
    }

    function addLinks(tags, list, index, count, seen, func) {
        var input = {
            "search": tags[index]
        };
        Algorithmia.client("sim1xkhR27Dzh5uFbgL17cFx0NC1")
            .algo("algo://web/WikipediaParser/0.1.0")
            .pipe(input)
            .then(function(output) {
                var j = 0;
                for (var i = 0; i < count; i++) {
                    if (seen.indexOf(output.result[j]) === -1 && output.result[j].indexOf("disambiguation") === -1) {
                        titles.push(output.result[j]);
                        seen.push(output.result[j]);
                    } else {
                        i -= 1;
                    }
                    j++;
                }
                callsLeft--;
                if(callsLeft <= 0) {
                    func();
                }
            });
    }

    function getArticles(tags) {
        clear();
        var links = document.getElementById("links");
        var list = document.createElement("ul");
        list.id = "linklist";
        list.className = "list-group";
        var seen = [];

        console.log("hi");
        callsLeft = 4;
        addLinks(tags, list, 0, 2, seen, getSummaries);
        addLinks(tags, list, 1, 2, seen, getSummaries);
        addLinks(tags, list, 2, 1, seen, getSummaries);
        addLinks(tags, list, 3, 1, seen, getSummaries);
        console.log("end");

        //document.getElementById("col1").appendChild(list);
    }

    function createSummariesInPage() {
        alert("HELLO");
        console.log(sums);
        var list = document.createElement("ul");
        for(var j = 0; j < 6; j++) {
            var element = document.createElement("li");
            var wikiLink = "https://en.wikipedia.org/wiki/" + titles[j].replace(" ", "_");
            var newLink = document.createElement("a");
            newLink.href = wikiLink;
            newLink.target = "_blank";
            element.appendChild(newLink);
            newLink.innerHTML = sums[j];
            element.className = "list-group-item";
            var par = document.createElement("p");
            element.appendChild(par);
            list.appendChild(element);
        }

        document.getElementById("summary").appendChild(list);
    }

    function getSummaries() {
        console.log(titles);
        sumsCallsLeft = titles.length;
        // console.log("length of titles: " + titles.length);
        for(var i = 0; i < titles.length; i++) {
            // console.log("Title number: " + i);
            var inp = {
                "articleName": titles[i]
            };

            Algorithmia.client("sim1xkhR27Dzh5uFbgL17cFx0NC1")
                .algo("algo://web/WikipediaParser/0.1.0")
                .pipe(inp)
                .then(function(resultz) {
                    console.log(resultz);
                    // console.log("sum API call: " + resultz.result.summary);
                    sums.push(resultz.results.summary);
                    sumsCallsLeft--;
                    // console.log("sums: " + sumsCallsLeft);
                    if(sumsCallsLeft <= 0) {
                        createSummariesInPage();
                    }
                });
        }
    }

    function clear() {
        var col = document.getElementById("col1");
        console.log(document.getElementById("linklist"));
        var list = document.getElementById("linklist");
        if (list !== null) {
            col.removeChild(list);
        }
        document.getElementById("summary").innerHTML = "";
    }


}());