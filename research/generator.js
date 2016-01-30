(function() {
    "use strict";

    window.onload = function () {
        var generate = document.getElementById("gen");
        generate.onclick = test;
        console.log("hi");
    };

    function test() {
    	console.log("Hi");
    	// var client = Algorithmia.client("sim1xkhR27Dzh5uFbgL17cFx0NC1");
    	// var input = 41;
	    // var client = Algorithmia.client("YOUR_API_KEY");
	    // client.algo("docs/JavaAddOne").pipe(input).then(function(output) {
	    // if(output.error) return console.error("error: " + output.error);
	    //    console.log(output.result);
	    //    document.getElementById("input_text").innerHTML = output.result;
    }

}());