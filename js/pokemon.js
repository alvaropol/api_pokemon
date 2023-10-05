$(document).ready(function () {

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

    $.ajax({
        type: "GET",
        url: "https://pokeapi.co/api/v2/pokemon?limit=900/",
    }).done(function (resp) {
        var listaPokemon = resp.results;
        listaPokemon.forEach(pokemon => {

            $.ajax({
                type: "GET",
                url: pokemon.url
            }).done(function (pokemonResponse) {

                var tipos = pokemonResponse.types.map(type => type.type.name);

                var color = asignarColor(tipos);

                var template = `
                    <div class="col-lg-3 col-md-6 col-sm-12 mb-3" id="unidadPokemon">
                        <a class="btn" type="button" id="tarjetaPokemon" data-id="${pokemonResponse.id}" style="border-radius: 20px; background-color: #${color};">
                            <h2 style="padding: 20px; font-size: 15px;">${pokemonResponse.id} - ${pokemon.name.toUpperCase()}</h2><img style="padding: 20px;"
                                src="https://img.pokemondb.net/sprites/home/normal/${pokemon.name}.png"
                                class="card-img-top"/>
                        </a>
                    </div>
                `;

                $('#listaPokemon').append(template);


            });
        });
    });

    $(document).on('click', '#unidadPokemon', function () {

        var pokemonId = $(this).find('#tarjetaPokemon').data('id');

        $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`,
        }).done(function (pokemonDetails) {

            var pokemonHp, pokemonAttack, pokemonDefense, pokemonSpeed;

            var tipos = pokemonDetails.types.map(type => type.type.name);

            var color1 = asignarColor(tipos);


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
            $('#specie_name').text(tipos);


            $('#card').css('background', `radial-gradient(circle at 50% 0%, #${color1} 39%, rgb(255, 255, 255) 36%)`)



            $('#pokemon_detail_modal').modal('show');
        });


    });
});






