const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
    nombre: String,
    apellido_paterno: String,
    apellido_materno: String,
    direccion: String,
    telefono: Number,
    ife: String,
    foto: String,
    sucursal_id: String,
    user_id: String,
    udn_id: String,
    deleted: {type: Boolean, default: false}
});

module.exports = mongoose.model('Person', PersonSchema);