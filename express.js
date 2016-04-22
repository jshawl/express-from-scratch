var http = require("http")
var server = http.createServer(router)
var routes = {}
var middlewares = []
function router(req, res){
  res.send = function(data){
    res.end(data)
  }
  res.json = function(data){
    res.end(JSON.stringify(data))
  }
  when([...middlewares], function(){
    try{
      var fn = routes[req.method][req.url]
      if(typeof fn === "function"){
        fn(req, res)
      }else{
        for(var verb in routes){
 	  for(var path in routes[verb]){
	    var regexp = new RegExp(path)
	    if(regexp.test(req.url)){
	      var params = routes[verb][path].params
	      var matches = req.url.match(regexp)
	      matches.shift()
	      params.forEach(function(param,i){
	        req.params = req.params || {}
		req.params[param] = matches[i]
	      })
	      routes[verb][path](req, res)
	    }
	  }
	}
      }
    }catch(e){
      res.end("Cannot " + req.method + " " + req.url)
    }
  })
  function when(fns, callback){
    if(fns.length){
      fns[0](req, res, function(){
	fns.shift()
	when(fns, callback)
      })
    }else{
      callback()
    }
  }
}
module.exports = function(){
  return {
    listen: function(port){
      server.listen(port)
    },
    get: function(path, callback){
      routes.GET = routes.GET || {}
      var dirs = path.split("/")
      var params = []
      var regexp = dirs.map(function(d){
        if(d[0] === ":"){
	  params.push(d.substr(1))
    	  return "(.*)"
	}else{
	  return d
	}
      }).join("/")
      routes.GET[regexp] = callback
      routes.GET[regexp].params = params
    },
    post: function(path, callback){
      routes.POST = routes.POST || {}
      routes.POST[path] = callback
    },
    use: function(fn){
      middlewares.push(fn) 
    }
  }
}
