
var clientes  = [];
var productos = [];
var facturas  = [];
var contadorFactura = 1;


function guardarDatos() {
    localStorage.setItem('sf_clientes',  JSON.stringify(clientes));
    localStorage.setItem('sf_productos', JSON.stringify(productos));
    localStorage.setItem('sf_facturas',  JSON.stringify(facturas));
    localStorage.setItem('sf_contador',  contadorFactura);
}

function cargarDatos() {
    var c = localStorage.getItem('sf_clientes');
    var p = localStorage.getItem('sf_productos');
    var f = localStorage.getItem('sf_facturas');
    var n = localStorage.getItem('sf_contador');
    if (c) clientes  = JSON.parse(c);
    if (p) productos = JSON.parse(p);
    if (f) facturas  = JSON.parse(f);
    if (n) contadorFactura = parseInt(n);
}

cargarDatos();

/**
 * Genera el siguiente número de factura con formato F-XXXX
 * @returns {string} Número de factura, ej: "F-0001"
 */
function generarNumeroFactura() {
    var num = "F-" + String(contadorFactura).padStart(4, "0");
    contadorFactura++;
    guardarDatos();
    return num;
}
