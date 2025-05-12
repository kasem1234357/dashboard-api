//====================================================//
//==========core packeges ============================//
const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');
//====================================================//
//=========== Routes =================================//

const tasksRoute = require("./routes/tasks");
const productRoute = require("./routes/products");
const faqRoute = require("./routes/faq");
const contactRoute = require("./routes/contact");
const inviteRoute = require("./routes/invite");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const salesRoute = require('./routes/sales')
const transactionRoute = require('./routes/transaction')
//===================================================//
//============== meddlewares ========================//

const { globalHandleError,requestTime} = require('./meddlewares')


//===================================================//
//============== other =============================//

const corsOptions = require('./config/corsConfig');


//=================================================//
//=============== app logic ======================//

const app = express()
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser())
app.use(cors(corsOptions))
// app.use(requestTime)

//    ROUTES    //
app.use("/api/tasks", tasksRoute);
app.use("/api/products", productRoute);
app.use("/api/faq", faqRoute);
app.use("/api/contact", contactRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/invite", inviteRoute);
app.use('/api/sales',salesRoute);
app.use('/api/transaction',transactionRoute)
//==============//
// handling routes not found error
app.all('*',(req,res,next)=>{
    const err = new CustomError(`Can't find ${req.originalUrl} on the server!`, 404);
    next(err)
})
// handling all types of mongoDb error and api error
app.use(globalHandleError)

module.exports = app;