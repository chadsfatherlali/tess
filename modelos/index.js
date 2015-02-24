var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");

schemas: {
    var CategoriaSchema = mongoose.Schema({
        categoria: "String"
    });

    var TipoProductoSchema = mongoose.Schema({
        producto: "String"
    });

    var NuevoColorSchema = mongoose.Schema({
        nombre: "String",
        color: "String"
    });

    var NuevaTallaSchema = mongoose.Schema({
        nombre: "String",
        medidas: "String"
    });

    var AltaProductoSchema = mongoose.Schema({
        _id: "Number",
        tipo: "String",
        categoria: "String",
        tipoproducto: "String",
        stockaje: {},
        caracteristicas: "String",
        subtitulo: "String",
        referencia: "String",
        precio: "String",
        archivo: "String",
        idimg: "String"
    });
    
    var BusquedaTextoSchema = mongoose.Schema({
        _id: "Number",
        value: "String"
    });
}

AltaProductoSchema.plugin(autoIncrement.plugin, "AltaProducto");

exports.modelo = function(modelo) {
    var modelos = {
        Categoria: mongoose.model("Categoria", CategoriaSchema),
        TipoProducto: mongoose.model("TipoProducto", TipoProductoSchema),
        NuevoColor: mongoose.model("NuevoColor", NuevoColorSchema),
        NuevaTalla: mongoose.model("NuevaTalla", NuevaTallaSchema),
        AltaProducto: mongoose.model("AltaProducto", AltaProductoSchema),
        BusquedaTexto: mongoose.model("BusquedaTexto", BusquedaTextoSchema)
    };

    return modelos[modelo];
};