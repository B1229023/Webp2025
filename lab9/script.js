var openUrl =
"https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=6";

var xhr = new XMLHttpRequest();
xhr.open('GET', openUrl, true);
xhr.send();
xhr.onreadystatechange = function() {
if(this.readyState == 4 && this.status == 200) {
  dataset = JSON.parse(this.responseText);
  addNewData (dataset);
  }
};
function addNewData (dataset) {
  var myTable = document.getElementById("csie");
  dataset.forEach(function(data, index) {
    var row = myTable. insertRow(-1);
    row. insertCell(0).innerHTML = data['title'];
    row. insertCell(1).innerHTML = data['showInfo'] [0] ['location'];
    row. insertCell(2).innerHTML = data['showInfo'] [0] ['price'];
  });
}
   function delOlData() {
     var myTable = document.getElementById("csie");
     var rowcount = myTable.rows.length;
     if(rowcount > 1) var row =myTable.deleteRow(rowcount-1);
 }