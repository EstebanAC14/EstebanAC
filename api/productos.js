const mongoose = require('mongoose');
const Producto = require('../models/producto');  // Asegúrate de que el modelo está correctamente importado
const MONGO_URI = process.env.MONGO_URI;

// Conectar a MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => console.error('Error al conectar a MongoDB:', err));

// Exportar la función manejadora de la API
module.exports = async (req, res) => {
    const { method } = req;

    if (method === 'GET') {
        // Obtener todos los productos
        try {
            const productos = await Producto.find();
            return res.status(200).json(productos);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            return res.status(500).json({ message: 'Error al obtener los productos' });
        }
    }

    if (method === 'POST') {
        // Crear un nuevo producto
        const { nombre, descripcion, precio, stock } = req.body;

        if (!nombre || !descripcion || !precio || !stock) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        try {
            const producto = new Producto({ nombre, descripcion, precio, stock });
            await producto.save();
            return res.status(201).json(producto);
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            return res.status(500).json({ message: 'Error al agregar el producto' });
        }
    }

    if (method === 'PUT') {
        // Modificar un producto
        const { id } = req.query;  // Recibir el ID desde la query string
        const { nombre, descripcion, precio, stock } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'ID del producto es requerido' });
        }

        try {
            const producto = await Producto.findByIdAndUpdate(id, { nombre, descripcion, precio, stock }, { new: true });
            if (!producto) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            return res.status(200).json(producto);
        } catch (error) {
            console.error('Error al modificar el producto:', error);
            return res.status(500).json({ message: 'Error al modificar el producto' });
        }
    }

    if (method === 'DELETE') {
        // Eliminar un producto
        const { id } = req.query;  // Recibir el ID desde la query string

        if (!id) {
            return res.status(400).json({ message: 'ID del producto es requerido' });
        }

        try {
            const producto = await Producto.findByIdAndDelete(id);
            if (!producto) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            return res.status(200).json({ message: 'Producto eliminado' });
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            return res.status(500).json({ message: 'Error al eliminar el producto' });
        }
    }

    // Si el método no es uno de los anteriores, devolver error
    return res.status(405).json({ message: 'Método no permitido' });
};
