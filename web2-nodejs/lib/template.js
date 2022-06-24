// var template = {
//     html: function (title, list, body, control){
//         return`
//         <!doctype html>
//         <html>
//         <head>
//           <title>WEB1 - ${title}</title>
//           <meta charset="utf-8">
//         </head>
//         <body>
//           <h1><a href="/">WEB2</a></h1>
//           ${list}
//           ${control}
//           ${body}
//         </body>
//         </html>
        
//         `;
//     },
//     list: function (filelist){
//         //     var list = `<ol>
//         //     <li><a href="/?id=HTML">HTML</a></li>
//         //     <li><a href="/?id=CSS">CSS</a></li>
//         //     <li><a href="/?id=JavaScript">JavaScript</a></li>
//         //   </ol>`
    
//         var list = '<ul>';
    
//         var i = 0;
//         while (i < filelist.length) {
//             list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
//             i = i + 1;
//         }
    
//         list = list + '</ul>';
    
//         return list;
//     }
// }

// module.exports = template;

// 그냥 이렇게 해도 된다
module.exports = {
    html: function (title, list, body, control){
        return`
        <!doctype html>
        <html>
        <head>
          <title>WEB2 - ${title}</title>
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
    },
    list: function (filelist){
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
}
