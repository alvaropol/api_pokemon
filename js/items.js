$(document).ready(function () {
    var currentPage = 1;
    var totalPages = 0;
    var campoBuscar = $('#campoBuscar');

    function generatePaginator(totalPages) {
        $('#pagination').empty();
        var startPage = Math.max(currentPage - 2, 1);
        var endPage = Math.min(startPage + 4, totalPages);

        if (startPage > 1) {
            var prev = $('<li class="page-item"><a class="btn" data-page="' + (startPage - 1) + '"><</a></li>');
            $('#pagination').append(prev);
        }

        for (var i = startPage; i <= endPage; i++) {
            var template = $('<li class="page-item"><a class="btn" data-page="' + i + '">' + i + '</a></li>');
            $('#pagination').append(template);
        }

        if (endPage < totalPages) {
            var next = $('<li class="page-item"><a class="btn" data-page="' + (endPage + 1) + '">></a></li>');
            $('#pagination').append(next);
        }
    }

    $.ajax({
        type: "GET",
        url: "https://pokeapi.co/api/v2/item?limit=24",
    }).done(function (resp) {
        generatePaginator(resp.count / 20);
        loadItemList(currentPage);
        $('#pagination').on('click', 'a.btn', function () {
            var clickedPage = $(this).data('page');
            if (clickedPage === 'prev' && currentPage > 1) {
                currentPage = Math.max(currentPage - 1, 1);
            } else if (clickedPage === 'next' && currentPage < totalPages) {
                currentPage = Math.min(currentPage + 1, totalPages);
            } else {
                currentPage = clickedPage;
            }
            loadItemList(currentPage);
        });
    });

    function loadItemList(page) {
        $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/item?limit=24&offset=${(page - 1) * 24}`,
        }).done(function (resp) {
            var listaItem = resp.results;
            $('#lista-nomItems').empty();
            listaItem.forEach(item => {
                $.ajax({
                    type: "GET",
                    url: item.url
                }).done(function (ItemResponse) {
                    var template = `
                    <div class="cardItem" id="cardItem" itemId="${ItemResponse.name}" style="width: 15%; text-align: center;">
                        <img class="card-img-top" src="${ItemResponse.sprites.default}" alt="Foto de Item" style="width: 50%;">
                        <div class="card-body">
                            <p class="card-text">${ItemResponse.name.toUpperCase()}</p>
                        </div>
                    </div>`;
                    $('#lista-nomItems').append(template);
                });
            });
            generatePaginator(resp.count / 20);
        });

    }
    $('#searchButton').on('click', function () {
        var itemName = campoBuscar.val().toLowerCase();
        filterItemByName(itemName);
    });

    $('#campoBuscar').on('keypress', function () {
        var itemName = campoBuscar.val().toLowerCase();
        filterItemByName(itemName);

    });

    function filterItemByName(name) {
        var allItemCards = $('.cardItem');

        allItemCards.each(function () {
            var cardName = $(this).find('.card-text').text().toLowerCase();
            if (cardName.includes(name)) {

                $(this).show();
            } else {

                $(this).hide();
            }
        });
    }

    $(document).on('click', '.cardItem', function () {
        var itemId = $(this).attr('itemId');
        $.ajax({
            url: 'https://pokeapi.co/api/v2/item/' + itemId,
            type: 'GET'
        }).done(function (resp) {
            $('#modal-bodyImg').attr("src", resp.sprites.default);
            $('#modal-bodyName').html(resp.name.toUpperCase());
            $('#modal-bodyCategory').html("CATEGORY: " + resp.category.name.toUpperCase());
            $('#modal-bodyEffect').html(resp.effect_entries[0].effect.toUpperCase());
            $('#modal-item-details').modal('show');
        });
    });

});
