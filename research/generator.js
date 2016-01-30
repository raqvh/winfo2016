(function() {
    "use strict";
    //var articles = [];
   // var summed = [];

    window.onload = function () {
        var generate = document.getElementById("gen");
        generate.onclick = test;
            document.getElementById("file_input").addEventListener('change', uploadText, false);
    document.getElementById("image_input").addEventListener('change', uploadImage, false);
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


  function addLinks(articles, tags, index, count, seen) {
    var input = {"search": tags[index]};
    Algorithmia.client("sim1xkhR27Dzh5uFbgL17cFx0NC1")
        .algo("algo://web/WikipediaParser/0.1.0")
        .pipe(input)
        .then(function(output) {
          var j = 0;
          for(var i = 0; i < count; i++) {
            var name = output.result[j];
            //var summary = "";
            if(seen.indexOf(name) === -1 && name.indexOf("disambiguation") === -1) {
              
              console.log(name + "addding");
              articles.push(name);
              seen.push(name);
            } else {
              i -= 1;
            }
            j++;
          }
        });


  }

    function getArticles(tags) {
      //clear();
      var seen = [];
      var articles = [];
      var done = false;
      console.log("hi");
      addLinks(articles, tags, 0, 2, seen);
      addLinks(articles, tags, 1, 2, seen);
      addLinks(articles, tags, 2, 1, seen);
      addLinks(articles, tags, 3, 1, seen);
      done = true; 

      console.log(articles);
      if(done) {
        genHTML(articles);
      }
      console.log("end");
      
       }


    function genHTML(articles) {
    console.log(articles);
    var links = document.getElementById("links");
      var list = document.createElement("ul");
      list.id = "linklist";
      list.className = "list-group";

    for(var i = 0; i < articles.length; i++) {
      console.log(i);
      var name = articles[i];
      var article = {"articleName": name};
      Algorithmia.client("sim1xkhR27Dzh5uFbgL17cFx0NC1")
          .algo("algo://web/WikipediaParser/0.1.0")
          .pipe(article)
          .then(function(finish) {
            //console.log(finish.result.summary);
            var summary = finish.result.summary;
            console.log(summary);
            var paragraph = document.createElement("p");
            paragraph.innerHTML = summary;
            var element = document.createElement("li");
            var wikiLink = "https://en.wikipedia.org/wiki/" + name.replace(" ", "_");
            var newLink = document.createElement("a");
            newLink.href = wikiLink;
            newLink.target = "_blank";
            element.appendChild(newLink);
            newLink.innerHTML = name;
            element.className = "list-group-item";
            element.appendChild(paragraph);
            list.appendChild(element);
          });

      }

      document.getElementById("col1").appendChild(list);
  }

      function clear() {
        var col = document.getElementById("col1");
        console.log(document.getElementById("linklist"));
        var list = document.getElementById("linklist");
     //   articles = [];
        if(list !== null) {
          col.removeChild(list);
        }
        document.getElementById("summary").innerHTML = "";
      }
  

}());