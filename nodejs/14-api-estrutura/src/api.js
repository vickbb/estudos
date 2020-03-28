// npm i hapi
// npm i vision inert hapi-swagger@9.1.3
// npm i hapi-auth-jwt2
// npm i bcrypt

// Project dependencies
const Context = require('./db/stratagies/base/contextStrategy')
const MongoDb = require('./db/stratagies/mongodb/mongodb')
const HeroiSchema = require('./db/stratagies/mongodb/schemas/heroisSchema')
const Postgres = require('./db/stratagies/postgres/postgres')
const UsuarioSchema = require('./db/stratagies/postgres/schemas/usuarioSchema')
const HeroRoute = require('./routes/heroRoutes')
const AuthRoute = require('./routes/authRoutes')
// External dependencies
const Hapi = require('hapi')
const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')
const HapiJwt = require('hapi-auth-jwt2')

const JWT_SECRET = 'rjkgnbquigbqbviujqrigbhqewbgqrbihgufiueqwhbfrjqhwbefkçjnewlkvewjrhr8493br78343674t12rhh3vf'

const app = new Hapi.Server({
    port: 5000
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, HeroiSchema))

    const connectionPostgres = await Postgres.connect()
    const model = await Postgres.defineModel(connectionPostgres, UsuarioSchema)
    const contextPostgres = new Context(new Postgres(connectionPostgres, model))

    const swaggerOptions = {
        info: {
            title: 'API Herois',
            version: 'v1.0'
        },
        lang: 'pt'
    }

    await app.register([
        HapiJwt,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])
    
    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 20
        // },
        validate: async (data, request) => {
            const [result] = await contextPostgres.read({
                username: data.username.toLowerCase()
            })
            
            if(!result) { return { isValid: false } }

            return { isValid: true }
        }
    })
    
    app.auth.default('jwt')

    app.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
        ...mapRoutes(new AuthRoute(JWT_SECRET, contextPostgres), AuthRoute.methods())
    ])

    await app.start()
    console.log(`Servidor online
    Caminho: ${app.info.uri}
    Endereço:${app.info.address}
    Porta: ${app.info.port}
    `)

    return app
}

module.exports = main()