"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getPokemons = function (limit) {
    var data;
    var address = "https://pokeapi.co/api/v2/pokemon/ditto/?limit=".concat(limit);
    return fetch(address);
};
var res = getPokemons(1)
    .then(function (pokemons) {
    pokemons.json().then(function (data) {
        //   console.log(data);
        return data;
    });
})
    .catch(function (err) {
    throw err;
});
console.log(res);
