var http = require('http');
var cookie = require('cookie');

http.createServer(function(request, response){
    console.log(request.headers.cookie);
    // cookie 문자열을 객체로 바꿔준다
    // parse는 undefined를 수용하지 못하는 경직된 친구다
    var cookies = {};
    if(request.headers.cookie !== undefined) {
        cookies = cookie.parse(request.headers.cookie);
    }
    console.log(cookies.yummy_cookie);
    
    response.writeHead(200, {
        'Set-Cookie': [
            'yummy_cookie=choco', 
            'tasty_cookie=strawberry', 
            `Permanent=cookies; Max-Age=${60*60*24*30}`, 
            'Secure=Secure; Secure',
            'HttpOnly=HttpOnly; HttpOnly', 
            'Path=Path; Path=/cookie',
            'Domain=Domain; Domain=o2.org'
        ]
    });

    response.end('cookie!!');
}).listen(3000);