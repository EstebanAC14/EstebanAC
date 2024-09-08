const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://estebanacedu:esteban1234@esteban.dvvdt.mongodb.net/productos?retryWrites=true&w=majority&appName=esteban';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conexión a MongoDB exitosa');
    mongoose.connection.close();
}).catch(err => {
    console.error('Error al conectar a MongoDB:', err);
});
