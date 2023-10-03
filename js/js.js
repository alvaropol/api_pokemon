$(document).ready(function(){

    $.ajax({
        url: 'https://pokeapi.co/api/v2/item/?limit=300',
        type: 'GET'
    }).done(function (resp) {
        var listaItems = resp.results;
        listaItems.forEach(item => {
            var template = `<div> ${item.name} <div>`;
            $('#lista-nomItems').append(template);
        });
    });
    $(document).on('click', '.item', function () {
        var itemId = $(this).attr('itemid');

        $.ajax({
            url: 'https://pokeapi.co/api/v2/item/' + itemId,
            type: 'GET' 

        }).done(function (resp) {
            $('#modal-item').html(resp.name);

            $('#modal-item-datails').show();
        });
    })
});
