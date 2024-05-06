var cinema = require('../modulo/filmes')

const getListaFilmes = function () {
    let cont = 0
    let arrayFilmes = []
    let jsonFilmes = {}
    let status = false
    while (cont < cinema.filmes.filmes.length) {
        let filme = {}
        filme.id=cinema.filmes.filmes[cont].id
        filme.nome = cinema.filmes.filmes[cont].nome
        filme.sinopse = cinema.filmes.filmes[cont].sinopse
        filme.duracao = cinema.filmes.filmes[cont].duracao
        filme.data_lancamento = cinema.filmes.filmes[cont].data_lancamento
        filme.data_relancamento = cinema.filmes.filmes[cont].data_relancamento
        filme.foto_capa = cinema.filmes.filmes[cont].foto_capa
        filme.preco = cinema.filmes.filmes[cont].valor_unitario
        arrayFilmes.push(filme)
        jsonFilmes.filmes = arrayFilmes
        cont++
        status = true
    }
    if (status) {
        return jsonFilmes
    }
    else {
        return false
    }
}

const getFilmeId = function (id) {
    let cont = 0
    let jsonFilme = {}
    let status = false
    while (cont < cinema.filmes.filmes.length) {
        if (id == cinema.filmes.filmes[cont].id) {
            jsonFilme.id=cinema.filmes.filmes[cont].id
            jsonFilme.nome = cinema.filmes.filmes[cont].nome
            jsonFilme.sinopse = cinema.filmes.filmes[cont].sinopse
            jsonFilme.duracao = cinema.filmes.filmes[cont].duracao
            jsonFilme.data_lancamento = cinema.filmes.filmes[cont].data_lancamento
            jsonFilme.data_relancamento = cinema.filmes.filmes[cont].data_relancamento
            jsonFilme.foto_capa = cinema.filmes.filmes[cont].foto_capa
            jsonFilme.preco = cinema.filmes.filmes[cont].valor_unitario
            status = true
        }
        cont++
    }
    if (status) {
        return jsonFilme
    }
    else {
        return false
    }
}

const getFilmeNome = function (nome) {
    let cont = 0
    let jsonFilme = {}
    let status = false
    while (cont < cinema.filmes.filmes.length) {
        if (nome == cinema.filmes.filmes[cont].nome) {
            jsonFilme.id=cinema.filmes.filmes[cont].id
            jsonFilme.nome = cinema.filmes.filmes[cont].nome
            jsonFilme.sinopse = cinema.filmes.filmes[cont].sinopse
            jsonFilme.duracao = cinema.filmes.filmes[cont].duracao
            jsonFilme.data_lancamento = cinema.filmes.filmes[cont].data_lancamento
            jsonFilme.data_relancamento = cinema.filmes.filmes[cont].data_relancamento
            jsonFilme.foto_capa = cinema.filmes.filmes[cont].foto_capa
            jsonFilme.preco = cinema.filmes.filmes[cont].valor_unitario
            status = true
        }
        cont++
    }
    if (status) {
        return jsonFilme
    }
    else {
        return false
    }
}
// console.log(getFilmeId(1));
// console.log(getListaFilmes());
module.exports={
    getFilmeId,
    getListaFilmes,
    getFilmeNome,
 }