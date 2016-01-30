(function() {
    "use strict";

    window.onload = function () {
        var generate = document.getElementById("gen");
        generate.onclick = test;
        document.getElementById("file_input").addEventListener('change', uploadText, false);
    };

    function test() {
    	//var client = Algorithmia.client("sim1xkhR27Dzh5uFbgL17cFx0NC1");
		var input = document.getElementById("input_text").value;
		Algorithmia.client("sim1xkhR27Dzh5uFbgL17cFx0NC1")
			.algo("algo://nlp/AutoTag/1.0.0")
			.pipe(input)
			.then(function(output) {
				getArticles(output.result);
				document.getElementById("summary").innerHTML = output.result;
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

	function addLinks(tags, list, index, count, seen) {
		var input = {"search": tags[index]};
		Algorithmia.client("sim1xkhR27Dzh5uFbgL17cFx0NC1")
        .algo("algo://web/WikipediaParser/0.1.0")
        .pipe(input)
        .then(function(output) {
        var j = 0;
	        for(var i = 0; i < count; i++) {
	        	if(seen.indexOf(output.result[j]) === -1 && output.result[j].indexOf("disambiguation") === -1) {
		            var element = document.createElement("li");
		            var wikiLink = "https://en.wikipedia.org/wiki/" + output.result[j].replace(" ", "_");
		            var newLink = document.createElement("a");
		            newLink.href = wikiLink;
		            newLink.target = "_blank";
		            element.appendChild(newLink);
		            newLink.innerHTML = output.result[j];
		            element.className = "list-group-item";
		            list.appendChild(element);
		            seen.push(output.result[j]);
	        	} else {
	        		i -= 1;
	        	}
	        	j++;
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
    	addLinks(tags, list, 0, 2, seen);
    	addLinks(tags, list, 1, 2, seen);
    	addLinks(tags, list, 2, 1, seen);
    	addLinks(tags, list, 3, 1, seen);
    	console.log("end");

		document.getElementById("col2").appendChild(list);
    	
       }
       
      function clear() {
      	var col = document.getElementById("col2");
      	console.log(document.getElementById("linklist"));
      	var list = document.getElementById("linklist");
      	if(list !== null) {
      		col.removeChild(list);
      	}
      	document.getElementById("summary").innerHTML = "";
      }
  

}());