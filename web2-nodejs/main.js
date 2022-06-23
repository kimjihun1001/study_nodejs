var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, control){
    return`
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB2</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    
    `;
}

function templateList(filelist){
    //     var list = `<ol>
    //     <li><a href="/?id=HTML">HTML</a></li>
    //     <li><a href="/?id=CSS">CSS</a></li>
    //     <li><a href="/?id=JavaScript">JavaScript</a></li>
    //   </ol>`

    var list = '<ul>';

    var i = 0;
    while (i < filelist.length) {
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
        i = i + 1;
    }

    list = list + '</ul>';

    return list;
}

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
                var list = templateList(filelist);
                var template = templateHTML(title, list, 
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(template); // 프로그래밍적으로 사용자에게 전송할 데이터를 생성한다. 기존 아파치 서버로는 할 수 없다.
            })

        } else {
            fs.readdir('./data', (err, filelist) => {
                fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
                    var title = queryData.id;
                    var list = templateList(filelist);
                    var template = templateHTML(title, list, 
                        `<h2>${title}</h2>${description}`,
                        `<a href="/create">create</a><a href="/update?id=${title}">update</a>`);
                    response.writeHead(200);
                    response.end(template);
                })
            })
        }

    } else if(pathname === '/create'){
        fs.readdir('./data', (err, filelist) => {
            var title = 'WEB - create';
            var list = templateList(filelist);
            var template = templateHTML(title, list, `
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
            response.end(template); 
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
                response.writeHead(302, {Location: `/?id=${title}`})
                response.end('success');
            })
        })
    } else if(pathname === '/update'){
        fs.readdir('./data', (err, filelist) => {
            fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
                var title = queryData.id;
                var list = templateList(filelist);
                var template = templateHTML(title, list, 
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
                response.end(template);
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
                    response.end('success');
                });
            });
        })
    } else {
        response.writeHead(404);
        response.end('Not found');
    }

});
app.listen(3000);