// npm i jsonwebtoken

const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Boom = require('boom')
const Jwt = require('jsonwebtoken')
const PasswordHelper = require('./../helpers/passwordHelper')

const failAction = (request, headers, error) => { throw error; }

const USER = {
    username: 'Xuxinha',
    password: '123'
}

class AuthRoutes extends BaseRoute {
    constructor(secret, db) {
        super(),
        this.secret = secret
        this.db = db
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obter token',
                notes: 'realiza login com user e senha do banco',
                validate: {
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                const { username, password } = request.payload
                const [usuario] = await this.db.read({
                    username: username.toLowerCase()
                })
                if(!usuario) { return Boom.unauthorized('O usuario informado não existe') }
                const match = await PasswordHelper.comparePassword(password, usuario.password)
                
                if(!match) { return Boom.unauthorized('Usuario ou senha invalidos') }
                // if(username !== USER.username || password !== USER.password)
                //     return Boom.unauthorized()
                
                const token = Jwt.sign({
                    username: username,
                    id: usuario.id
                }, this.secret)
                return {
                    token
                }
            }
        }
    }
}

module.exports = AuthRoutes