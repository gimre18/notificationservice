"use strict";
function index(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var options = {
        title: 'Mock Center'
    };
    res.render('index', options);
}
exports.index = index;
;
//# sourceMappingURL=index.js.map