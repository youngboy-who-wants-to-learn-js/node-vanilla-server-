const http = require("http");
const { readTodos, createTodo, deleteTodo,updatedTodo } = require("./todos");

http.createServer((request,response)=>{
    if (request.url === '/todos' && request.method === "GET"){
        response.writeHead(200,{'Content-Type' : 'application/json'})
        
        readTodos((todos) => {
            response.end(JSON.stringify(todos));
          });
    }

     else if ((request.url === '/todos' && request.method === "POST")){
        let rawData = "";
        request.on("data", (chunk) => (rawData += chunk));
        request.on("end", () => {
            try {
              const { title } = JSON.parse(rawData);
  
              createTodo(title);
  
              response.writeHead(201, { "Content-Type": "text/plain" });
              response.end("Задача создана");
            } catch (error) {
              console.log(error);
            }
          });
    }

    else if ((request.url === '/todos?completed=false' && request.method === "GET")){
        response.writeHead(201,{ "Content-Type": "application/json" })
        readTodos((todos)=>{
            let falseTodos = todos.filter(todo => todo.completed === false);
                response.end(JSON.stringify(falseTodos));
        });
    }

    else if ((request.url === '/todos?completed=true' && request.method === "GET")){
        response.writeHead(201,{ "Content-Type": "application/json" })
        readTodos((todos)=>{
            let falseTodos = todos.filter(todo => todo.completed === true);
                response.end(JSON.stringify(falseTodos));
        });
    }

   else  if ((request.url === '/todos' && request.method === "POST")){
        let rawData = "";
        request.on("data", (chunk) => (rawData += chunk));
        request.on("end", () => {
          try {
            const { title } = JSON.parse(rawData);

            createTodo(title);

            response.writeHead(201, { "Content-Type": "text/plain" });
            response.end("Задача создана");
          } catch (error) {
            console.log(error);
          }
        });
    }

   else  if ((request.url.match(/\/todos\/\d+/) && request.method === "DELETE")){
        const id = parseInt(request.url.replace(/\D+/,''));
        
        readTodos((todos)=>{
          const todo = todos.find(todo => todo.id === id);

          if (!todo){
            response.writeHead(404,{ "Content-Type": "text/plain" })
            response.end('Not Found');
          } else {
            deleteTodo(id);
            response.writeHead(201, { "Content-Type": "text/plain" });
            response.end("Todo удалена");
          }

        });
    }

    else if ((request.url.match(/\/todos\/\d+/) && request.method === "GET")){
        const id = parseInt(request.url.replace(/\D+/,''));
        
       readTodos((todos)=>{
           const todo = todos.find(todo => todo.id === id);
           if (!todo){
               response.writeHead(404,{ "Content-Type": "text/plain" })
               response.end('Not Found');
           } else {
            response.writeHead(201,{ "Content-Type": "application/json" })
            response.end(JSON.stringify(todo));
           }
        });
    } 
    else if ((request.url.match(/\/todos\/\d+/) && request.method === "PATCH")){
      const id = parseInt(request.url.replace(/\D+/,''));

      let rawData = ''; // необработанные данные
      request.on("data", (chunk) => (rawData += chunk));
      request.on('end',()=>{
        try {
          const body = JSON.parse(rawData);

          updatedTodo(id,body);

          response.writeHead(201, { "Content-Type": "text/plain" });
          response.end("Задача обновлена");
        } catch (error) {
          console.log(error);
        }
      })
    } else {
      response.writeHead(404,{"Content-Type" : "text/plain"});
      response.end('Not Found');
    }
    
}).listen(3000);