(function() {
    "use strict";

    window.onload = function () {
        var generate = document.getElementById("gen");
        generate.onclick = test;
        document.getElementById("file_input").onchange = uploadText;
    };

    function test() {
    	//var client = Algorithmia.client("sim1xkhR27Dzh5uFbgL17cFx0NC1");
		var input = document.getElementById("input_text").value;
		Algorithmia.client("sim1xkhR27Dzh5uFbgL17cFx0NC1")
			.algo("algo://nlp/AutoTag/1.0.0")
			.pipe(input)
			.then(function(output) {
				console.log(output.result);
				getArticles(output.result);
				document.getElementById("summary").innerHTML = output.result;
			});
    }

    function uploadText() {
		var file = document.getElementById("file_input").value;
		var reader = new FileReader();
		reader.readAsText(file.value);
		document.getElementById("input_text").innerHTML = reader.result;
	}

    function getArticles(tags) {
    	clear();
    	var links = document.getElementById("links");
    	var list = document.createElement("ul");
    	list.id = "linklist";
    	list.className = "list-group";
    	for(var i = 0; i < 5; i++) {
    		console.log(tags[i]);


    		var input = {"search": tags[i]};
			Algorithmia.client("sim1xkhR27Dzh5uFbgL17cFx0NC1")
           .algo("algo://web/WikipediaParser/0.1.0")
           .pipe(input)
           .then(function(output) {
             console.log(output.result[0]);
             
             
             
           //  for(var i = 0; i < 5; i++) {
             	//console.log("hi" + i);
             	var element = document.createElement("li");
             	var wikiLink = "https://en.wikipedia.org/wiki/" + output.result[0].replace(" ", "_");
             	var newLink = document.createElement("a");
             	newLink.href = wikiLink;
             	newLink.target = "_blank";
             	element.appendChild(newLink);
             	newLink.innerHTML = output.result[0];
             	element.className = "list-group-item";
             	list.appendChild(element);
             	console.log(output.result[0]);
          //   }
             
           });
    	}
    	document.getElementById("col2").appendChild(list);
       }

      // var list = document.createElement("ul");
      // list.className = "list-group";

      // for(var i = 0; i < tags.length; i++) {
      //   var element = document.createElement("li");
      //   element.innerHTML = "#" + tags[i].replace(" ", "");
      //   element.className = "list-group-item";
      //   list.appendChild(element);
      // }

      // panel.appendChild(list);
      function clear() {
      	var col = document.getElementById("col2");
      	console.log(document.getElementById("linklist"));
      	var list = document.getElementById("linklist");
      	if(list != null) {
      		col.removeChild(list);
      	}
      	document.getElementById("summary").innerHTML = "";
      }
  

}());