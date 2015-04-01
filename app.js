requires: {
    var autoIncrement = require("mongoose-auto-increment");
    var mongooseMemcached = require("mongoose-memcached");
    var schedule = require("node-schedule");
    var bodyParser = require("body-parser");
    var mongoose = require("mongoose");
    var express = require("express");
    var rutas = require("./rutas");
    var https = require("https");
    var cron = require("./cron");
    var http = require("http");
    var swig = require("swig");
    var xml = require("xml");
    var fs = require("fs");
}

db: {
    autoIncrement.initialize(mongoose.connect("mongodb://localhost/tess"));
}

memcached: {
    /*var options = {
        cache: true,
        ttl: 60,
        memServers: "localhost:11211",
        memOptions: null 
    };
    
    mongooseMemcached(mongoose, options);*/
}

instaciasDeLosModulos: {
    var app = express();
}

certificadosDeSeguridad: {
    var options = {
        key: fs.readFileSync("key.pem"),
        cert: fs.readFileSync("key-cert.pem")
    };
}

sistemaDePlantillas: {
    app.engine("html", swig.renderFile);
    app.set("view engine", "html");
    app.set("views", __dirname + "/views");
    app.set("view cache", false);
    swig.setDefaults({cache: false});
    
    swig.setFilter("details", function (input) {
        return input.split(",").join(", ");
    });
}

configuracionesExpress: {
    app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
    app.use(bodyParser.json({limit: "50mb"}));
    app.use("/assets", express.static(__dirname + "/assets"));
}

rutas: {
    app.get("/", rutas.index);
    app.post("/", rutas.index);
    app.get("/cms", rutas.cms);
    app.post("/cms", rutas.cms);
    app.post("/especificaciones", rutas.especificaciones);
    app.get("/especificaciones/:accion/:tipo", rutas.especificaciones);
    app.post("/productos", rutas.productos);
    app.get("/productos/:accion/:tipo?", rutas.productos);
    app.get("/busquedatexto/:busqueda", rutas.busquedatexto);
    app.get("*", function(req, res) {
        res.send("Página no encontrada");
    });
}

IniciarCronJobs: {
    if(process.argv[2] === "cron") {
        cron.job.init();
    }
    
    var cronjob = schedule.scheduleJob("00 00 * * *", function() {
        cron.job.init();
    });
}

IniciacionDelServidor: {
    http.createServer(app).listen(4567, function () {
        console.log("Servidor iniciado el puerto: 4567");
    });

    https.createServer(options, app).listen(443, function() {
        console.log("Servidor SSL iniciado el puerto: 443");
    });
}
