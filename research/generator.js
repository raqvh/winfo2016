(function() {
    "use strict";

    window.onload = function () {
        var generate = document.getElementById("gen");
        generate.onclick = test;
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
		// client.algo("algo://demo/Hello/0.1.1")
  //     	.pipe(input)
  //     	.then(function(output) {
  //       	document.getElementById("summary").innerHTML = output.result;
  //    	 });
    }

    function getArticles(tags) {
    	for(var i = 0; i < tags.length; i++) {
    		console.log(tags[i]);
    	}

    	var input = {"search": "Great Filter"};
		Algorithmia.client("sim1xkhR27Dzh5uFbgL17cFx0NC1")
           .algo("algo://web/WikipediaParser/0.1.0")
           .pipe(input)
           .then(function(output) {
             console.log(output.result[0]);
             var links = document.getElementById("links");
             var list = document.createElement("ul");
             list.className = "list-group";
             for(var i = 0; i < 5; i++) {
             	//console.log("hi" + i);
             	var element = document.createElement("li");
             	var wikiLink = "https://en.wikipedia.org/wiki/" + output.result[i].replace(" ", "_");
             	var newLink = document.createElement("a");
             	newLink.href = wikiLink;
             	newLink.target = "_blank";
             	element.appendChild(newLink);
             	newLink.innerHTML = output.result[i];
             	element.className = "list-group-item";
             	list.appendChild(element);
             	console.log(output.result[i]);
             }
             document.getElementById("col2").appendChild(list);
           });
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
  

}());