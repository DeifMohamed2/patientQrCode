const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileURL: { type: String },
    files: [{
        title : { type: String, required: true },
        description: { type: String },
        type: { type: String, enum: ['photo', 'pdf', 'document'], required: true },
        url: { type: String, required: true }
    }],
});

module.exports = mongoose.model('Patient', patientSchema);
