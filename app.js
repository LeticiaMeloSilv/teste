/*
 * Para realizar a integracao com o banco de dados, devemos ultilizar uma das seguintes bibliotecas
 *      -SEQUELIZE--biblioteca mais antiga
 *      -PRISMA ORM--biblioteca mais atual(ultilizaremos no projeto)
 *      -FASTFY ORM--biblioteca mais atual
 * 
 * 
 *  para instalacao do prisma:
 * npm install prisma --save (responsavel pela conexao com o BD)
 * npm install @prisma/client --save (responsavel por executar scripts SQL no banco)
 * npx prisma init (responsavel por inicializar o prisma)
 * npx prisma migrate dev
 * 
 * npm i
 * npx prisma generate
*/


const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')

    app.use(cors())

    next()
})
/**************************************************************Import dos aquivos de controller do projeto**************************************************************/

const controleDados = require('./controller/funcoes')
const controllerFilmes = require('./controller/controller_filme.js')

/*******************************************************************************ENDPOINTS*******************************************************************************/
//Criacao de um objeto para controlar a chegada de dados da requisicao em formato json
const bodyParserJSON = bodyParser.json()

//*******************************************************************************FILME********************************************************************************************/
//pega todos os filmes localmente-ok
app.get('/V1/ACMEFilmes/filmes', cors(), async function (request, response) {
    let listaFilmes = controleDados.getListaFilmes();

    if (listaFilmes) {
        response.json(listaFilmes)
        response.status(200)
    }
    else {
        response.status(404);
    }
})//Periodo de utilização 01/2024-02/2024
//pega todos os filmes do banco-ok(falta colocar no select coisas da nacionalidade, genero, ator e diretor)
app.get('/V2/ACMEFilmes/filmes', cors(), async function (request, response) {
    let dadosFilmes = await controllerFilmes.getListarFilmes()

    response.json(dadosFilmes)
    response.status(200)

})//Ativo

//pega todos os filmes do mesmo genero-ok(falta adicionar nacionalidade, ator e diretor)
app.get('/V2/ACMEFilmes/filmes/genero/:genero', cors(), async function (request, response) {
    let id = request.params.genero

    let dadosFilmes = await controllerFilmes.getListarFilmesByGenero(id)
    if (dadosFilmes) {
        response.json(dadosFilmes)
        response.status(200)
    }
    else {
        response.status(404);
        response.json({ erro: 'Item não encontrado' })
    }

})
//pega todos os filmes da mesma nacionalidade-ok(falta adicionar genero, ator e diretor)
app.get('/V2/ACMEFilmes/filmes/nacionalidade/:nacionalidade', cors(), async function (request, response) {
    let id = request.params.nacionalidade

    let dadosFilmes = await controllerFilmes.getListarFilmesByNacionalidade(id)
    if (dadosFilmes) {
        response.json(dadosFilmes)
        response.status(200)
    }
    else {
        response.status(404);
        response.json({ erro: 'Item não encontrado' })
    }

})
//Retorna filmes com filtro de nome-ok(adicionar genero, ator e diretor)
app.get('/V2/ACMEFilmes/filmes/filtro', cors(), async function (request, response) {
    let nome = request.query.nome
    let dadosFilme = await controllerFilmes.getNomeFilme(nome)

    response.json(dadosFilme)
    response.status(200)
})

//Retorna dados do filme local filtrando pelo id-ok
app.get('/V1/ACMEFilmes/filme/1/:id', cors(), async function (request, response) {
    let id = request.params.id
    let filme = controleDados.getFilmeId(id)
    if (filme) {
        response.json(filme)
        response.status(200)
    }
    else {
        response.status(404);
        response.json({ erro: 'Item não encontrado' })
    }
})//Periodo de utilizacao 01/2024-02/2024
//Retorna dados do filme do banco filtrando pelo id(sem genero)
app.get('/V2/ACMEFilmes/filme/:id', cors(), async function (request, response) {
    let idFilme = request.params.id

    let dadosFilme = await controllerFilmes.getBuscarFilme(idFilme)

    response.status(dadosFilme.status_code)
    response.json(dadosFilme)
})//periodo de utilizacao 02/2024-04/2024
//Retorna dados do filme do banco filtrando pelo id
app.get('/V3/ACMEFilmes/filme/:id', cors(), async function (request, response) {
    let idFilme = request.params.id

    let dadosFilme = await controllerFilmes.getBuscarFilmePorIdComGenero(idFilme)

    response.status(dadosFilme.status_code)
    response.json(dadosFilme)
})//Ativo(V3 &V4 dao o mesmo resultado, por meios diferentes(o v3 ta sem infos especificas da classificacao))
app.get('/V4/ACMEFilmes/filme/:id', cors(), async function (request, response) {
    let idFilme = request.params.id

    let dadosFilme = await controllerFilmes.getBuscarFilmePorId(idFilme)

    response.status(dadosFilme.status_code)
    response.json(dadosFilme)
})//Ativo(V3 &V4 dao o mesmo resultado, por meios diferentes)

