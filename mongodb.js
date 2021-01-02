
const { MongoClient, ObjectID } =  require('mongodb')

const connectionURL = 'n'
const database = 'task-manager'

// const id = new ObjectID();
// console.log(id)

MongoClient.connect(connectionURL, { useNewUrlParser: true ,}, (error,client) => {
    if (error) {
        return console.log(error)
    }
    const db = client.db(database)


    // db.collection('users').insertOne({
    //     name: "Digvijay",
    //     age:23
    // }, (error, result) => {
    //         if (error) {
    //             return console.log("Insert Fail")
    //         }
    //         console.log(result.ops)
    // })
    // console.log("Connection success")

    db.collection('users').find({ age :23 }).toArray((error, data) => {
        console.log(data)
    })
})