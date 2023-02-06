const mongoose = require('mongoose')

module.exports.dbConnection=(cb)=>{
    mongoose.connect(process.env.DATABASE_URL)
    const db = mongoose.connection
    db.on('error', error => {
        cb(false)
        console.error(error)})
    db.once('open', () =>{
        cb(true)
        console.log('Connected to mongoose')})
}



