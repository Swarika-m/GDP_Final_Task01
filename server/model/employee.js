
const mongosse = require("mongoose");

const employeeSchema = new mongoose.schema({
    name : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
    },
    contact : {
        type: Number
    }
})

module.exports = mongoose.model("Employee", employeeSchema)
