

var modoEdicion   = false;
var cedulaEditando = null;


function renderClientes() {
  var tbody = $("#tabla-clientes tbody");
  tbody.empty();

  if (clientes.length === 0) {
    tbody.append('<tr><td colspan="3" class="text-center text-muted">No hay clientes registrados.</td></tr>');
    return;
  }

  clientes.forEach(function (c) {
    var fila = '<tr>' +
      '<td>' + c.cedula + '</td>' +
      '<td>' + c.nombre + '</td>' +
      '<td>' +
        '<button class="btn btn-warning btn-accion me-1" onclick="editarCliente(\'' + c.cedula + '\')">' +
          '<i class="bi bi-pencil"></i> Editar' +
        '</button>' +
        '<button class="btn btn-danger btn-accion" onclick="eliminarCliente(\'' + c.cedula + '\')">' +
          '<i class="bi bi-trash"></i> Eliminar' +
        '</button>' +
      '</td>' +
    '</tr>';
    tbody.append(fila);
  });
}

/**
 * Valida y guarda (agrega o actualiza) un cliente en el array.
 */
function guardarCliente() {
  var cedula = $("#cli-cedula").val().trim();
  var nombre = $("#cli-nombre").val().trim();

  // Limpiar mensajes 
  $("#msg-clientes").html("");

  // Validar campos 
  if (cedula === "" || nombre === "") {
    $("#msg-clientes").html('<div class="alert alert-danger">El campo cédula y el campo nombre son obligatorios.</div>');
    return;
  }

  if (!modoEdicion) {
    // Verificar cédula duplicada 
    var existe = clientes.some(function (c) { return c.cedula === cedula; });
    if (existe) {
      $("#msg-clientes").html('<div class="alert alert-danger">La cédula ya está registrada.</div>');
      return;
    }
    clientes.push({ cedula: cedula, nombre: nombre });
  } else {
    // Actualizar registro existente
    var idx = clientes.findIndex(function (c) { return c.cedula === cedulaEditando; });
    if (idx !== -1) {
      clientes[idx].cedula = cedula;
      clientes[idx].nombre = nombre;
    }
  }

  guardarDatos();
  renderClientes();
  limpiarFormCliente();
  $("#msg-clientes").html('<div class="alert alert-success">Cliente guardado correctamente.</div>');
}

/**
 * Carga los datos del cliente en el formulario para edición.
 * @param {string} cedula
 */
function editarCliente(cedula) {
  var cliente = clientes.find(function (c) { return c.cedula === cedula; });
  if (!cliente) return;

  $("#cli-cedula").val(cliente.cedula);
  $("#cli-nombre").val(cliente.nombre);
  $("#msg-clientes").html("");

  modoEdicion    = true;
  cedulaEditando = cedula;
}

/**
 * Solicita confirmación y elimina el cliente del array.
 * @param {string} cedula
 */
function eliminarCliente(cedula) {
  if (!confirm("¿Desea eliminar el cliente con cédula " + cedula + "?")) return;

  var idx = clientes.findIndex(function (c) { return c.cedula === cedula; });
  if (idx !== -1) {
    clientes.splice(idx, 1);
  }

  guardarDatos();
  renderClientes();
}

/**
 * Limpia el formulario y resetea el estado de edición.
 */
function limpiarFormCliente() {
  $("#cli-cedula").val("");
  $("#cli-nombre").val("");
  $("#msg-clientes").html("");
  modoEdicion    = false;
  cedulaEditando = null;
}

// Inicializar tabla al cargar la página
$(document).ready(function () {
  renderClientes();
});
