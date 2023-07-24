const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const modelName='Contact';
const contactSchema = new Schema({
    contact_name: String,
    contact_address: String,
    contact_email: String,
    contact_phno: String,
    contact_organization: String
}, {
    timestamps: true
});
if (mongoose.modelNames().includes(modelName)) {
    mongoose.deleteModel(modelName);
  }
const Model = model(modelName, contactSchema);
module.exports = Model;