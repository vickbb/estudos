// npm install sequelize
// npm install pg-hstore pg
const Sequelize = require('sequelize')
const driver = new Sequelize(
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

async function main() {
    const Herois = driver.define('herois', {
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
    await Herois.sync()
    // await Herois.create({
    //     nome: 'Mulher Maravilha',
    //     poder: 'Laço da verdade'
    // })
    const result = await Herois.findAll({ raw: true, attributes: ['nome'] })
    console.log('REsult', result)
}

main()