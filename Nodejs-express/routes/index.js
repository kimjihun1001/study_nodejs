var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');

//route, routing
router.get('/', function(request, response) {
    // 파일을 읽어서 request에 담아주는 미들웨어를 만들었기 때문에 이제 매번 파일을 읽어올 필요가 없다
    console.log(request.list);
  
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}
      <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;">
      `,
      `<a href="/topic/create">create</a>`
    );
    response.send(html);
    
  });

  module.exports = router;