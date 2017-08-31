/*
Задание №2:

Есть массив JSON. В нем содержится информация по вознаграждениям для субагентов.
Задача: 
  Оформить список в виде таблицы. Столбцы таблицы: 
  1. Застройщик - builderName
  2. ЖК - blocks.blockName
  3. План - blocks.blockPlanPercent
  4. Реклама - builderAdverticement

  Над таблицей разместить текстовое поле с плейсхоледром "Начните вводить название застройщика или ЖК".
  При вводе текста в текстовое поле должен происходить поиск в json массиве по builderName и blocks.blockName и полученный результат динамически показываться в таблице.

  По столбцу 'План' настроить сортировку asc/desc.
*/

 
var renderingArray = [];
var tableBody = document.querySelector('#table-container table tbody');

/* get data from json */

getJson("data.json", function(generated){
  var dataObject = {}; 
  dataObject = generated; 
  renderingArray = dataObject.data;
  renderingArray.forEach(function(item){
    item.visible = true;
  });
  createTable(renderingArray);
});
function getJson(url, callback){
  var req  = new XMLHttpRequest();
  req.open("GET", url);
  req.addEventListener('load', function(){
    try {
      var responseJson = JSON.parse(this.responseText);
    } catch (err) {
      console.log( "Извините, в данных ошибка, мы попробуем получить их ещё раз" );
      console.log( err.name );
      console.log( err.message );
    }
    callback(responseJson)
  });
  req.send();
}



/* Create table */

function createTable(arr){ 
  tableBody.innerHTML = ''; 
  arr.forEach(function(item){
    createTableRow(item)
  });
}
function createTableRow(item){
  var names = ''; 
  var percents = '';
  for (var i=0;i<item.blocks.length;i++){
    names += '<div>'+item.blocks[i].blockName+'</div>';
    percents += '<div>'+item.blocks[i].blockPlanPercent+'</div>';
  }

  var tr = document.createElement('tr');
  tr.innerHTML = '<td>'+item.builderName+'</td>'+
    '<td>'+names+'</td>'+
    '<td>'+percents +'</td>'+
    '<td>'+item.builderAdverticement+'</td>';
  tableBody.appendChild(tr)
}



/* Filters */

document.querySelector('#filter').addEventListener('input', filtering); 

function filtering(e) {
  var str = (e.target.value).toLowerCase();  
  renderingArray.forEach(function(item, i) {
    if (item.builderName.toLowerCase().indexOf(str) != -1 || item.blocks[0].blockName.toLowerCase().indexOf(str) != -1){
      item.visible = true;
    } else {
      item.visible = false;
    }
  });
  filterRender();
}
function filterRender(){
  var tableRows = document.querySelectorAll('#table tbody tr');
  for (var i=0;i<renderingArray.length;i++){
    if(renderingArray[i].visible){
      tableRows[i].style.display = 'table-row';
    } else{
      tableRows[i].style.display = 'none';
    }
  }
}



/* Sorting */

document.querySelector('#sort-asc').addEventListener('click', sortAsc); 
document.querySelector('#sort-desc').addEventListener('click', sortDesc); 

function sortAsc(e) {
  e.preventDefault();
  renderingArray.sort(function(a, b){
    return parseFloat(a.blocks[0].blockPlanPercent) - parseFloat(b.blocks[0].blockPlanPercent)
  });
  createTable(renderingArray);
  filterRender();
}
function sortDesc(e){
  e.preventDefault();
  renderingArray.sort(function(a, b){
    return parseFloat(b.blocks[0].blockPlanPercent) - parseFloat(a.blocks[0].blockPlanPercent)
  });
  createTable(renderingArray);
  filterRender();
}
