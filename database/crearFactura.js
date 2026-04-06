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

/**
 * Valida y guarda la factura.
 */
function guardarFactura() {
  var clienteCedula = $("#fact-cliente").val();
  var productoCodigo = $("#fact-producto").val();
  var cantidad = parseInt($("#fact-cantidad").val());

  // Limpiar mensajes
  $("#msg-factura").html("");

  // Validar campos
  if (!clienteCedula || !productoCodigo || !cantidad || cantidad <= 0) {
    $("#msg-factura").html('<div class="alert alert-danger">Todos los campos son obligatorios y la cantidad debe ser mayor a 0.</div>');
    return;
  }

  var cliente = clientes.find(function (c) { return c.cedula === clienteCedula; });
  var producto = productos.find(function (p) { return p.codigo === productoCodigo; });

  if (!cliente || !producto) {
    $("#msg-factura").html('<div class="alert alert-danger">Cliente o producto no encontrado.</div>');
    return;
  }

  var numeroFactura = generarNumeroFactura();
  var total = producto.precio * cantidad;

  var factura = {
    numero: numeroFactura,
    cliente: clienteCedula,
    productos: [{ codigo: productoCodigo, nombre: producto.nombre, precio: producto.precio, cantidad: cantidad }],
    total: total,
    fecha: new Date().toISOString().split('T')[0] // YYYY-MM-DD
  };

  facturas.push(factura);
  guardarDatos();

  $("#msg-factura").html('<div class="alert alert-success">Factura ' + numeroFactura + ' emitida correctamente.</div>');
  limpiarFormFactura();
}

/**
 * Limpia el formulario.
 */
function limpiarFormFactura() {
  $("#fact-cliente").val("");
  $("#fact-producto").val("");
  $("#fact-cantidad").val("");
  $("#fact-total").val("");
}

// Inicializar al cargar la página
$(document).ready(function () {
  cargarClientesFactura();
  cargarProductosFactura();

  $("#fact-producto, #fact-cantidad").on("change input", calcularTotal);
});