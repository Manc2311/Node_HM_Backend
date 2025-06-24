const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
require('dotenv').config();


const routes = require("./routes/auth");
const policyRoutes = require("./routes/policy")


app.use(cors());
app.use(express.json());

app.use((req,res,next)=>{
    console.log(`${req.method} req for ${req.url}`);
    next();
    
})

app.use("/",routes);
app.use("/api",policyRoutes);


app.listen(port,()=>{
    console.log(`server listening to the port ${port}`);
    
})



//to check port is in working 

// If another process is using port 5000, your server may appear to start, but it won’t actually receive requests.
// lsof -i :5000


// COMMAND   PID         USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
// ControlCe 618 manasichavan    7u  IPv4 0xdb3428f71bc1cbdb      0t0  TCP *:commplex-main (LISTEN)
// ControlCe 618 manasichavan    8u  IPv6 0xdb342900b3f216e3      0t0  TCP *:commplex-main (LISTEN)


// kill -9 12345   # replace 12345 with the actual PID
