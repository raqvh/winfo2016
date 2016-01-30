(function() {
    "use strict";

    /* Globals */
    var image_data;
    var tags;
    var rules_dict;

    /* 
        Attaches functions to their respective buttons
    */
    window.onload = function () {
      var generate = document.getElementById("generate");
      var browse = document.getElementById("browse");
      var capBut = document.getElementById("cap-but");
      setUpDictionary();
      generate.onclick = generateTags;
      generate.style.display = "none";
      browse.onchange = readSingleFile;
      capBut.onclick = newCaption;
    };

    function setUpDictionary() {
      rules_dict = new Map();
      rules_dict.set("<sentence>",["<verb> <nounp>", "<nounp>",
      "<nounp> <join> <det> <noun>", "<verb> <preposition> <det> <nounp>"]);
      rules_dict.set("<nounp>",["<det> <adjs> <noun>", "<adjs> <noun>"]);
      rules_dict.set("<adjs>",["<adj>"]);
      rules_dict.set("<adj>",[]);
      rules_dict.set("<det>",["the"]);
      rules_dict.set("<verb>",[]);
      rules_dict.set("<noun>",[]);
      rules_dict.set("<join>", ["and"])
      rules_dict.set("<preposition>", ["with", "on"]);


      var ajax = new XMLHttpRequest();
      ajax.open("GET", "dicts/adjectives.txt", true);
      ajax.onreadystatechange = function() {
        var lines = this.responseText.split('\n');
        for(var i = 0; i < lines.length; i++){
          rules_dict.get("<adj>").push(lines[i]);
        }
      }

      var ajax2 = new XMLHttpRequest();
      ajax2.open("GET", "dicts/verbs.txt", true);
      ajax2.onreadystatechange = function() {
        var lines = this.responseText.split('\n');
        for(var i = 0; i < lines.length; i++){
          rules_dict.get("<verb>").push(lines[i]);
        }
      }
      ajax.send();
      ajax2.send();
    }

    function readSingleFile(e) {
      document.getElementById("generate").style.display = "";
      document.getElementById("results").style.display = "none";
      document.getElementById("check").style.display = "";
      var file = e.target.files[0];
      if (!file) {
        return;
      }
      var reader = new FileReader();
      
      reader.onload = function(e) {
        var pic = document.getElementById("pic");
        pic.src = reader.result;

        var contents = reader.result;
        displayContents(contents);
      }
      reader.readAsDataURL(file);
    }

    function displayContents(contents) {
        var comma = contents.indexOf(',');
        image_data = contents.substring(comma + 1, contents.length);
    }

    function generateTags() {
      document.getElementById("generate").style.display = "none";
      clearPrevious();  
      document.getElementById("loading").style.display = "";
      popsicle({
          url: 'https://api.clarifai.com/v1/token/',
          method: 'POST',
          query: {
              grant_type: 'client_credentials',
              client_id: 'ckai4iAcjgNz-bCIPUDXJ7N_fy6zKAIyKMPnUAU9',
              client_secret: 'ST3kXw9muiBEN-O1Hl9o8ya8LDtHY8MQhLwzNPq_'
          }
      }).then(function(response) {
          return response.body.access_token;
      }).then(function(token) {
          return popsicle({
            url: 'https://api.clarifai.com/v1/tag/',
            method: 'POST',
            body: {encoded_data: image_data},
            headers: {
              'Authorization' : 'Bearer ' + token
            }
          })
      }).then(function(response) {
          tags = response.body.results[0].result.tag.classes;
          displayResults();
      })
    }

    function displayResults() {
      displayHashtags();
      displayCaptions();
      document.getElementById("loading").style.display = "none";
    }

    function displayHashtags() {
      var panel = document.getElementById("list1");

      var list = document.createElement("ul");
      list.className = "list-group";

      for(var i = 0; i < tags.length; i++) {
        var element = document.createElement("li");
        element.innerHTML = "#" + tags[i].replace(" ", "");
        element.className = "list-group-item";
        list.appendChild(element);
      }

      panel.appendChild(list);

      document.getElementById("results").style.display = "";

      var height = $("#pic").height();
      var subheight = $(".panel-heading").outerHeight();
      list.style.maxHeight = height - subheight + "px";
      list.style.overflowY = "scroll";
    }

    function displayCaptions() {
      for(var i = 0; i < tags.length; i++) {
        rules_dict.get("<noun>").push(tags[i]);
      }

      var element = document.createElement("h2");
      document.getElementById("list2").appendChild(element);
      newCaption();
    }

    function newCaption() {
      var sentence = getRandom("<sentence>");
      var s1 = sentence.substring(0,1).toUpperCase();
      var nameCapitalized = s1 + sentence.substring(1);
      document.getElementById("list2").firstChild.innerHTML = nameCapitalized;
    }

    function clearPrevious() {
      document.getElementById("list1").innerHTML = "";
      document.getElementById("list2").innerHTML = "";
      document.getElementById("check").style.display = "none";
      rules_dict.set("<noun>", []);
    }


    //Grammar solver code
    function isNonTerminal(nonTerminal) {
      return (rules_dict.get(nonTerminal));
    }

    function getRandom(times, symbol) {
      var results = [];

      for(var i = 0; i < times; i++) {
        results.push(getRandom(symbol).trim());
      }
      return results;
    }

    function getRandom(symbol) {
      if(!isNonTerminal(symbol)) {
        return symbol + " ";
      } else {
        var arr = rules_dict.get(symbol);
        var rule = arr[Math.floor(Math.random() * arr.length)];
        var rules = rule.match(/\S+/g);
        var result = "";
        for(var i = 0; i < rules.length; i++) {
          result += getRandom(rules[i]);
        }
      }

      return result;
    }

})();

