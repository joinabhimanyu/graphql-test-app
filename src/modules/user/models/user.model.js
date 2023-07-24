const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const modelName='User';
const postSchema = new Schema({
    userid: {type: String, required: true},
    email: {type: String, required: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    address: {type: String, required: true},
    password: {type: String, required: true},
    organization: String,
    roles: [{context: String, scope: String, by: mongoose.Schema.Types.ObjectId}]
}, {
    timestamps: true
});
if (mongoose.modelNames().includes(modelName)) {
    mongoose.deleteModel(modelName);
  }
const Model = model(modelName, postSchema);
module.exports = Model;