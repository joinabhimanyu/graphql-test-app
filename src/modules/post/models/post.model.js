const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const modelName='Post';
const postSchema = new Schema({
    title: String,
    author: String,
    body: String,
    comments: [{ body: String, by: mongoose.Schema.Types.ObjectId }],
    postedBy: {type: Schema.Types.ObjectId, ref:'Contact'},
    hidden: Boolean,
    meta: {
        votes: Number,
        favs: Number
    }
}, {
    timestamps: true
});
if (mongoose.modelNames().includes(modelName)) {
    mongoose.deleteModel(modelName);
  }
const Model = model(modelName, postSchema);
module.exports = Model;