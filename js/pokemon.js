$(document).ready(function () {

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

                function asignarColor(tipos) {
                    if (tipos.includes("grass")) {
                        return "7ED876";
                    } else if (tipos.includes("water")) {
                        return "6EA1FF";
                    } else if (tipos.includes("fire")) {
                        return "d17921"
                    } else if (tipos.includes("electric")) {
                        return "DFDF59"
                    } else if (tipos.includes("normal")) {
                        return "939e93"
                    } else if (tipos.includes("flying")) {
                        return "60c3d6"
                    } else if (tipos.includes("bug")) {
                        return "1e8200"
                    } else if (tipos.includes("ground")) {
                        return "855113"
                    } else if (tipos.includes("poison")) {
                        return "944b8d"
                    } else if (tipos.includes("fairy")) {
                        return "d4a1cf"
                    } else if (tipos.includes("fighting")) {
                        return "ff3d3d"
                    } else if (tipos.includes("psychic")) {
                        return "ab007d"
                    } else if (tipos.includes("rock")) {
                        return "c49e78"
                    } else if (tipos.includes("ice")) {
                        return "b5ebe5"
                    } else if (tipos.includes("dragon")) {
                        return "2643ff"
                    } else if (tipos.includes("ghost")) {
                        return "5a6294"
                    } else if (tipos.includes("dark")) {
                        return "180459"
                    } else if (tipos.includes("steel")) {
                        return "7286b0"
                    } else {
                        return "FFFFFF";
                    }
                }

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





            $('#attack_stat').text(pokemonAttack);
            $('#defense_stat').text(pokemonDefense);
            $('#speed_stat').text(pokemonSpeed);

            $('#pokemon_name').text(pokemonDetails.name.toUpperCase());
            $("#imagePokemon").attr("src", `https://img.pokemondb.net/sprites/home/normal/${pokemonDetails.name}.png`);
            $('#hp_pokemon').text(pokemonHp);



            $('#pokemon_detail_modal').modal('show');
        });
    });
});






