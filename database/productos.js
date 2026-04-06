var modoEdicionProducto = false;
var codigoEditando = null;

function renderProductos() {
  var tbody = $("#tabla-productos tbody");
  tbody.empty();

  if (productos.length === 0) {
    tbody.append('<tr><td colspan="4" class="text-center text-muted">No hay productos registrados.</td></tr>');
    return;
  }

  productos.forEach(function (p) {
    var fila = '<tr>' +
      '<td>' + p.codigo + '</td>' +
      '<td>' + p.nombre + '</td>' +
      '<td>' + p.precio + '</td>' +
      '<td>' +
        '<button class="btn btn-warning btn-accion me-1" onclick="editarProducto(\'' + p.codigo + '\')">' +
          '<i class="bi bi-pencil"></i> Editar' +
        '</button>' +
        '<button class="btn btn-danger btn-accion" onclick="eliminarProducto(\'' + p.codigo + '\')">' +
          '<i class="bi bi-trash"></i> Eliminar' +
        '</button>' +
      '</td>' +
    '</tr>';
    tbody.append(fila);
  });
}

/**
 * Valida y guarda (agrega o actualiza) un producto en el array.
 */
function guardarProducto() {
  var codigo = $("#prod-codigo").val().trim();
  var nombre = $("#prod-nombre").val().trim();
  var precio = $("#prod-precio").val().trim();

  // Limpiar mensajes
  $("#msg-productos").html("");

  // Validar campos
  if (codigo === "" || nombre === "" || precio === "") {
    $("#msg-productos").html('<div class="alert alert-danger">Los campos código, nombre y precio son obligatorios.</div>');
    return;
  }

  // Validar precio numérico
  if (isNaN(precio) || parseFloat(precio) <= 0) {
    $("#msg-productos").html('<div class="alert alert-danger">El precio debe ser un número positivo.</div>');
    return;
  }

  if (!modoEdicionProducto) {
    // Verificar código duplicado
    var existe = productos.some(function (p) { return p.codigo === codigo; });
    if (existe) {
      $("#msg-productos").html('<div class="alert alert-danger">El código ya está registrado.</div>');
      return;
    }
    productos.push({ codigo: codigo, nombre: nombre, precio: parseFloat(precio) });
  } else {
    // Actualizar registro existente
    var idx = productos.findIndex(function (p) { return p.codigo === codigoEditando; });
    if (idx !== -1) {
      productos[idx].codigo = codigo;
      productos[idx].nombre = nombre;
      productos[idx].precio = parseFloat(precio);
    }
  }

  guardarDatos();
  renderProductos();
  limpiarFormProducto();
  $("#msg-productos").html('<div class="alert alert-success">Producto guardado correctamente.</div>');
}

/**
 * Carga los datos del producto en el formulario para edición.
 * @param {string} codigo
 */
function editarProducto(codigo) {
  var producto = productos.find(function (p) { return p.codigo === codigo; });
  if (!producto) return;

  $("#prod-codigo").val(producto.codigo);
  $("#prod-nombre").val(producto.nombre);
  $("#prod-precio").val(producto.precio);
  $("#msg-productos").html("");

  modoEdicionProducto = true;
  codigoEditando = codigo;
}

/**
 * Solicita confirmación y elimina el producto del array.
 * @param {string} codigo
 */
function eliminarProducto(codigo) {
  if (!confirm("¿Desea eliminar el producto con código " + codigo + "?")) return;

  var idx = productos.findIndex(function (p) { return p.codigo === codigo; });
  if (idx !== -1) {
    productos.splice(idx, 1);
  }

  guardarDatos();
  renderProductos();
}

/**
 * Limpia el formulario y resetea el estado de edición.
 */
function limpiarFormProducto() {
  $("#prod-codigo").val("");
  $("#prod-nombre").val("");
  $("#prod-precio").val("");
  $("#msg-productos").html("");
  modoEdicionProducto = false;
  codigoEditando = null;
}

// Inicializar tabla al cargar la página
$(document).ready(function () {
  renderProductos();
});