var EnjuNDC = EnjuNDC || {};
(function (global) {
  var _ = EnjuNDC;
  var ndc_api = "https://ndc-api-beta.arukascloud.io/ndc9/";
  _.baseurl = "https://enju.next-l.jp";
  _.bootstrap = function() {
    var codes = ["0", "1", "16", "2", "29", "3", "4", "49", "5", "59", "6", "7", "78", "79", "8", "9"];
    var root = $("#ndc-root")[0];
    console.log(root);
    console.log(_.baseurl);
    root.innerHTML = expand_narrower(codes);
  };
  function expand_narrower(codes) {
    var str = "";
    for (var code of codes) {
      str += _expand_narrower(code);
    }
    return str;
  };
  function _expand_narrower(code) {
    var str = "";;
    str += "<li id=\"enjundc"+ escape_code(code) +"\"><a href=\"" + _.baseurl + "/manifestations?query=classification_sm%3Andc9_" + code + "*\">" + code + ": <span id=\"";
    str += "ndcapi" + escape_code(code) + "\"></span> <span id=\"enjundc" + escape_code(code) + "\"></span></a> <span id=\"ndcapi_narrow_" + escape_code(code) + "\"></span></li>";
    var url = ndc_api + code;
    $.getJSON(url, function(data) {
      var local_code = code;
      console.log(data);
      $("span#ndcapi"+escape_code(data["notation"]))[0].innerHTML = data["prefLabel@ja"];
      if (data["narrower"].length > 0) {
        $("span#ndcapi_narrow_"+escape_code(data["notation"]))[0].innerHTML = "<a href='javascript:EnjuNDC.expand_narrower({parent:"
                                                                 + JSON.stringify(data["notation"]) + ", narrower:" + JSON.stringify(data["narrower"]) + "})'>[+]</a>";
      }
      var enju_url = _.baseurl + "/manifestations.json?query=classification_sm%3Andc9_" + local_code + "*";
      $.ajax({
        url: enju_url,
        dataType: "json",
        success: function(data, status, xhr) {
          console.log(data);
          console.log(escape_code(local_code));
          //hits = Math.floor(Math.random()*10);
          var hits = data["total_count"];
          $("span#enjundc"+escape_code(local_code))[0].innerHTML = "("+hits+")";
        },
      });
    });
    return str;
  };
  function escape_code(code) {
    return code.replace(/\./, "_");
  };
  _.expand_narrower = function (obj) {
    console.log(obj["parent"]);
    console.log($("li#enjundc" + escape_code(obj["parent"])));
    $("li#enjundc" + escape_code(obj["parent"]))[0].innerHTML += "<ul></ul>";
    $("li#enjundc" + escape_code(obj["parent"]) + " ul")[0].innerHTML += expand_narrower(obj["narrower"]);
  };
}(this));
$(function() {
  EnjuNDC.bootstrap();
});
