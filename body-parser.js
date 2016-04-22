

module.exports = function(req, res, next){
  var body = []
  req.on("data", function(d){
    body.push(d) 
  })
  .on("end", function(){
    var queryString = Buffer.concat(body).toString()
    queryString.split("&").forEach(function(pair){
      var pairs = pair.split("=")
      req.body = req.body || {}
      req.body[pairs[0]] = pairs[1]
    })
    next(req, res)
  })

}
