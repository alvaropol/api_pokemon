$(document).ready(function(){

    $.ajax({
        url: 'https://pokeapi.co/api/v2/item/?limit=300',
        type: 'GET'
    }).done(function (resp) {
        var listaItems = resp.results;
        listaItems.forEach(item => {
            var template = `<div class="item" itemId="/*aqui tengo que averiguar como pasarle el id de los items para que al pulsar en cada uno salga el modal*/"> ${item.name} <div>`;
            $('#lista-nomItems').append(template);
        });
    });
    $(document).on('click', '.item', function () {
        var itemId = $(this).attr('itemid');

        $.ajax({
            url: 'https://pokeapi.co/api/v2/item/' + itemId,
            type: 'GET' 

        }).done(function (resp) {
            $('#modal-itemnom').html(resp.name);

            $('#modal-item-datails').show();
        });
    })
});