// V3 &V4 FALTA NACIONALIDADE,GENERO E TALS

//Manda pro DB dados de um novo filme(mudar o jeito q manda as infos(sem ser por id tlvzz??))
app.post('/V2/ACMEFilmes/filme', cors(), bodyParserJSON, async function (request, response) {

    let contentType=request.headers['content-type']
    let dadosBody = request.body

    let resultDadosNovoFilme = await controllerFilmes.setInserirNovoFilme(dadosBody,contentType)

    response.status(resultDadosNovoFilme.status_code)
    response.json(resultDadosNovoFilme)
})
//deleta filme(Fazer ele deletar todas as info até as de outras tabelas)DEU ERRO DO NADA, VERIFICAR
app.delete('/V2/ACMEFilmes/filme/:id', cors(), async function (request,response) {
    let idFilme = request.params.id

    let resultDados = await controllerFilmes.setExcluirFilme(idFilme)
    response.status(resultDados.status_code)
    response.json(resultDados)
})
//atualiza filme
app.put('/V2/ACMEFilmes/filme/:id', cors(), bodyParserJSON, async function (request, response) {
    let idFilme = request.params.id
    let contentType=request.headers['content-type']
    let dadosBody = request.body
    
    let resultDadosNovoFilme = await controllerFilmes.setAtualizarFilme(idFilme,dadosBody,contentType)

    response.status(resultDadosNovoFilme.status_code)
    response.json(resultDadosNovoFilme)
})
//******************************************************************************GENERO*******************************************************************************************/
app.get('/V3/ACMEFilmes/generos', cors(), async function (request, response) {
    let dadosGeneros = await controllerFilmes.getListarGeneros()

    response.json(dadosGeneros)
    response.status(200)
})
app.post('/V3/ACMEFilmes/genero', cors(), bodyParserJSON, async function (request, response) {

    let contentType=request.headers['content-type']
    let dadosBody = request.body

    let resultDadosNovoGenero = await controllerFilmes.setInserirNovoGenero(dadosBody,contentType)

    response.status(resultDadosNovoGenero.status_code)
    response.json(resultDadosNovoGenero)
})
app.delete('/V3/ACMEFilmes/genero/:id', cors(), async function (request,response) {
    let idGenero = request.params.id

    let resultDados = await controllerFilmes.setExcluirGenero(idGenero)

    response.status(resultDados.status_code)
    response.json(resultDados)
})
app.put('/V3/ACMEFilmes/genero/:id', cors(), bodyParserJSON, async function (request, response) {
    let idGenero = request.params.id

    let contentType=request.headers['content-type']
    let dadosBody = request.body
    
    let resultDadosNovoGenero = await controllerFilmes.setAtualizarGenero(idGenero,dadosBody,contentType)

    response.status(resultDadosNovoGenero.status_code)
    response.json(resultDadosNovoGenero)
})
app.get('/V3/ACMEFilmes/genero/:id', cors(), async function (request, response) {
    let idGenero = request.params.id

    let dadosGenero = await controllerFilmes.getBuscarGenero(idGenero)

    response.status(dadosGenero.status_code)
    response.json(dadosGenero)
})
//******************************************************************************CLASSIFICACAO*******************************************************************************************/
app.get('/V3/ACMEFilmes/classificacoes', cors(), async function (request, response) {
    let dadosClassificacoes = await controllerFilmes.getListarClassificacoes()

    response.json(dadosClassificacoes)
    response.status(200)
})
app.post('/V3/ACMEFilmes/classificacao', cors(), bodyParserJSON, async function (request, response) {

    let contentType=request.headers['content-type']
    let dadosBody = request.body

    let resultDadosNovaClassificacao = await controllerFilmes.setInserirNovaClassificacao(dadosBody,contentType)

    response.status(resultDadosNovaClassificacao.status_code)
    response.json(resultDadosNovaClassificacao)
})
app.delete('/V3/ACMEFilmes/classificacao/:id', cors(), async function (request,response) {
    let idClassificacao = request.params.id

    let resultDados = await controllerFilmes.setExcluirClassificacao(idClassificacao)

    response.status(resultDados.status_code)
    response.json(resultDados)
})
app.put('/V3/ACMEFilmes/classificacao/:id', cors(), bodyParserJSON, async function (request, response) {
    let idClassificacao = request.params.id

    let contentType=request.headers['content-type']
    let dadosBody = request.body
    
    let resultDadosNovoClassificacao = await controllerFilmes.setAtualizarClassificacao(idClassificacao,dadosBody,contentType)

    response.status(resultDadosNovoClassificacao.status_code)
    response.json(resultDadosNovoClassificacao)
})
app.get('/V3/ACMEFilmes/classificacao/:id', cors(), async function (request, response) {
    let idClassificacao = request.params.id

    let dadosClassificacao = await controllerFilmes.getBuscarClassificacao(idClassificacao)

    response.status(dadosClassificacao.status_code)
    response.json(dadosClassificacao)
})
//******************************************************************************ATOR*******************************************************************************************/
app.get('/V3/ACMEFilmes/atores', cors(), async function (request, response) {
    let dadosAtores = await controllerFilmes.getListarAtores()

    response.json(dadosAtores)
    response.status(200)
})
app.post('/V3/ACMEFilmes/ator', cors(), bodyParserJSON, async function (request, response) {

    let contentType=request.headers['content-type']
    let dadosBody = request.body
    
    let resultDadosNovaAtor = await controllerFilmes.setInserirNovoAtor(dadosBody,contentType)

    response.status(resultDadosNovaAtor.status_code)
    response.json(resultDadosNovaAtor)
})
app.delete('/V3/ACMEFilmes/ator/:id', cors(), async function (request,response) {
    let idAtor = request.params.id

    let resultDados = await controllerFilmes.setExcluirAtor(idAtor)

    response.status(resultDados.status_code)
    response.json(resultDados)
})
app.put('/V3/ACMEFilmes/ator/:id', cors(), bodyParserJSON, async function (request, response) {
    let idAtor = request.params.id

    let contentType=request.headers['content-type']
    let dadosBody = request.body
    
    let resultDadosNovoAtor = await controllerFilmes.setAtualizarAtor(idAtor,dadosBody,contentType)

    response.status(resultDadosNovoAtor.status_code)
    response.json(resultDadosNovoAtor)
})
app.get('/V3/ACMEFilmes/ator/:id', cors(), async function (request, response) {
    let idAtor = request.params.id

    let dadosAtor = await controllerFilmes.getBuscarAtor(idAtor)

    response.status(dadosAtor.status_code)
    response.json(dadosAtor)
})
//******************************************************************************DIRETOR*******************************************************************************************/
app.get('/V3/ACMEFilmes/diretores', cors(), async function (request, response) {
    let dadosDiretores = await controllerFilmes.getListarDiretores()

    response.json(dadosDiretores)
    response.status(200)
})
app.post('/V3/ACMEFilmes/diretor', cors(), bodyParserJSON, async function (request, response) {

    let contentType=request.headers['content-type']
    let dadosBody = request.body
    
    let resultDadosNovoDiretor = await controllerFilmes.setInserirNovoDiretor(dadosBody,contentType)

    response.status(resultDadosNovoDiretor.status_code)
    response.json(resultDadosNovoDiretor)
})
app.delete('/V3/ACMEFilmes/diretor/:id', cors(), async function (request,response) {
    let idDiretor = request.params.id

    let resultDados = await controllerFilmes.setExcluirDiretor(idDiretor)

    response.status(resultDados.status_code)
    response.json(resultDados)
})
app.put('/V3/ACMEFilmes/diretor/:id', cors(), bodyParserJSON, async function (request, response) {
    let idDiretor = request.params.id

    let contentType=request.headers['content-type']
    let dadosBody = request.body
    
    let resultDadosNovodiretor = await controllerFilmes.setAtualizarDiretor(idDiretor,dadosBody,contentType)

    response.status(resultDadosNovodiretor.status_code)
    response.json(resultDadosNovodiretor)
})
app.get('/V3/ACMEFilmes/diretor/:id', cors(), async function (request, response) {
    let idDiretor = request.params.id

    let dadosDiretor = await controllerFilmes.getBuscarDiretor(idDiretor)

    response.status(dadosDiretor.status_code)
    response.json(dadosDiretor)
})
//******************************************************************************NACIONALIDADE*******************************************************************************************/

app.get('/V3/ACMEFilmes/nacionalidades', cors(), async function (request, response) {
    let dadosNacionalidades = await controllerFilmes.getListarNacionalidades()

    response.json(dadosNacionalidades)
    response.status(200)
})
app.get('/V3/ACMEFilmes/nacionalidade/:id', cors(), async function (request, response) {
    let idNacionalidade = request.params.id

    let dadosNacionalidade = await controllerFilmes.getBuscarNacionalidade(idNacionalidade)

    response.status(dadosNacionalidade.status_code)
    response.json(dadosNacionalidade)
})

/***********************************************************************************************************************************************************************/

app.listen('8080', function () {
    console.log('API funcionando!!!! Bom trabalho, dá uma descançada, um cafezinho nunca cai mal!!')
})




































