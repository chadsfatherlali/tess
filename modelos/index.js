var mongoose = require("mongoose");

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
}

exports.modelo = function(modelo) {
	var modelos = {
		Categoria: mongoose.model("Categoria", CategoriaSchema),
		TipoProducto: mongoose.model("TipoProducto", TipoProductoSchema),
		NuevoColor: mongoose.model("NuevoColor", NuevoColorSchema),
		NuevaTalla: mongoose.model("NuevaTalla", NuevaTallaSchema),
		AltaProducto: mongoose.model("AltaProducto", AltaProductoSchema)
	}

	return modelos[modelo];
}