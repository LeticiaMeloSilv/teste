/****************************************************
 * OBJETIVO: Arquivo responsavel pelas validacoes e consistencias de dados de filmes
 * Data:01/02/2024
 * Autor: Letícia Melo
 * Versão: 1.0
 ****************************************************/

const filmesDAO = require('../model/DAO/filme.js')//import do arquivo responsavel pela interacao com o BD(model)
const message = require('../modulo/config.js')//import do arquivo de configuracao do projeto

//*******************************************************************************FILME********************************************************************************************/
//funcao para inserir um novo filme
const setInserirNovoFilme = async function (dadosFilme, contentType) {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {

            let novoFilmeJSON = {}

            if (dadosFilme.nome == '' || dadosFilme.nome == undefined || dadosFilme.nome == null || dadosFilme.nome.length > 80 ||
                dadosFilme.sinopse == '' || dadosFilme.sinopse == undefined || dadosFilme.sinopse == null || dadosFilme.sinopse.length > 65000 ||
                dadosFilme.duracao == '' || dadosFilme.duracao == undefined || dadosFilme.duracao == null || dadosFilme.duracao.length > 8 ||
                dadosFilme.data_lancamento == '' || dadosFilme.data_lancamento == undefined || dadosFilme.data_lancamento == null || dadosFilme.data_lancamento.length != 10 ||
                dadosFilme.foto_capa == '' || dadosFilme.foto_capa == undefined || dadosFilme.foto_capa == null || dadosFilme.foto_capa > 200 ||
                dadosFilme.valor_unitario.length > 6 ||
                dadosFilme.id_classificacao==undefined || dadosFilme.id_classificacao==null||dadosFilme.id_classificacao=='' ||
                dadosFilme.id_genero==undefined || dadosFilme.id_genero==null||dadosFilme.id_genero==''
            ) {
                return message.ERROR_REQUIRED_FIELDS//400 
            }
            else {
                let validateStatus = false
                if (dadosFilme.data_relancamento != null &&
                    dadosFilme.data_relancamento != '' &&
                    dadosFilme.data_relancamento != undefined) {
                    if (dadosFilme.data_relancamento.length != 10) {
                        return message.ERROR_REQUIRED_FIELDS//400
                    }
                    else {
                        validateStatus = true
                    }
                }
                else {
                    validateStatus = true
                }
                if (validateStatus) {
                    let novoFilme = await filmesDAO.insertFilme(dadosFilme)
                    let ultimoID = await filmesDAO.getIDFilme()
                    dadosFilme.id_filme = Number(ultimoID[0].id)
                    let novoFilmeGenero = await filmesDAO.insertFilmeGenero(dadosFilme)

                    if (novoFilme && novoFilmeGenero) {

                        novoFilmeJSON.filme = dadosFilme
                        novoFilmeJSON.status = message.SUCCESS_CREATED_ITEM.status//201
                        novoFilmeJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code//201
                        novoFilmeJSON.message = message.SUCCESS_CREATED_ITEM.message//201                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                        return novoFilmeJSON
                    }
                    else {

                        return message.ERROR_INTERNAL_SERVER_DB//500
                    }
                }
            }
        }
        else {
            return message.ERROR_CONTENT_TYPE//415
        }
    } catch (error) {

        return message.ERROR_INTERNAL_SERVER//500-erro na controller
    }

}
//funcao para atualizar um filme
const setAtualizarFilme = async function (id, dadoAtualizado, contentType) {
    if (String(contentType).toLowerCase() == 'application/json') {
        let atualizarFilmeJSON = {}
        let validateStatus = false
        let ultimoID = await filmesDAO.getIDFilme()
        if (id == '' || id == undefined || id == isNaN(id) || id == null) {
            return message.ERROR_INVALID//400
        }
        else if (id >ultimoID) {
            return message.ERROR_NOT_FOUND//404
        }
        else {
            if (dadoAtualizado.nome == '' || dadoAtualizado.nome == undefined || dadoAtualizado.nome == null || dadoAtualizado.nome.length > 80 ||
                dadoAtualizado.sinopse == '' || dadoAtualizado.sinopse == undefined || dadoAtualizado.sinopse == null || dadoAtualizado.sinopse.length > 65000 ||
                dadoAtualizado.duracao == '' || dadoAtualizado.duracao == undefined || dadoAtualizado.duracao == null || dadoAtualizado.duracao.length > 8 ||
                dadoAtualizado.data_lancamento == '' || dadoAtualizado.data_lancamento == undefined || dadoAtualizado.data_lancamento == null || dadoAtualizado.data_lancamento.length != 10 ||
                dadoAtualizado.foto_capa == '' || dadoAtualizado.foto_capa == undefined || dadoAtualizado.foto_capa == null || dadoAtualizado.foto_capa > 200 ||
                dadoAtualizado.valor_unitario.length > 6 ||
                dadoAtualizado.id_classificacao==undefined || dadoAtualizado.id_classificacao==null||dadoAtualizado.id_classificacao==''||
                dadoAtualizado.id_genero==undefined || dadoAtualizado.id_genero==null||dadoAtualizado.id_genero==''

            ) {
                return message.ERROR_REQUIRED_FIELDS//400
            }
            else {
                if (dadoAtualizado.data_relancamento != null &&
                    dadoAtualizado.data_relancamento != '' &&
                    dadoAtualizado.data_relancamento != undefined) {
                    if (dadoAtualizado.data_relancamento.length != 10) {
                        return message.ERROR_REQUIRED_FIELDS//400
                    }
                    else {
                        validateStatus = true
                    }
                }
                else {
                    validateStatus = true
                }
            }
            if (validateStatus) {
                let novoFilme = await filmesDAO.updateFilme(id, dadoAtualizado)
                // let novoFilmeGenero = await filmesDAO.updateFilmeGenero(id, dadoAtualizado)

                if (novoFilme) {
                    atualizarFilmeJSON.filme = dadoAtualizado
                    atualizarFilmeJSON.status = message.SUCCESS_UPDATED_ITEM.status//200
                    atualizarFilmeJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code//200
                    atualizarFilmeJSON.message = message.SUCCESS_UPDATED_ITEM.message//200                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                    return atualizarFilmeJSON
                }
                else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }
            else {
                return message.ERROR_INTERNAL_SERVER
            }
        }
    }
    else {
        return message.ERROR_CONTENT_TYPE
    }
}
//funcao para excluir um filme
const setExcluirFilme = async function (id) {
    try {
        if (id == '' || id == undefined || id == isNaN(id) || id == null) {
            return message.ERROR_INVALID//400
        }
        else {
             
            let idFilmeAtor = await filmesDAO.deleteAtorFilme(id)
            let idFilmeDiretor = await filmesDAO.deleteDiretorFilme(id)
            let idFilmeNacionalidade = await filmesDAO.deleteFilmeNacionalidade(id)
            let idFilmeGenero = await filmesDAO.deleteGeneroFilme(id)

            let idFilme= await filmesDAO.deleteFilme(id)

            if (idFilme) {
                return message.SUCCESS_DELETED_ITEM//200
            }
            else {
                return message.ERROR_NOT_FOUND//404
            }
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER//500
    }
}
//funcao para retornar todos os filmes
const getListarFilmes = async function () {
    let filmesJSON = {}

    // let cont=0
    
    // let dadosFilmeGenero=await filmesDAO.selectAllGeneroFilme()
    let dadosFilmes = await filmesDAO.selectAllFilmes()
    // while (dadosFilmes.length) {
    //     let dadosFilmeGenero=await filmesDAO.selectByIdGenero(dadosFilmes.id)
    //     dadosFilmes.genero_id= dadosFilmeGenero.id
    //     dadosFilmes.genero= dadosFilmeGenero.nome
    //     let dadosFilmeNacionalidade=await filmesDAO.selectByIdNacionalidade(dadosFilmes.id)
    //     dadosFilmes.genero_id= dadosFilmeNacionalidade.id
    //     dadosFilmes.genero= dadosFilmeNacionalidade.nome
    // }

    // let dadosFilmeNacionalidade=await filmesDAO.selectAllNacionalidadeFilme()

    // while (cont<dadosFilmeNacionalidade.length) {
    //     if (dadosFilmeNacionalidade.id_nacionalidade==dadosFilmes.id) {
    //         generoJSON.id=dadosFilmeNacionalidade.id
    //         generoJSON.nacionalidades=dadosFilmeNacionalidade.nome_pais
    //     }
    //     cont++
    // }
    // cont=0
    // while (cont<dadosFilmeGenero.length) {
    //     if (dadosFilmeGenero.id_genero==dadosFilmes.id) {
    //         nacionalidadeJSON.id=dadosFilmeGenero.id
    //         nacionalidadeJSON.generos=dadosFilmeGenero.genero
    //     }
    //     cont++
    // }

    if (dadosFilmes) {
        filmesJSON.filmes = dadosFilmes
        filmesJSON.quantidade = dadosFilmes.length
        filmesJSON.status_code = 200
        return filmesJSON
    }
    else {
        return false
    }
}
//funcao pra listar todos os filmes com o mesmos generos
const getListarFilmesByGenero=async function(idGenero) {
    let dadosFilmeGenero=await filmesDAO.selectAllFilmesGenero(idGenero)

    let filmesJSON = {}

    if (dadosFilmeGenero) {
        filmesJSON.filmes = dadosFilmeGenero
        filmesJSON.quantidade = dadosFilmeGenero.length
        filmesJSON.status_code = 200
        return filmesJSON
    }
    else {
        return false
    }
}



const getListarFilmesByNacionalidade=async function(idNacionalidade) {
    let dadosFilmeNacionalidade=await filmesDAO.selectAllFilmesNacionalidade(idNacionalidade)
    let filmesJSON = {}
    if (dadosFilmeNacionalidade) {
        filmesJSON.filmes = dadosFilmeNacionalidade

        filmesJSON.quantidade = dadosFilmeNacionalidade.length
        filmesJSON.status_code = 200
        return filmesJSON
    }
    else {
        return false
    }
}

const getNomeFilme = async function (nome) {
    let nomeFilme = nome
    let filmeJSON = {}

    if (nomeFilme == '' || nomeFilme == undefined) {
        return message.ERROR_INVALID//400
    }
    else {
        let dadosFilme = await filmesDAO.selectbyNameFilme(nomeFilme)
        if (dadosFilme) {
            if (dadosFilme.length > 0) {
                filmeJSON.filme = dadosFilme
                filmeJSON.quantidade = dadosFilme.length
                filmeJSON.status_code = 200
                return filmeJSON
            } else {
                return message.ERROR_NOT_FOUND//404
            }
        }
        else {
            return message.ERROR_INTERNAL_SERVER_DB//500
        }
    }
}
//funcao para buscar filme com seus generos
const getBuscarFilmePorIdComGenero = async function (id) {
    let idFilme = id
    let filmeJSON = {}

    if (idFilme == '' || idFilme == undefined || isNaN(idFilme)) {
        return message.ERROR_INVALID//400
    }
    else {
        let dadosFilme = await filmesDAO.selectByIdFilmeComGenero(id)
        if (dadosFilme) {
            if (dadosFilme.length > 0) {
                dadosFilme.genero = dadosFilme.genero

                filmeJSON.filme = dadosFilme
                filmeJSON.status_code = 200
                return filmeJSON
            } else {
                return message.ERROR_NOT_FOUND//404
            }
        }
        else {
            return message.ERROR_INTERNAL_SERVER_DB//500
        }
    }
}

const getBuscarFilmePorId = async function (id) {
    let idFilme = id
    let filmeJSON = {}

    if (idFilme == '' || idFilme == undefined || isNaN(idFilme)) {
        return message.ERROR_INVALID//400
    }
    else {
        let dadosFilme = await filmesDAO.selectByIdFilme(id)
        let dadosTblIntermediaria=await filmesDAO.selectFilmeGenero(id)
        let cont=0
        let generoArray=[]
        while (cont<dadosTblIntermediaria.length) {
            let idGenero=dadosTblIntermediaria[cont].id_genero
            let dadosGenero=await filmesDAO.selectByIdGenero(idGenero)
        generoArray.push(dadosGenero[0])
            cont++
        }
        if (dadosFilme && generoArray) {

            if (dadosFilme.length > 0) {
                filmeJSON.filme = dadosFilme
                filmeJSON.genero = generoArray

                filmeJSON.status_code = 200
                return filmeJSON
            } else {
                return message.ERROR_NOT_FOUND//404
            }
        }
        else {
            return message.ERROR_INTERNAL_SERVER_DB//500
        }
    }

}

const getBuscarFilme = async function (id) {
    let idFilme = id
    let filmeJSON = {}

    if (idFilme == '' || idFilme == undefined || isNaN(idFilme)) {
        return message.ERROR_INVALID//400
    }
    else {
        let dadosFilme = await filmesDAO.selectByIdFilme(id)
        if (dadosFilme) {
            if (dadosFilme.length > 0) {
                filmeJSON.filme = dadosFilme
                filmeJSON.status_code = 200
                return filmeJSON
            } else {
                return message.ERROR_NOT_FOUND//404
            }
        }
        else {
            return message.ERROR_INTERNAL_SERVER_DB//500
        }
    }
}
//******************************************************************************GENERO*******************************************************************************************/
const setInserirNovoGenero = async function (dadosGenero, contentType) {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {

            let novoGeneroJSON = {}

            if (dadosGenero.nome == '' || dadosGenero.nome == undefined || dadosGenero.nome == null || dadosGenero.nome.length > 10) {
                return message.ERROR_REQUIRED_FIELDS//400
            }
            else {
                let novoGenero = await filmesDAO.insertGenero(dadosGenero)

                if (novoGenero) {
                    let ultimoID = await filmesDAO.getIDGenero()
                    dadosGenero.id = Number(ultimoID[0].id)

                    novoGeneroJSON.genero = dadosGenero
                    novoGeneroJSON.status = message.SUCCESS_CREATED_ITEM.status//201
                    novoGeneroJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code//201
                    novoGeneroJSON.message = message.SUCCESS_CREATED_ITEM.message//201                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                    return novoGeneroJSON
                }
                else {
                    return message.ERROR_INTERNAL_SERVER_DB//500
                }
            }

        }
        else {
            return message.ERROR_CONTENT_TYPE//415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER//500
    }

}
//funcao para atualizar um Genero
const setAtualizarGenero = async function (id, dadoAtualizado, contentType) {
    if (String(contentType).toLowerCase() == 'application/json') {
        let atualizarGeneroJSON = {}
        let ultimoID = await filmesDAO.getIDGenero()
        if (id == '' || id == undefined || id == isNaN(id) || id == null) {
            return message.ERROR_INVALID//400
        }
        else if (id > ultimoID) {
            return message.ERROR_NOT_FOUND//404
        }
        else {
            if (dadoAtualizado.nome == '' || dadoAtualizado.nome == undefined || dadoAtualizado.nome == null || dadoAtualizado.nome.length > 10) {
                return message.ERROR_REQUIRED_FIELDS//400
            }
            else {
                let novoGenero = await filmesDAO.updateGenero(id, dadoAtualizado)
                if (novoGenero) {
                    atualizarGeneroJSON.genero = dadoAtualizado
                    atualizarGeneroJSON.status = message.SUCCESS_UPDATED_ITEM.status//200
                    atualizarGeneroJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code//200
                    atualizarGeneroJSON.message = message.SUCCESS_UPDATED_ITEM.message//200                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                    return atualizarGeneroJSON
                }
                else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }
        }
    }
    else {
        return message.ERROR_CONTENT_TYPE
    }
}
//funcao para excluir um Genero
const setExcluirGenero = async function (id) {
    try {
        if (id == '' || id == undefined || id == isNaN(id) || id == null) {
            return message.ERROR_INVALID//400
        }
        else {
            let idFilmeGenero = await filmesDAO.deleteFilmeGenero(id)
            let idGenero = await filmesDAO.deleteGenero(id)
            if (idGenero) {
                return message.SUCCESS_DELETED_ITEM//200
            }
            else {
                return message.ERROR_NOT_FOUND//404
            }
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER//500
    }
}
//funcao para retornar todos os Generos
const getListarGeneros = async function () {
    let generosJSON = {}

    let dadosGeneros = await filmesDAO.selectAllGeneros()

    if (dadosGeneros) {
        generosJSON.generos = dadosGeneros
        generosJSON.quantidade = dadosGeneros.length
        generosJSON.status_code = 200
        return generosJSON
    }
    else {
        return false
    }
}
const getBuscarGenero = async function (id) {
    let idGenero = id
    let generoJSON = {}

    if (idGenero == '' || idGenero == undefined || isNaN(idGenero)) {
        return message.ERROR_INVALID//400
    }
    else {
        let dadosGenero = await filmesDAO.selectByIdGenero(id)
        if (dadosGenero) {
            if (dadosGenero.length > 0) {
                generoJSON.Genero = dadosGenero
                generoJSON.status_code = 200
                return generoJSON
            } else {
                return message.ERROR_NOT_FOUND//404
            }
        }
        else {
            return message.ERROR_INTERNAL_SERVER_DB//500
        }
    }
}
//******************************************************************************CLASSIFICACAO*******************************************************************************************/
const setInserirNovaClassificacao = async function (dadosClassificacao, contentType) {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {

            let novaClassificacaoJSON = {}

            if (dadosClassificacao.classificacao == '' || dadosClassificacao.classificacao == undefined || dadosClassificacao.classificacao == null || dadosClassificacao.classificacao.length > 5||
            dadosClassificacao.classificacao_foto == '' || dadosClassificacao.classificacao_foto == undefined || dadosClassificacao.classificacao_foto == null || dadosClassificacao.classificacao_foto.length > 200) {
                return message.ERROR_REQUIRED_FIELDS//400
            }
            else {
                let novoClassificacao = await filmesDAO.insertClassificacao(dadosClassificacao)

                if (novoClassificacao) {
                    let ultimoID = await filmesDAO.getIDClassificacao()
                    dadosClassificacao.id = Number(ultimoID[0].id)

                    novaClassificacaoJSON.classificacao = dadosClassificacao
                    novaClassificacaoJSON.status = message.SUCCESS_CREATED_ITEM.status//201
                    novaClassificacaoJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code//201
                    novaClassificacaoJSON.message = message.SUCCESS_CREATED_ITEM.message//201                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                    return novaClassificacaoJSON
                }
                else {
                    return message.ERROR_INTERNAL_SERVER_DB//500
                }
            }

        }
        else {
            return message.ERROR_CONTENT_TYPE//415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER//500
    }

}
//funcao para atualizar um Classificacao
const setAtualizarClassificacao = async function (id, dadoAtualizado, contentType) {
    if (String(contentType).toLowerCase() == 'application/json') {
        let atualizarClassificacaoJSON = {}
        let ultimoID = await Number(filmesDAO.getIDClassificacao())
        if (id == '' || id == undefined || id == isNaN(id) || id == null) {
            return message.ERROR_INVALID//400
        }
        else if (id > ultimoID) {
            return message.ERROR_NOT_FOUND//404
        }
        else {
            if (dadoAtualizado.classificacao == '' || dadoAtualizado.classificacao == undefined || dadoAtualizado.classificacao == null || dadoAtualizado.classificacao.length > 5||
            dadoAtualizado.classificacao_foto == '' || dadoAtualizado.classificacao_foto == undefined || dadoAtualizado.classificacao_foto == null || dadoAtualizado.classificacao_foto.length > 200) {

                return message.ERROR_REQUIRED_FIELDS//400
            }
            else {
                let novaClassificacao = await filmesDAO.updateClassificacao(id, dadoAtualizado)
                if (novaClassificacao) {
                    atualizarClassificacaoJSON.classificacao = dadoAtualizado
                    atualizarClassificacaoJSON.status = message.SUCCESS_UPDATED_ITEM.status//200
                    atualizarClassificacaoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code//200
                    atualizarClassificacaoJSON.message = message.SUCCESS_UPDATED_ITEM.message//200                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                    return atualizarClassificacaoJSON
                }
                else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }
        }
    }
    else {
        return message.ERROR_CONTENT_TYPE
    }
}
//funcao para excluir um Classificacao
const setExcluirClassificacao = async function (id) {
    try {
        if (id == '' || id == undefined || id == isNaN(id) || id == null) {
            return message.ERROR_INVALID//400
        }
        else {
            let idClassificacao = await filmesDAO.deleteClassificacao(id)
            if (idClassificacao) {
                return message.SUCCESS_DELETED_ITEM//200
            }
            else {
                return message.ERROR_NOT_FOUND//404
            }
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER//500
    }
}
//funcao para retornar todos os Classificacoes
const getListarClassificacoes = async function () {
    let classificacoesJSON = {}

    let dadosClassificacoes = await filmesDAO.selectAllClassificacoes()

    if (dadosClassificacoes) {
        classificacoesJSON.classificacoes = dadosClassificacoes
        classificacoesJSON.quantidade = dadosClassificacoes.length
        classificacoesJSON.status_code = 200
        return classificacoesJSON
    }
    else {
        return false
    }
}
const getBuscarClassificacao = async function (id) {
    let idClassificacao = id
    let classificacaoJSON = {}

    if (idClassificacao == '' || idClassificacao == undefined || isNaN(idClassificacao)) {
        return message.ERROR_INVALID//400
    }
    else {
        let dadosClassificacao = await filmesDAO.selectByIdClassificacao(id)
        if (dadosClassificacao) {
            if (dadosClassificacao.length > 0) {
                classificacaoJSON.Classificacao = dadosClassificacao
                classificacaoJSON.status_code = 200
                return classificacaoJSON
            } else {
                return message.ERROR_NOT_FOUND//404
            }
        }
        else {
            return message.ERROR_INTERNAL_SERVER_DB//500
        }
    }
}
//******************************************************************************ATOR*******************************************************************************************/
const setInserirNovoAtor = async function (dadosAtor, contentType) {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {

            let novaAtorJSON = {}

            if (dadosAtor.nome_ator == '' || dadosAtor.nome_ator == undefined || dadosAtor.nome_ator == null || dadosAtor.nome_ator.length > 30||
            dadosAtor.foto_ator == '' || dadosAtor.foto_ator == undefined || dadosAtor.foto_ator == null || dadosAtor.foto_ator.length > 200) {
                return message.ERROR_REQUIRED_FIELDS//400
            }
            else {
                let novoAtor = await filmesDAO.insertAtor(dadosAtor)

                if (novoAtor) {
                    let ultimoID = await filmesDAO.getIDAtor()
                    dadosAtor.id = Number(ultimoID[0].id)

                    novaAtorJSON.ator = dadosAtor
                    novaAtorJSON.status = message.SUCCESS_CREATED_ITEM.status//201
                    novaAtorJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code//201
                    novaAtorJSON.message = message.SUCCESS_CREATED_ITEM.message//201                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                    return novaAtorJSON
                }
                else {
                    return message.ERROR_INTERNAL_SERVER_DB//500
                }
            }

        }
        else {
            return message.ERROR_CONTENT_TYPE//415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER//500
    }

}
//funcao para atualizar um Ator
const setAtualizarAtor = async function (id, dadoAtualizado, contentType) {
    if (String(contentType).toLowerCase() == 'application/json') {
        let atualizarAtorJSON = {}
        let dadosAtores = await filmesDAO.selectAllAtores()
        if (id == '' || id == undefined || id == isNaN(id) || id == null) {
            return message.ERROR_INVALID//400
        }
        else if (id > dadosAtores.length) {
            return message.ERROR_NOT_FOUND//404
        }
        else {
            if (dadoAtualizado.nome_ator == '' || dadoAtualizado.nome_ator == undefined || dadoAtualizado.nome_ator == null || dadoAtualizado.nome_ator.length > 5||
            dadoAtualizado.foto_ator == '' || dadoAtualizado.foto_ator == undefined || dadoAtualizado.foto_ator == null || dadoAtualizado.foto_ator.length > 200) {

                return message.ERROR_REQUIRED_FIELDS//400
            }
            else {
                let novaAtor = await filmesDAO.updateAtor(id, dadoAtualizado)
                if (novaAtor) {
                    atualizarAtorJSON.ator = dadoAtualizado
                    atualizarAtorJSON.status = message.SUCCESS_UPDATED_ITEM.status//200
                    atualizarAtorJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code//200
                    atualizarAtorJSON.message = message.SUCCESS_UPDATED_ITEM.message//200                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                    return atualizarAtorJSON
                }
                else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }
        }
    }
    else {
        return message.ERROR_CONTENT_TYPE
    }
}
//funcao para excluir um Ator
const setExcluirAtor = async function (id) {
    try {
        if (id == '' || id == undefined || id == isNaN(id) || id == null) {
            return message.ERROR_INVALID//400
        }
        else {
            let idAtor = await filmesDAO.deleteAtor(id)
            if (idAtor) {
                return message.SUCCESS_DELETED_ITEM//200
            }
            else {
                return message.ERROR_NOT_FOUND//404
            }
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER//500
    }
}
//funcao para retornar todos os Atores
const getListarAtores = async function () {
    let atoresJSON = {}

    let dadosAtores = await filmesDAO.selectAllAtores()

    if (dadosAtores) {
        atoresJSON.atores = dadosAtores
        atoresJSON.quantidade = dadosAtores.length
        atoresJSON.status_code = 200
        return atoresJSON
    }
    else {
        return false
    }
}
const getBuscarAtor = async function (id) {
    let idAtor = id
    let atorJSON = {}

    if (idAtor == '' || idAtor == undefined || isNaN(idAtor)) {
        return message.ERROR_INVALID//400
    }
    else {
        let dadosAtor = await filmesDAO.selectByIdAtor(id)
        if (dadosAtor) {
            if (dadosAtor.length > 0) {
                atorJSON.ator = dadosAtor
                atorJSON.status_code = 200
                return atorJSON
            } else {
                return message.ERROR_NOT_FOUND//404
            }
        }
        else {
            return message.ERROR_INTERNAL_SERVER_DB//500
        }
    }
}
//******************************************************************************DIRETOR*******************************************************************************************/
const setInserirNovoDiretor = async function (dadosDiretor, contentType) {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {

            let novaDiretorJSON = {}

            if (dadosDiretor.nome_diretor == '' || dadosDiretor.nome_diretor == undefined || dadosDiretor.nome_diretor == null || dadosDiretor.nome_diretor.length > 30||
            dadosDiretor.foto_diretor == '' || dadosDiretor.foto_diretor == undefined || dadosDiretor.foto_diretor == null || dadosDiretor.foto_diretor.length > 200) {
                return message.ERROR_REQUIRED_FIELDS//400
            }
            else {
                let novoDiretor = await filmesDAO.insertDiretor(dadosDiretor)

                if (novoDiretor) {
                    let ultimoID = await filmesDAO.getIDDiretor()
                    dadosDiretor.id = Number(ultimoID[0].id)

                    novaDiretorJSON.diretor = dadosDiretor
                    novaDiretorJSON.status = message.SUCCESS_CREATED_ITEM.status//201
                    novaDiretorJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code//201
                    novaDiretorJSON.message = message.SUCCESS_CREATED_ITEM.message//201                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                    return novaDiretorJSON
                }
                else {
                    return message.ERROR_INTERNAL_SERVER_DB//500
                }
            }

        }
        else {
            return message.ERROR_CONTENT_TYPE//415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER//500
    }

}
//funcao para atualizar um Diretor
const setAtualizarDiretor = async function (id, dadoAtualizado, contentType) {
    if (String(contentType).toLowerCase() == 'application/json') {
        let atualizarDiretorJSON = {}
        let dadosDiretores = await filmesDAO.selectAllDiretores()
        if (id == '' || id == undefined || id == isNaN(id) || id == null) {
            return message.ERROR_INVALID//400
        }
        else if (id > dadosDiretores.length) {
            return message.ERROR_NOT_FOUND//404
        }
        else {
            if (dadoAtualizado.nome_diretor == '' || dadoAtualizado.nome_diretor == undefined || dadoAtualizado.nome_diretor == null || dadoAtualizado.nome_diretor.length > 30||
            dadoAtualizado.foto_diretor == '' || dadoAtualizado.foto_diretor == undefined || dadoAtualizado.foto_diretor == null || dadoAtualizado.foto_diretor.length > 200) {

                return message.ERROR_REQUIRED_FIELDS//400
            }
            else {
                let novaDiretor = await filmesDAO.updateDiretor(id, dadoAtualizado)
                if (novaDiretor) {
                    atualizarDiretorJSON.diretor = dadoAtualizado
                    atualizarDiretorJSON.status = message.SUCCESS_UPDATED_ITEM.status//200
                    atualizarDiretorJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code//200
                    atualizarDiretorJSON.message = message.SUCCESS_UPDATED_ITEM.message//200                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                    return atualizarDiretorJSON
                }
                else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }
        }
    }
    else {
        return message.ERROR_CONTENT_TYPE
    }
}
//funcao para excluir um Diretor
const setExcluirDiretor = async function (id) {
    try {
        if (id == '' || id == undefined || id == isNaN(id) || id == null) {
            return message.ERROR_INVALID//400
        }
        else {
            let idDiretor = await filmesDAO.deleteDiretor(id)
            if (idDiretor) {
                return message.SUCCESS_DELETED_ITEM//200
            }
            else {
                return message.ERROR_NOT_FOUND//404
            }
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER//500
    }
}
//funcao para retornar todos os Diretores
const getListarDiretores = async function () {
    let DiretoresJSON = {}

    let dadosDiretores = await filmesDAO.selectAllDiretores()

    if (dadosDiretores) {
        DiretoresJSON.diretores = dadosDiretores
        DiretoresJSON.quantidade = dadosDiretores.length
        DiretoresJSON.status_code = 200
        return DiretoresJSON
    }
    else {
        return false
    }
}
const getBuscarDiretor = async function (id) {
    let idDiretor = id
    let diretorJSON = {}

    if (idDiretor == '' || idDiretor == undefined || isNaN(idDiretor)) {
        return message.ERROR_INVALID//400
    }
    else {
        let dadosDiretor = await filmesDAO.selectByIdDiretor(id)
        if (dadosDiretor) {
            if (dadosDiretor.length > 0) {
                diretorJSON.Diretor = dadosDiretor
                diretorJSON.status_code = 200
                return diretorJSON
            } else {
                return message.ERROR_NOT_FOUND//404
            }
        }
        else {
            return message.ERROR_INTERNAL_SERVER_DB//500
        }
    }
}
//******************************************************************************NACIONALIDADE*******************************************************************************************/
const getListarNacionalidades = async function () {
    let nacionalidadesJSON = {}

    let dadosNacionalidades = await filmesDAO.selectAllNacionalidades()

    if (dadosNacionalidades) {
        nacionalidadesJSON.nacionalidades = dadosNacionalidades
        nacionalidadesJSON.quantidade = dadosNacionalidades.length
        nacionalidadesJSON.status_code = 200
        return nacionalidadesJSON
    }
    else {
        return false
    }
}
const getBuscarNacionalidade = async function (id) {
    let idNacionalidade = id
    let nacionalidadeJSON = {}

    if (idNacionalidade == '' || idNacionalidade == undefined || isNaN(idNacionalidade)) {
        return message.ERROR_INVALID//400
    }
    else {
        let dadosNacionalidade = await filmesDAO.selectByIdNacionalidade(id)
        if (dadosNacionalidade) {
            if (dadosNacionalidade.length > 0) {
                nacionalidadeJSON.Nacionalidade = dadosNacionalidade
                nacionalidadeJSON.status_code = 200
                return nacionalidadeJSON
            } else {
                return message.ERROR_NOT_FOUND//404
            }
        }
        else {
            return message.ERROR_INTERNAL_SERVER_DB//500
        }
    }
}

module.exports = {
    setAtualizarFilme,
    setExcluirFilme,
    setInserirNovoFilme,
    getBuscarFilme,
    getNomeFilme,
    getListarFilmes,
//------------------
    setAtualizarGenero,
    setExcluirGenero,
    setInserirNovoGenero,
    getListarGeneros,
    getBuscarGenero,
//------------------
    setAtualizarClassificacao,
    setExcluirClassificacao,
    setInserirNovaClassificacao,
    getListarClassificacoes,
    getBuscarClassificacao,
//------------------
    setAtualizarAtor,
    setExcluirAtor,
    setInserirNovoAtor,
    getListarAtores,
    getBuscarAtor,
//------------------
    setAtualizarDiretor,
    setExcluirDiretor,
    setInserirNovoDiretor,
    getListarDiretores,
    getBuscarDiretor,
//------------------
    getListarNacionalidades,
    getBuscarNacionalidade,

    getListarFilmesByGenero,

    getListarFilmesByNacionalidade,
getBuscarFilmePorIdComGenero,

getBuscarFilmePorId
}