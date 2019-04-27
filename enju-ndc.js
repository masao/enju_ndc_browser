var EnjuNDC = EnjuNDC || {};
(function (global) {
  var _ = EnjuNDC;
  var ndc_api = "https://ndc-api-beta.arukascloud.io/ndc9/";
  _.baseurl = "https://enju.next-l.jp";
  _.bootstrap = function() {
    //var codes = Array(10).keys();
    var codes = ["0", "1", "16", "2", "29", "3", "4", "49", "5", "59", "6", "7", "78", "79", "8", "9"];
    var root = $("#ndc-root")[0];
    console.log(root);
    console.log(_.baseurl);
    root.innerHTML = expand_narrower(codes);
  };
  function expand_narrower(codes) {
    var str = "";
    for (var code of codes) {
      str += "<li id=\"enjundc"+ code +"\"><a href=\"" + _.baseurl + "/manifestations?query=classification_sm%3Andc9_" + code + "*\">" + code + ": <span id=\"";
      str += "ndcapi" + code + "\"></span> <span id=\"enjundc" + code + "\"></span></a> <span id=\"ndcapi_narrow_" + code + "\"></span></li>";
      var url = ndc_api + code;
      $.getJSON(url, function(data) {
        console.log(data);
        $("span#ndcapi"+data["notation"])[0].innerHTML = data["prefLabel@ja"];
        if (data["narrower"].length > 0) {
          $("span#ndcapi_narrow_"+data["notation"])[0].innerHTML = "<a href='javascript:EnjuNDC.expand_narrower({parent:"
                                                                   + JSON.stringify(data["notation"]) + ", narrower:" + JSON.stringify(data["narrower"]) + "})'>[+]</a>";
        }
      });
      var enju_url = _.baseurl + "/manifestations.rss?query=classification_sm%3Andc9_" + code + "*";
      $.ajax({
        url: enju_url,
        dataType: "xml",
        success: function(data, status, xhr) {
          console.log(data);
          hits = Math.floor(Math.random()*10);
          $("span#enjundc")[0].innerHTML = "("+hits+")";
        },
        //error: function(data, status, xhr) {
        //  hits = Math.floor(Math.random()*10);
        //  $("span#enjundc" + code)[0].innerHTML = "("+hits+")";
        //},
      });
    }
    return str;
  };
  _.expand_narrower = function (obj) {
    console.log(obj["parent"]);
    console.log($("li#enjundc" + obj["parent"]));
    $("li#enjundc" + obj["parent"])[0].innerHTML += "<ul></ul>";
    $("li#enjundc" + obj["parent"] + " ul")[0].innerHTML += expand_narrower(obj["narrower"]);
  };
}(this));
$(function() {
  EnjuNDC.bootstrap();
});
