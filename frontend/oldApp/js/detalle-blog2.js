var items = '[{"Id":1,"Title":"El mensaje número 10 de las Guías Alimentarias para Chile, elaborado por el Instituto de Nutrición y Tecnología de los Alimentos de la Universidad de Chile, destaca la necesidad de proteger el planeta, cuidar el agua, evitar el desperdicio de alimentos, separar los residuos y reciclar. "}\
    ,{"Id":2,"Title":"Se entiende por “sistema alimentario sostenible” aquel que garantiza la seguridad alimentaria y la nutrición de las personas sin poner en riesgo las bases económicas, sociales y ambientales de la seguridad alimentaria de futuras generaciones "}\
    ,{"Id":3,"Title":"Los alimentos de temporada respetan las estaciones y las condiciones climáticas propicias,proporcionando productos con mejores características organolépticas y nutricionales. Además,los alimentos adquiridos en su temporada suelen ser más económicos y sostenibles."}\
    ,{"Id":4,"Title":"La sostenibilidad es importante a lo largo de toda la cadena alimentaria (producción,transformación y distribución), tanto en productos animales como vegetales. El medioambiente suele ser más vulnerable a la producción intensiva que a los sistemas tradicionales de producción, cría o pesca y, por ello, hay que fomentar los sistemas alimentarios armónicos y sostenibles."}\
    ,{"Id":5,"Title":"La Dieta Mediterránea representa uno de los ejemplos más emblemáticos de alimentación saludable y sostenible."},\
    {"Id":6,"Title":"Utiliza la biodiversidad terrestre y acuática de forma sostenible para asegurar su continuidad."}]';
    var pager = {};
    pager.items = JSON.parse(items);
    pager.itemsPerPage = 3;
    pagerInit(pager);
        
    function bindList() {
      var pgItems = pager.pagedItems[pager.currentPage];
      $("#myList").empty();
      for(var i = 0; i < pgItems.length; i++){
        var option = $('<li class="list-group-item">');
        for( var key in pgItems[i] ){
          option.html(pgItems[i][key]);
        }
        $("#myList").append(option);
      }
    }
    function prevPage(){
      pager.prevPage();
      bindList();
    }
    function nextPage(){
      pager.nextPage();
      bindList();
    }
    function pagerInit(p) {
      p.pagedItems = [];
      p.currentPage = 0;
      if (p.itemsPerPage === undefined) {
        p.itemsPerPage = 5;
      }
      p.prevPage = function () {
	if (p.currentPage > 0) {
          p.currentPage--;
        }
      };
      p.nextPage = function () {
        if (p.currentPage < p.pagedItems.length - 1) {
          p.currentPage++;
        }
      };
      init = function () {
        for (var i = 0; i < p.items.length; i++) {
          if (i % p.itemsPerPage === 0) {
            p.pagedItems[Math.floor(i / p.itemsPerPage)] = [p.items[i]];
          } else {
            p.pagedItems[Math.floor(i / p.itemsPerPage)].push(p.items[i]);
          }
        }
      };
      init();
    }		
    $(function() {
      bindList();
    });