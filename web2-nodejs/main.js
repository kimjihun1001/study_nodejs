var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');

var template = require('./lib/template.js');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    console.log(pathname);
    // 사용자가 루트로 접근했는지부터 확인
    if(pathname === '/'){
        if(queryData.id === undefined){
            fs.readdir('./data', (err, filelist) => {
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = template.list(filelist);
                var html = template.html(title, list, 
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(html); // 프로그래밍적으로 사용자에게 전송할 데이터를 생성한다. 기존 아파치 서버로는 할 수 없다.
            })

        } else {
            fs.readdir('./data', (err, filelist) => {
                // 이상한 접근을 필터링하기 위해서 base 부분만 가져옴. (파일명.확장자)
                var filteredId = path.parse(queryData.id).base;
                fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
                    var title = filteredId;
                    var list = template.list(filelist);
                    var html = template.html(title, list, 
                        `<h2>${title}</h2>${description}`,
                        `<a href="/create">create</a>
                        <a href="/update?id=${title}">update</a>
                        <form action="delete_process" method="post">
                            <input type="hidden" name="id" value="${title}">
                            <input type="submit" value="delete">
                        </form>`);
                    response.writeHead(200);
                    response.end(html);
                })
            })
        }

    } else if(pathname === '/create'){
        fs.readdir('./data', (err, filelist) => {
            var title = 'WEB - create';
            var list = template.list(filelist);
            var html = template.html(title, list, `
                <form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                        <textarea name="description" id="" cols="30" rows="10" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit" name="" id="">
                    </p>
                </form>
        
            `, '');
            response.writeHead(200);
            response.end(html); 
        })
    } else if(pathname === '/create_process'){
        console.log(request.method);    //? 나중에 RESTful API 형식으로 만들려면 같은 URL을 사용하면서 method가 POST냐 GET이냐에 따라서 처리가 달라져야 할텐데. 그걸 이 조건문 걸어서 하면 되려나?
        var body = '';
        // data, end 이벤트를 감지해서 전송된 데이터 가져오기
        request.on('data', function(data){
            body = body + data;
        })
        request.on('end', function(){
            // 전송된 데이터를 객체로 전환
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                response.writeHead(302, {Location: `/?id=${title}`})    //리다이렉션
                response.end();
            })
        })
    } else if(pathname === '/update'){
        fs.readdir('./data', (err, filelist) => {
            var filteredId = path.parse(queryData.id).base;
            fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
                var title = filteredId;
                var list = template.list(filelist);
                var html = template.html(title, list, 
                    `
                    <form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                        <p>
                            <textarea name="description" id="" cols="30" rows="10" placeholder="description" value="${description}"></textarea>
                        </p>
                        <p>
                            <input type="submit" name="" id="">
                        </p>
                    </form>
                    `,
                    `<a href="/create">create</a><a href="/update?id=${title}">update</a>`);
                response.writeHead(200);
                response.end(html);
            })
        })
    } else if(pathname === '/update_process'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        })
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            console.log(post);
            fs.rename(`data/${id}`, `data/${title}`,function(err){
                fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                    response.writeHead(302, {Location: `/?id=${title}`})
                    response.end();
                });
            });
        })
    } else if(pathname === '/delete_process'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        })
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            fs.unlink(`data/${id}`, function(err){
                response.writeHead(302, {Location: `/`})    //리다이렉션
                response.end();
            })
        })
    } else {
        response.writeHead(404);
        response.end('Not found');
    }

});
app.listen(3000);