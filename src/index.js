const exprees = require('express')
require('./db/mongoose')



const taskRoute=require('./routers/task')
const userRoute=require('./routers/user')

const app = exprees();
const port = process.env.PORTnpm ;

app.use(exprees.json());
app.use(userRoute);
app.use(taskRoute)


app.listen(3000, () => {
    console.log("Server start at 3000 port");
})



// const User=require('./models/user')

// const main = async () => {
//     try {
           
//         const task = await User.findById('5fed85d2ae1f9e2ae40c9068')
//         await task.populate('tasks').execPopulate();
//         console.log(task.tasks)
//     }
//     catch (e) {
//         console.log(e);
//     }
// }
// main();