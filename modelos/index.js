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
        tipo: "String",
        categoria: "String",
        tipoproducto: "String",
        stockaje: {},
        caracteristicas: "String",
        subtitulo: "String",
        referencia: "String",
        precio: "String",
        archivo: "String"
    });
    
    var TextSearchSchema = mongoose.Schema({
        test: "String"
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
        TextSearch: mongoose.model("TextSearch", TextSearchSchema)
    };

    return modelos[modelo];
};