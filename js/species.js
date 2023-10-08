$(document).ready(function () {
    var currentPage = 1;
    var totalPages = 0;
    var campoBuscar = $('#campoBuscar');
    var tipoSeleccionado = 'all';

    function asignarColor(tipos) {

        var tipoColor = {
            "grass": "7ED876",
            "water": "6EA1FF",
            "fire": "d17921",
            "electric": "DFDF59",
            "normal": "939e93",
            "flying": "60c3d6",
            "bug": "1e8200",
            "ground": "855113",
            "poison": "944b8d",
            "fairy": "d4a1cf",
            "fighting": "ff3d3d",
            "psychic": "ab007d",
            "rock": "c49e78",
            "ice": "b5ebe5",
            "dragon": "2643ff",
            "ghost": "5a6294",
            "dark": "605975",
            "steel": "7286b0"
        };

        return tipoColor[tipos[0]];
    }


    function cargarTipos() {
        $.ajax({
            type: "GET",
            url: "https://pokeapi.co/api/v2/type/",
        }).done(function (resp) {

            var tipoSelect = $('#tipoSelect');

            tipoSelect.empty();

            tipoSelect.append('<option value="all">ALL</option>');

            resp.results.forEach(function (tipo) {
                tipoSelect.append('<option value="' + tipo.name + '">' + tipo.name.toUpperCase() + '</option>');
            });
        });
    }

    cargarTipos();



    $('#tipoSelect').on('change', function () {

        tipoSeleccionado = $(this).val();
        currentPage = 1;
        loadPokemonList(currentPage, tipoSeleccionado);
    });

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
        url: "https://pokeapi.co/api/v2/pokemon?limit=20",
    }).done(function (resp) {

        totalPages = Math.ceil(resp.count / 20);

        generatePaginator(totalPages);

        loadPokemonList(currentPage, tipoSeleccionado); // Primero enseñamos la página 1 (currentPage=1)

        $('#pagination').on('click', 'a.btn', function () {
            var clickedPage = $(this).data('page');

            if (clickedPage === 'prev' && currentPage > 1) {
                currentPage = Math.max(currentPage - 1, 1);
            } else if (clickedPage === 'next' && currentPage < totalPages) {
                currentPage = Math.min(currentPage + 1, totalPages);
            } else {
                currentPage = clickedPage;
            }

            loadPokemonList(currentPage, tipoSeleccionado);
        });
    });

    function loadPokemonList(page, tipoSeleccionado = 'all') {
        $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${(page - 1) * 20}`,
        }).done(function (resp) {
            var listaPokemon = resp.results;
            $('#listaPokemon').empty();


            listaPokemon.forEach(function (pokemon) {
                $.ajax({
                    type: "GET",
                    url: pokemon.url
                }).done(function (pokemonResponse) {
                    var tipos = pokemonResponse.types.map(function (type) {
                        return type.type.name;
                    });
                    if (tipoSeleccionado === 'all' || tipos.includes(tipoSeleccionado)) {
                        var color = asignarColor(tipos);

                        var template = `
                            <div class="col-lg-3 col-md-6 col-sm-12 mb-3 unidadPokemon" id="unidadPokemon">
                                <a class="btn" type="button" id="tarjetaPokemon" data-id="${pokemonResponse.id}" style="border-radius: 20px; background-color: #${color};">
                                    <h2 class="nombrePokemon" id="nombrePokemon" style="padding: 20px; font-size: 15px;">${pokemonResponse.id} - ${pokemon.name.toUpperCase()}</h2><img style="padding: 20px;"
                                        src="https://img.pokemondb.net/sprites/home/normal/${pokemon.name}.png"
                                        class="card-img-top"/>
                                </a>
                            </div>
                        `;

                        $('#listaPokemon').append(template);
                    }
                });
            });

            $('#searchButton').on('click', function () {
                var pokemonName = campoBuscar.val().toLowerCase();
                filterPokemonByName(pokemonName);
            });

            $('#campoBuscar').on('keypress', function () {

                var pokemonName = campoBuscar.val().toLowerCase();
                filterPokemonByName(pokemonName);

            });



            function filterPokemonByName(name) {
                var allPokemonCards = $('.unidadPokemon');

                allPokemonCards.each(function () {
                    var cardName = $(this).find('.nombrePokemon').text().toLowerCase();
                    if (cardName.includes(name)) {

                        $(this).show();
                    } else {

                        $(this).hide();
                    }
                });
            }

            $(document).on('click', '#unidadPokemon', function () {

                var pokemonId = $(this).find('#tarjetaPokemon').data('id');

                $.ajax({
                    type: "GET",
                    url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`,
                }).done(function (pokemonDetails) {

                    var pokemonHp, pokemonAttack, pokemonDefense, pokemonSpeed;

                    var tipo = pokemonDetails.types.map(type => type.type.name);

                    var color1 = asignarColor(tipo);


                    for (var i = 0; i < pokemonDetails.stats.length; i++) {
                        //Como stats es un array de características busco el que sea hp para buscar la vida del pokemon
                        if (pokemonDetails.stats[i].stat.name === "hp") {

                            pokemonHp = pokemonDetails.stats[i].base_stat;

                        }
                    }

                    for (var i = 0; i < pokemonDetails.stats.length; i++) {
                        var stat = pokemonDetails.stats[i].stat;

                        if (stat.name === "attack") {

                            pokemonAttack = pokemonDetails.stats[i].base_stat;
                        } else if (stat.name === "defense") {

                            pokemonDefense = pokemonDetails.stats[i].base_stat;
                        } else if (stat.name === "speed") {
                            pokemonSpeed = pokemonDetails.stats[i].base_stat;
                        }

                        if (pokemonAttack !== undefined && pokemonDefense !== undefined && pokemonSpeed !== undefined) {
                            break;
                        }
                    }

                    if (pokemonId >= 0 && pokemonId < 10) {
                        $('#pokemon_name').html(`00${pokemonId}<br> - <br>${pokemonDetails.name.toUpperCase()}`);
                    } else if (pokemonId >= 10 && pokemonId < 100) {
                        $('#pokemon_name').html(`0${pokemonId}<br> - <br>${pokemonDetails.name.toUpperCase()}`);
                    } else {
                        $('#pokemon_name').html(`${pokemonId}<br> - <br>${pokemonDetails.name.toUpperCase()}`);
                    }


                    $('#attack_stat').text(pokemonAttack);
                    $('#defense_stat').text(pokemonDefense);
                    $('#speed_stat').text(pokemonSpeed);
                    $('#height').text(pokemonDetails.height / 10 + "m");
                    $('#weight').text(pokemonDetails.weight / 100 + "kg");
                    $('#base_experience').text(pokemonDetails.base_experience);
                    $('#abilities').text(pokemonDetails.abilities[0].ability.name);
                    $("#imagePokemon").attr("src", `https://img.pokemondb.net/sprites/home/normal/${pokemonDetails.name}.png`);
                    $('#hp_pokemon').text(pokemonHp);
                    $('#specie_name').css('background-color', `#${color1}`);
                    $('#specie_name').text(tipo);


                    $('#card').css('background', `radial-gradient(circle at 50% 0%, #${color1} 39%, rgb(255, 255, 255) 36%)`)



                    $('#pokemon_detail_modal').modal('show');
                });

            });
            generatePaginator(resp.count / 20);
        });
    }
});