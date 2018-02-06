var Hello = require('../websockets/HelloModule')

module.exports={
    async hello(req,res){
        var h = new Hello()
        h.setName(req.param('name'))
        res.ok(h.sayHello())
    }
}