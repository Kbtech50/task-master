const { required, string } = require('joi');
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title:{type: String, trim: true, required: true},
    description: { type: String, trim: true, required: true },
    deadline: {type: Date, default: new Date()},
    priority: {type: String, required: true},
    completed: { type: Boolean, default: false },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
});





const Task = mongoose.model('task', taskSchema);
module.exports = Task;