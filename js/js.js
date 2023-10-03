$(document).ready(function(){

    $.ajax({
        url: 'https://pokeapi.co/api/v2/item/?limit=300',
        type: 'GET'
    }).done(function (resp) {
        var listaItems = resp.results;
        listaItems.forEach(item => {
            var template = `<p> ${item.name} <p>`;
            $('#lista-nomItems').append(template);
        });
    });
});
