const { sql, config } = require('../config/db');


// 🔹 Agregar nuevo producto
exports.insertarProducto = async (req, res) => {
  const {
    NombreProducto, Descripcion, Precio, Cantidad,
    FechaFabricacion, IdMarca, Categoria
  } = req.body;
  const imagen = req.file?.buffer || null;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('NombreProducto', sql.VarChar, NombreProducto)
      .input('Descripcion', sql.VarChar, Descripcion)
      .input('Precio', sql.Decimal(10, 2), Precio)
      .input('Cantidad', sql.Int, Cantidad)
      .input('FechaFabricacion', sql.Date, FechaFabricacion || null)
      .input('IdMarca', sql.Int, IdMarca)
      .input('Categoria', sql.VarChar, Categoria)
      .input('Imagen', sql.VarBinary, imagen)
      .execute('sp_InsertarProducto');

    res.status(201).send('✅ Producto agregado correctamente.');
  } catch (err) {
    console.error('❌ Error al insertar producto:', err);
    res.status(500).send(err.message);
  }
};
// 🔹 Agregar inventario (cantidad extra a un producto existente)
exports.agregarInventarioProducto = async (req, res) => {
  const { IdProducto, CantidadAgregada } = req.body;

  if (!IdProducto || !CantidadAgregada || CantidadAgregada <= 0) {
    return res.status(400).send('❌ Debes proporcionar un producto y una cantidad válida.');
  }

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('IdProducto', sql.Int, IdProducto)
      .input('CantidadAgregada', sql.Int, CantidadAgregada)
      .execute('sp_AgregarInventarioProducto');

    res.send('✅ Inventario actualizado correctamente.');
  } catch (err) {
    console.error('❌ Error al agregar inventario:', err);
    res.status(500).send(err.message);
  }
};

// 🔹 Actualizar producto
exports.actualizarProducto = async (req, res) => {
  const {
    IdProducto, NombreProducto, Descripcion, Precio,
    FechaFabricacion, IdMarca, Categoria
  } = req.body;
  const imagen = req.file?.buffer || null;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('IdProducto', sql.Int, IdProducto)
      .input('NombreProducto', sql.VarChar, NombreProducto)
      .input('Descripcion', sql.VarChar, Descripcion)
      .input('Precio', sql.Decimal(10, 2), Precio)
      .input('FechaFabricacion', sql.Date, FechaFabricacion)
      .input('IdMarca', sql.Int, IdMarca)
      .input('Categoria', sql.VarChar, Categoria)
      .input('Imagen', sql.VarBinary, imagen)
      .execute('sp_ActualizarProducto');

    res.send('✅ Producto actualizado correctamente.');
  } catch (err) {
    console.error('❌ Error al actualizar producto:', err);
    res.status(500).send(err.message);
  }
};

// 🔹 Cambiar estado (activar/inactivar)
exports.cambiarEstadoProducto = async (req, res) => {
  const { IdProducto, NuevoEstado } = req.body;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('IdProducto', sql.Int, IdProducto)
      .input('NuevoEstado', sql.Bit, NuevoEstado)
      .execute('sp_CambiarEstadoProducto');

    res.send('✅ Estado del producto actualizado.');
  } catch (err) {
    console.error('❌ Error al cambiar estado:', err);
    res.status(500).send(err.message);
  }
};

// 🔹 Buscar productos por texto
exports.buscarProductos = async (req, res) => {
  const { texto } = req.query;

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('TextoBusqueda', sql.VarChar, texto)
      .execute('sp_BuscarProductos');

    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error al buscar productos:', err);
    res.status(500).send(err.message);
  }
};


exports.listarProductosActivos = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('sp_ListarProductosActivos');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error al listar productos activos:', err);
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Listar productos por estado
exports.listarProductos = async (req, res) => {
  const estado = req.query.estado; // 1, 0 o vacío

  try {
    const pool = await sql.connect(config);
    let result;
    if (estado === '0') {
      result = await pool.request().execute('sp_ListarProductosInactivos');
    } else {
      result = await pool.request().execute('sp_ListarProductosActivos');
    }

    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error al listar productos:', err);
    res.status(500).send(err.message);
  }
};

// 🔹 Filtrar por categoría
exports.filtrarPorCategoria = async (req, res) => {
  const { categoria } = req.query;

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('Categoria', sql.VarChar, categoria)
      .execute('sp_FiltrarProductosPorCategoria');

    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error al filtrar por categoría:', err);
    res.status(500).send(err.message);
  }
};


const path = require('path');

exports.obtenerImagenProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('IdProducto', sql.Int, id)
      .query('SELECT Imagen FROM Productos WHERE IdProducto = @IdProducto');

    const producto = result.recordset[0];

    if (!producto || !producto.Imagen) {
      // Si no hay imagen, respondemos con una imagen por defecto en base64
      const fs = require('fs');
      const defaultPath = path.join(__dirname, '../public/images/default.png');
      const imageBuffer = fs.readFileSync(defaultPath);
      const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;
      return res.send(base64Image);
    }

    const base64Image = `data:image/png;base64,${producto.Imagen.toString('base64')}`;
    res.send(base64Image);
  } catch (err) {
    console.error('❌ Error al obtener imagen:', err);
    res.status(500).send('Error al obtener imagen.');
  }
};


exports.obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('IdProducto', sql.Int, id)
      .execute('sp_ObtenerProductoPorId');

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('❌ Error al obtener producto:', err);
    res.status(500).send(err.message);
  }
};
