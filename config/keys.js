if(process.env.NODE_ENV === 'production'){
    module.exports = require('./keys_prod')
    console.log("production")
} else {
    module.exports = require('./keys_dev')
    console.log("dev")
}