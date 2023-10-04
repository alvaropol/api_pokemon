$(document).ready(function () {

    $.ajax({
        url: 'https://pokeapi.co/api/v2/item/?limit=700',
        type: 'GET'
    }).done(function (resp) {
        var listaItems = resp.results;
        listaItems.forEach(item => {
            $.ajax({
                url: item.url,
                type: 'GET'
            }).done(function (items) {
                var template = `
                <div class="cardItem" itemId="${items.name}" style="width: 15%; text-align: center;">
                <img class="card-img-top" src="${items.sprites.default}" alt="Foto de Item" style="width: 50%;">
                    <div class="card-body">
                        <p class="card-text">${items.name}</p>
                    </div>
                </div>`
                $('#lista-nomItems').append(template);

            });

        });
    });
    $.ajax({
        url: 'https://pokeapi.co/api/v2/move/?limit=700',
        type: 'GET'
    }).done(function (resp) {
        var listaItemsM = resp.results;
        listaItemsM.forEach(itemM => {
            $.ajax({
                url: itemM.url,
                type: 'GET'
            }).done(function (itemsM) {
                var templateM = `
                <img class="modal-img" src="${itemsM.sprites.default}" alt="Foto de item modal" style="text-align: left;">
                <h3 class="modal-title" style="text-align: rigth;">${itemsM.name}</h3>
                <p class="modal-categoria" style="text-align: rigth;">${itemsM.category.name}</p>
                <p class="modal-uso" style="text-align:rigth;">${itemsM.effect_entries[0].effect}</p>
                `
                $('#modal-bodyItems').append(templateM);
            })
        });

    })
    $(document).on('click', '.cardItem', function () {
        var itemId = $(this).attr('itemId');

        $.ajax({
            url: 'https://pokeapi.co/api/v2/item/' + itemId,
            type: 'GET'

        }).done(function (resp) {
            $('#modal-bodyImg').attr("src", resp.sprites.default);
            $('#modal-bodyName').html(resp.name);
            $('#modal-bodyCategory').html(resp.category.name);
            $('#modal-bodyEffect').html(resp.effect_entries[0].effect);



            $('#modal-item-details').show();
        });
    });
});