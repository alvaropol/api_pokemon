$(document).ready(function(){

    $.ajax({
        url: 'https://pokeapi.co/api/v2/item/?limit=700',
        type: 'GET'
    }).done(function (resp) {
        var listaItems = resp.results;
        listaItems.forEach(item => {
            $.ajax({
                url: item.url,
                type: 'GET'
            }).done(function(items){
                var template= `
                <div class="cardItem" itemId="${items.name}" style="width: 15%;">
                <img class="card-img-top" src="${items.sprites.default}" alt="Foto de Item">
                    <div class="card-body">
                        <p class="card-text" style="text-align: center;">${items.name}</p>
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
            $('#modal-itemnom').html(resp.name);

            $('#modal-item-datails').show();
        });
    })
});
