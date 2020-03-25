const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Boom = require('boom')

const failAction = (request, headers, error) => { throw error; }

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super(),
        this.db = db
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'lista herois cadastrados na base de dados',
                notes: 'resultados são paginados por padrão e é possivel filtrar por nome',
                validate: {
                    // payload
                    // header
                    // params
                    // query
                    failAction,
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    }
                }
            },
            handler: (request, headers) => {
                try {
                    const {
                        skip,
                        limit,
                        nome
                    } = request.query
                    const query = nome ? {nome: {$regex: `.*${nome}*.`}} : {}

                    return this.db.read(query, skip, limit)
                } catch (error) {
                    console.error('Não foi possivel passar parametros na request', error)
                    return Boom.internal()
                }
            }
        }
    }

    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'Cadastrar herois',
                notes: 'Deve cadastrar herois',
                validate: {
                    failAction,
                    payload: {
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(3).max(100)
                    }
                }
            },
            handler: async (request) => {
                try {
                    const {nome, poder} = request.payload
                    const result = await this.db.create({nome, poder})
                    return {
                        message: 'Heroi cadastrado com sucesso!',
                        _id: result._id
                    }
                } catch (error) {
                    console.error('Erro ao cadastrar', error)
                    return Boom.internal()
                }
            }
        }
    }

    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'Atualiza herois cadastrados na base de dados',
                notes: 'Atualiza todos os campos do heroi',
                validate: {
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(3).max(100)
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params
                    const { payload } = request

                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)
                    const result = await this.db.update(id, dados)
                    
                    if(result.nModified !== 1) 
                        return Boom.preconditionFailed('Não encontrado no banco')

                    return {
                        message: 'Heroi atualizado com sucesso!'
                    }

                } catch (error) {
                    console.error('Não foi possivel atualizar o heroi', error)
                    return Boom.internal()
                }
            }
        }
    }

    delete() {
        return {
            path: '/herois/{id}',
            method: 'DELETE',
            config: {
                tags: ['api'],
                description: 'Remove herois da base',
                notes: 'Remove heroi caso o id for encontrado',
                validate: {
                    failAction,
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params
                    const resultado = await this.db.delete(id)
                    if(resultado.n !== 1) return Boom.preconditionFailed('Não encontrado no banco')

                    return { message: 'Heroi removido com sucesso' }
                } catch (error) {
                    console.error('Erro ao deletar o heroi')
                    return Boom.internal()
                }
            }
        }
    }
}

module.exports = HeroRoutes