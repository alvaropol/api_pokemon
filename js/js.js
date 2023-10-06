$(document).ready(function () {
    var numItems;
    var pag;
    var numItemPag=24;
    $.ajax({
        url: 'https://pokeapi.co/api/v2/item/?limit=24',
        type: 'GET'
    }).done(function (resp) {
        numItems = resp.count;
        pag= Math.trunc(numItems/numItemPag)+1;
        for (var i = 1; i < pag; i++) {
            var template= ` <li class="page-item">${i} </li>`
            $('#paginas').append(template);
            debugger;
        };
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
            $('#modal-item-details').modal('show');
        });
    });
});