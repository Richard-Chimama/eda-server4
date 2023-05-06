import mongoose from 'mongoose'



const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false, // Don't build indexes
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
}

export default {
    connect: (DB_HOST:any) => {
        mongoose.set('autoIndex', true)
        mongoose.connect(DB_HOST, options)

        mongoose.connection.once('open', () => {
            console.log("the db is connected")
        })

        mongoose.connection.on('error', err => {
            console.error.bind(console, "MongoDB connection error. Please make sure MongoDB is running")(err);
        })
    },
    close: () => {
        mongoose.connection.close()
    }
}