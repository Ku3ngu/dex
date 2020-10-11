//jshint esversion: 10

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

function createTable(list, query) {
    for (i = 0; i < list.length; i++) {
        document.querySelector(query).innerHTML += ("<li class = \"type " + list[i] + "\">" + list[i].toProperCase() + "</li>");
    }
}

async function getData(pok) {

    try {

        const response = await P.getPokemonByName(pok.toLowerCase());
        const {
            name,
            stats
        } = response;

        if (response) {
            document.querySelector(".pokeType").innerHTML = "";
            document.querySelector(".pokeStatNames").innerHTML = "";
            document.querySelector(".pokeStatVals").innerHTML = "";
            document.querySelector(".weak").innerHTML = "";
            document.querySelector(".vWeak").innerHTML = "";
            document.querySelector(".resist").innerHTML = "";
            document.querySelector(".immune").innerHTML = "";

        }

        document.querySelector(".pokeImg").innerHTML = "<img src = \"" + response.sprites.front_default + "\" class = \"pkpic\"/>";
        document.querySelector(".pokeName").innerHTML = (name).toProperCase();

        let statname = [];
        let statval = [];

        stats.forEach(st => {
            statname.push(st.stat.name.replace("special-", "Sp. ").toProperCase());
            statval.push(st.base_stat);
        });

        let typing = [];

        for (i = 0; i < response.types.length; i++) {
            if (i > 0) {
                document.querySelector(".pokeType").innerHTML += "/";
            }
            document.querySelector(".pokeType").innerHTML += (response.types[i].type.name).toProperCase();
            typing.push(response.types[i].type.name);

        }

        let x2d = [];
        let x4d = [];
        let res = [];
        let immune = [];

        for (i = 0; i < typing.length; i++) {
            let j = await P.getTypeByName(typing[i]);
            let k = j.damage_relations.double_damage_from;
            let imm = j.damage_relations.no_damage_from;
            let resist = j.damage_relations.half_damage_from;

            for (l = 0; l < resist.length; l++) {
                if (!res.includes(resist[l].name)) {
                    res.push(resist[l].name);
                }
            }

            for (l = 0; l < imm.length; l++) {
                immune.push(imm[l].name);
            }

            for (l = 0; l < k.length; l++) {
                let tw = k[l].name;

                if (!x2d.includes(tw)) {
                    x2d.push(tw);
                } else {
                    let index = x2d.indexOf(tw);
                    x2d.splice(index, 1);
                    x4d.push(tw);
                }
            }
        }


        for (i = 0; i < x2d.length; i++) {
            if (immune.includes(x2d[i])) {
                x2d.splice(x2d[i], 1);
            }
        }

        for (i = 0; i < res.length; i++) {
            let re = res[i];
            if (x2d.includes(re)) {
                let index = x2d.indexOf(re);
                x2d.splice(index, 1);
                res.splice(res.indexOf(re), 1);

            } else if (x4d.includes(re)) {
                let index = x4d.indexOf(re);
                x2d.push(re[i]);
                x4d.splice(index, 1);
            } else if (immune.includes(re)) {
                res.splice(res.indexOf(re), 1);
            }
        }
        if (!x4d[0]) {
            x4d.push("None");
        }
        if (!res[0]) {
            res.push('None');
        }
        if (!immune[0]) {
            immune.push('None');
        }

        let statTotal = 0;

        for (i = 0; i < statname.length; i++) {
            document.querySelector(".pokeStatNames").innerHTML += ("<li>" + (statname[i] == "Hp" ? statname[i].toUpperCase() : statname[i].toProperCase()) + ": </li>");
            document.querySelector(".pokeStatVals").innerHTML += ("<li>" + statval[i] + "</li>");
            statTotal += statval[i];
        }

        console.log(statTotal);
        document.querySelector(".pokeStatNames").innerHTML += ("<li>Total: </li>");
        document.querySelector(".pokeStatVals").innerHTML += ("<li>" + statTotal + "</li>");

        createTable(x2d, ".weak");
        createTable(x4d, ".vWeak");
        createTable(res, ".resist");
        createTable(immune, ".immune");
        document.getElementById("pokeInput").placeholder = name.toProperCase();
    } catch {
        var y = document.querySelector(".invalid");
        y.classList.remove("hidden");
        document.getElementById("pokeInput").value = "";
    }


}

getData("pikachu");

function getInput() {
    var x = document.getElementById("pokeInput").value;
    var y = document.querySelector(".invalid");

    if (x) {
        getData(x);
        y.classList.add("hidden");

    } else {
        y.classList.remove("hidden");
    }
    x = "";
}