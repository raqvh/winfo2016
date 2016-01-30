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
				document.getElementById("summary").innerHTML = output.result;
			});
		// client.algo("algo://demo/Hello/0.1.1")
  //     	.pipe(input)
  //     	.then(function(output) {
  //       	document.getElementById("summary").innerHTML = output.result;
  //    	 });
    }

}());