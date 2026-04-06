var modoEdicionFactura = false;
var numeroEditando = null;

function cargarClientesFactura() {
  var select = $("#fact-cliente");
  select.empty();
  select.append('<option value="">Seleccione un cliente</option>');
  clientes.forEach(function (c) {
    select.append('<option value="' + c.cedula + '">' + c.nombre + ' (' + c.cedula + ')</option>');
  });
}

function cargarProductosFactura() {
  var select = $("#fact-producto");
  select.empty();
  select.append('<option value="">Seleccione un producto</option>');
  productos.forEach(function (p) {
    select.append('<option value="' + p.codigo + '">' + p.nombre + ' - $' + p.precio + '</option>');
  });
}

function calcularTotal() {
  var productoCodigo = $("#fact-producto").val();
  var cantidad = parseInt($("#fact-cantidad").val()) || 0;

  if (productoCodigo && cantidad > 0) {
    var producto = productos.find(function (p) { return p.codigo === productoCodigo; });
    if (producto) {
      var total = producto.precio * cantidad;
      $("#fact-total").val(total.toFixed(2));
    }
  } else {
    $("#fact-total").val("");
  }
}

function renderFacturas() {
  var tbody = $("#tabla-facturas tbody");
  tbody.empty();

  if (facturas.length === 0) {
    tbody.append('<tr><td colspan="5" class="text-center text-muted">No hay facturas emitidas.</td></tr>');
    return;
  }

  facturas.forEach(function (f) {
    var clienteNombre = clientes.find(c => c.cedula === f.cliente)?.nombre || 'Desconocido';
    var fila = '<tr>' +
      '<td>' + f.numero + '</td>' +
      '<td>' + clienteNombre + '</td>' +
      '<td>$' + f.total.toFixed(2) + '</td>' +
      '<td>' + f.fecha + '</td>' +
      '<td>' +
        '<button class="btn btn-warning btn-accion me-1" onclick="editarFactura(\'' + f.numero + '\')">' +
          '<i class="bi bi-pencil"></i> Editar' +
        '</button>' +
        '<button class="btn btn-danger btn-accion" onclick="eliminarFactura(\'' + f.numero + '\')">' +
          '<i class="bi bi-trash"></i> Eliminar' +
        '</button>' +
      '</td>' +
    '</tr>';
    tbody.append(fila);
  });
}

/**
 * Valida y guarda (agrega o actualiza) una factura en el array.
 */
function guardarFactura() {
  var clienteCedula = $("#fact-cliente").val();
  var productoCodigo = $("#fact-producto").val();
  var cantidad = parseInt($("#fact-cantidad").val());

  // Limpiar mensajes
  $("#msg-facturas").html("");

  // Validar campos
  if (!clienteCedula || !productoCodigo || !cantidad || cantidad <= 0) {
    $("#msg-facturas").html('<div class="alert alert-danger">Todos los campos son obligatorios y la cantidad debe ser mayor a 0.</div>');
    return;
  }

  var cliente = clientes.find(function (c) { return c.cedula === clienteCedula; });
  var producto = productos.find(function (p) { return p.codigo === productoCodigo; });

  if (!cliente || !producto) {
    $("#msg-facturas").html('<div class="alert alert-danger">Cliente o producto no encontrado.</div>');
    return;
  }

  var total = producto.precio * cantidad;

  if (!modoEdicionFactura) {
    // Nueva factura
    var numeroFactura = generarNumeroFactura();
    var factura = {
      numero: numeroFactura,
      cliente: clienteCedula,
      productos: [{ codigo: productoCodigo, nombre: producto.nombre, precio: producto.precio, cantidad: cantidad }],
      total: total,
      fecha: new Date().toISOString().split('T')[0]
    };
    facturas.push(factura);
  } else {
    // Actualizar factura existente
    var idx = facturas.findIndex(function (f) { return f.numero === numeroEditando; });
    if (idx !== -1) {
      facturas[idx].cliente = clienteCedula;
      facturas[idx].productos = [{ codigo: productoCodigo, nombre: producto.nombre, precio: producto.precio, cantidad: cantidad }];
      facturas[idx].total = total;
    }
  }

  guardarDatos();
  renderFacturas();
  limpiarFormFactura();
  $("#msg-facturas").html('<div class="alert alert-success">Factura guardada correctamente.</div>');
}

/**
 * Carga los datos de la factura en el formulario para edición.
 * @param {string} numero
 */
function editarFactura(numero) {
  var factura = facturas.find(function (f) { return f.numero === numero; });
  if (!factura || factura.productos.length === 0) return;

  var prod = factura.productos[0]; // Asumiendo un producto
  $("#fact-cliente").val(factura.cliente);
  $("#fact-producto").val(prod.codigo);
  $("#fact-cantidad").val(prod.cantidad);
  $("#fact-total").val(factura.total.toFixed(2));
  $("#msg-facturas").html("");

  modoEdicionFactura = true;
  numeroEditando = numero;
}

/**
 * Solicita confirmación y elimina la factura del array.
 * @param {string} numero
 */
function eliminarFactura(numero) {
  if (!confirm("¿Desea eliminar la factura " + numero + "?")) return;

  var idx = facturas.findIndex(function (f) { return f.numero === numero; });
  if (idx !== -1) {
    facturas.splice(idx, 1);
  }

  guardarDatos();
  renderFacturas();
}

/**
 * Limpia el formulario y resetea el estado de edición.
 */
function limpiarFormFactura() {
  $("#fact-cliente").val("");
  $("#fact-producto").val("");
  $("#fact-cantidad").val("");
  $("#fact-total").val("");
  $("#msg-facturas").html("");
  modoEdicionFactura = false;
  numeroEditando = null;
}

// Inicializar tabla al cargar la página
$(document).ready(function () {
  cargarClientesFactura();
  cargarProductosFactura();
  renderFacturas();

  $("#fact-producto, #fact-cantidad").on("change input", calcularTotal);
});