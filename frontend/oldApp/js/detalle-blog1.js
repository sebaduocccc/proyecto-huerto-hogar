    var items = '[{"Id":1,"Title":"Para que la alimentación sea saludable, debe ser inocua, es decir, no contener contaminantes microbianos y químicos"}\
    ,{"Id":2,"Title":"La alimentación saludable puede adoptar muchas formas, pero debe basarse siempre en cuatro principios fundamentales: adecuación, equilibrio, moderación y diversidad."}\
    ,{"Id":3,"Title":"Las preferencias y los comportamientos alimentarios establecidos en la infancia y adolescencia suelen prolongarse hasta la edad adulta."}\
    ,{"Id":4,"Title":"Las prácticas alimentarias saludables deben iniciarse en las primeras etapas de la vida. La lactancia materna favorece un crecimiento saludable y mejora el desarrollo cognitivo."}\
    ,{"Id":5,"Title":"La base de toda alimentación saludable es un conjunto de alimentos mínimamente procesados y no procesados, con bajo contenido de grasas no saludables, azúcares libres y sodio."},\
    {"Id":6,"Title":"La alimentación tiene una influencia determinante en la salud y el bienestar, tanto a nivel individual como de la población en su conjunto. Las dietas poco saludables son un factor de riesgo importante de enfermedades y discapacidad."},\
    {"Id":7,"Title":"La alimentación saludable ayuda a protegerse frente a la malnutrición en todas sus formas, así como frente a las enfermedades no transmisibles (ENT), como la diabetes, las cardiopatías, el accidente cerebrovascular y el cáncer."},\
    {"Id":8,"Title":"Los carbohidratos deben proceder principalmente de cereales integrales, verduras, frutas y legumbres. Entre los cereales integrales se incluyen el maíz, el mijo, la avena, el trigo y el arroz integral en su forma no procesada. Las legumbres comprenden, entre otras, las lentejas, los garbanzos, los frijoles y los guisantes secos."},\
    {"Id":9,"Title":"Las frutas y verduras frescas son opciones adecuadas, al igual que las congeladas y las enlatadas, siempre que no contengan azúcares añadidos ni cantidades excesivas de sodio. Aunque los zumos de fruta pueden consumirse, la mayoría de las variedades —incluso las que no llevan azúcares añadidos— contienen cantidades elevadas de azúcares libres, por lo que su consumo debe limitarse."},\
    {"Id":10,"Title":"Las personas mayores de 10 años deberían procurar consumir al menos 400 g de frutas y verduras al día. En el caso de los niños de entre 6 y 9 años, la cantidad recomendada es de 350 g diarios, y para los niños de entre 2 y 5 años, al menos 250 g."}]';
    var pager = {};
    pager.items = JSON.parse(items);
    pager.itemsPerPage = 5;
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