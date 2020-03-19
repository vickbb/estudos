const ICrud = require('./interfaces/interfaceCrud')
const Sequelize = require('sequelize')

class Postgres extends ICrud {
    constructor() {
        super()
        this._driver = null
        this._herois = null
    }

    async create(item) {
        const{
            dataValues
        } = await this._herois.create(item)
        
        return dataValues
    }

    async read(item = {}) {
        return this._herois.findAll({ where: item, raw: true })
    }

    async update(id, item) {
        return this._herois.update(item, { where: {id: id} })
    }

    async delete(id) {
        const query = id ? { id } : {}
        return this._herois.destroy({where: query})
    }
    async isConnected() {
        try {
            await this._driver.authenticate()
            return true
        } catch (error) {
            console.error('Falha ao conectar no Postgres: ', error)
            return false
        }
    }
    
    async defineModel() {
        this._herois = this._driver.define('herois', {
            id: {
                type: Sequelize.INTEGER,
                required: true,
                primaryKey: true,
                autoIncrement: true
            },
            nome: {
                type: Sequelize.STRING,
                required: true
            },
            poder: {
                type: Sequelize.STRING,
                required: true
            }
        }, {
            tableName: 'tb_herois',
            freezeTableName: false,
            timestamps: false
        })
        await this._herois.sync()
    }

    async connect(item) {
        this._driver = new Sequelize(
            'heroes',
            'victorbarreiros',
            'root',
            {
                host: 'localhost',
                dialect: 'postgres',
                quoteIdentidiers: false,
                operatorsAliases: false
            }
        )
        await this.defineModel()
    }
}

module.exports = Postgres