const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
    nombre: String,
    apellido_paterno: String,
    apellido_materno: String,
    direccion: String,
    telefono: Number,
    foto: String,
    sucursal_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    udn_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subsidiary' },
    deleted: {type: Boolean, default: false}
});

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    is_active:  {type: Boolean, default: true}
});

const AgencySchema = new mongoose.Schema({
    agencia: String,
    centro: String,
    direccion: String,
    telefono: String,
    zona: String,
    deleted: {type: Boolean, default: false}
});

const SubsidiarySchema = new mongoose.Schema({
    nombre: String,
    direccion: String,
    telefono: String,
    responsable: String,
    deleted: {type: Boolean, default: false}
});

const User = mongoose.model('User', UserSchema);
const Subsidiary = mongoose.model('Subsidiary', SubsidiarySchema);
const Agency = mongoose.model('Agency',AgencySchema);
module.exports = mongoose.model('Person', PersonSchema);