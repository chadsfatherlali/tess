console.log("============== INDEX MODULE ==============");

exports.index = function() {
    return {
        slides: function(callback) {
            if(callback) callback();
        }
    };
}();