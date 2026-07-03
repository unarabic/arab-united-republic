const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Logging } = require('@google-cloud/logging');
const logging = new Logging({ projectId: 'unarabic' });
const log = logging.log('dad-events');
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req,res)=> res.json({status:"البنك المركزي شغال", coin:"DAD"}));
app.get("/test-log", async (req,res)=>{
  await log.write(log.entry({severity:'INFO'},{message:'مرحبا من الدينار العربي!'}));
  res.json({ok:true});
});
app.listen(3001, ()=>console.log("Server running"));
