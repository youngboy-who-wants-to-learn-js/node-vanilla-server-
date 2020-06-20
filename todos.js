const fs = require('fs');

const generateID = () => new Date().getTime();

const todos = [
    {
        id : 1,
        title : 'Todo 1',
        completed : false
    }
];

const  writeTodos = (todos) =>{
    fs.writeFile('todos.json',JSON.stringify(todos),'utf-8',error=>{
        if (error) throw error;

        console.log('File create or rewrite!');
    });
}

const readTodos = (callback = () =>{}) =>{
    fs.readFile('todos.json','utf-8',(error,content)=>{
        if (error) throw error;

        callback(JSON.parse(content));
    });
};

const createTodo = (title) =>{
    const todo = {
        id : generateID(),
        title,
        completed : false
    };

    readTodos((todos)=>{
        const newTodos = [...todos,todo];

        writeTodos(newTodos);
    });
};

const updatedTodo = (id,body) => {
    readTodos((todos)=>{
        const newTodos = todos.map(todo =>{
            if (todo.id === id){
                return {...todo,...body};
            } else {
                return todo
            }
        });
        writeTodos(newTodos);
    });
};

const deleteTodo = (id) => {
    readTodos((todos)=>{
        const newTodos = todos.filter(todo => id!== todo.id)

        writeTodos(newTodos);
    })
};



// readTodos((todos)=>{
//     let todo = todos.find(todo => todo.id === 1);
//     console.log(todo);
// });

module.exports = {
    readTodos,
    createTodo,
    deleteTodo,
    updatedTodo
};