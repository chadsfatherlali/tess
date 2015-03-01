console.log("============== GDRIVE MODULE ==============");

exports.manager = function() {
    var fs = require("fs");
    var path = require("path");
    var request = require("request");
    var temp_dir = path.join(process.cwd(), "temp/");
    var jsonfile = path.join(process.cwd(), "config/") + "config.json"; 
    var GoogleTokenProvider = require("refresh-token").GoogleTokenProvider;
    
    function init(callback) {
        fs.readFile(jsonfile, "utf8", function (err, data) {
            if(err) console.error("ERROR:", err);
            
            var json = JSON.parse(data);
            
            var tokenProvider = new GoogleTokenProvider({
                refresh_token: json.gdrive.REFRESH_TOKEN,
                client_id: json.gdrive.CLIENT_ID,
                client_secret: json.gdrive.CLIENT_SECRET
            });
            
            if(callback) callback(tokenProvider, json);
        });
    }
    
    return {
        delete: function(REQ, callback) {
            init(function(tp, json) {
                tp.getToken(function(err, access_token) {
                    request.del({
                        "url": "https://www.googleapis.com/drive/v2/files/" + REQ.idimg,
                        "headers": {"Authorization": "Bearer " + access_token}
                    }, function(error, response, body) {
                        if(error) console.error("ERROR:", error);

                        if(callback) callback();
                    });
                }); 
            });
        },
        
        upload: function(REQ, testimg, callback) {
            if(testimg) {
                callback(REQ.archivo, REQ.idimg);
            } 
            
            else{
                init(function(tp, json) {
                    if (!fs.existsSync(temp_dir)) {
                        fs.mkdirSync(temp_dir);
                    }

                    tp.getToken(function(err, access_token) {
                        var seconds = new Date().getTime();
                        var name = REQ.tipoproducto.replace(/\s/g, "-") + "-" + REQ.subtitulo.replace(/\s/g, "-") + "-" + seconds;
                        var base64Data = REQ.archivo.replace(/data:image\/jpeg;base64,/, "");
                        var img = new Buffer(base64Data, "base64");
                        var file = temp_dir + "temp.jpg";
                        var folder = json.gdrive.FOLDER_ID;

                        fs.writeFile(file, img, function(error) {
                            if(error) console.log(error);

                            var fstatus = fs.statSync(file);

                            fs.open(file, "r", function(status, fileDescripter) {
                                if(status) {
                                    console.log("status", status);
                                }

                                var buffer = new Buffer(fstatus.size);

                                fs.read(fileDescripter, buffer, 0, fstatus.size, 0, function(error, num) {
                                    request.post({
                                        "url": "https://www.googleapis.com/upload/drive/v2/files",
                                        "qs": {"uploadType": "multipart"},
                                        "headers": {"Authorization": "Bearer " + access_token},
                                        "multipart":  [{
                                                "Content-Type": "application/json; charset=UTF-8",
                                                "body": JSON.stringify({
                                                    "title":  name + ".jpg",
                                                    "parents": [{"id": folder}]
                                                })
                                            },
                                            {
                                                "Content-Type": "image/jpeg",
                                                "body": buffer
                                            }
                                        ]
                                    }, function(error, response, body) {
                                        if(error) console.error("ERROR: ", error);

                                        var body = JSON.parse(body);

                                        if(body.id) {
                                            if(callback) callback(json.gdrive.GDRIVE_HOST + folder + "/" + name + ".jpg", body.id);
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
            }
        }
    };    
}();