const mongoose = require('mongoose')

var uniqueValidator = require('mongoose-unique-validator')



const url = process.env.MONGODB_URI

console.log('connected to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => { console.log('connected to MongoDB') })
    .catch((error) => { console.log('error connecting to MongoDB', error.message) })

/*const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number,
})*/

const personSchema = mongoose.Schema({
    name: { type: String, minlength: 3, required: true, unique: true },
    number: { type: String, minlength: 8, required: true, unique: true },
    id: { type: Number }
}
)
personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


const Person = mongoose.model('Person', personSchema)

module.exports = Person