/************************************************************************************************
 * Objetivo:arquivo responsavel pela padronizacao de variaveis e constantes gloais do projeto
 * Data:22/02/24
 * Autor:Letícia Melo
 * Versão:1.0
 ************************************************************************************************/
/**************************************MENSAGENS DE ERRO*****************************************/
const ERROR_INVALID = { status: false, status_code: 400, message: 'O dado encaminhado na requisição, não é válido :(' }
const ERROR_REQUIRED_FIELDS = { status: false, status_code: 400, message: 'Existem campos requeridos que não foram preenchidos, ou, não atendem aos critérios de digitação :(' }
const ERROR_NOT_FOUND = { status: false, status_code: 404, message: 'Não foi encontrado nenhum item :(' }
const ERROR_INTERNAL_SERVER_DB = { status: false, status_code: 500, message: 'Não foi possivel procesar a requisicao devio a um erro no acesso ao Banco de Dados, contate o administrador da API :(' }
const ERROR_CONTENT_TYPE= { status: false, status_code: 415, message: 'O content_type da requisicao não é suportado pelo servidor. Deve-se encaminhar apenas requisições com application/json :(' }
const ERROR_INTERNAL_SERVER = { status: false, status_code: 500, message: 'Não foi possivel procesar a requisicao devio a um erro na camada de controle da aplicacao, contate o administrador da API :(' }

/************************************MENSAGENS DE SUCESSO***************************************/
const SUCCESS_CREATED_ITEM = { status: true, status_code: 201, message: 'Item criado com sucesso :)' }
const SUCCESS_DELETED_ITEM = { status: true, status_code: 200, message: 'Item deletado com sucesso :)' }
const SUCCESS_UPDATED_ITEM = { status: true, status_code: 200, message: 'Item atualizado com sucesso :)' }



module.exports = {
    ERROR_INVALID,
    ERROR_REQUIRED_FIELDS,
    ERROR_NOT_FOUND,
    ERROR_INTERNAL_SERVER_DB,
    ERROR_INTERNAL_SERVER,
    ERROR_CONTENT_TYPE,

    SUCCESS_CREATED_ITEM,
    SUCCESS_DELETED_ITEM,
    SUCCESS_UPDATED_ITEM
}