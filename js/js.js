$(document).ready(function(){


    $.ajax({
        url: "https://pokeapi.co/api/v2/item/?limit=1510",
        type: "GET",
        dataType: "json",
    }).done(function(respu){
        var listadoitems= respu.results;
        listadoitems.forEach(i => {
            $.ajax({
                url: i.url,
                type: "GET",
                dataType: "json",
            }).done(function(item){
                var template= `<h3>${item.category.name}<h3>`;
                $('#lista-catItems').append(template);
            })
        })
    });
});