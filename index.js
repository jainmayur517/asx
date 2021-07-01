
var exp= require('express');
var app =exp();
var serve=require('express-static');
var mongoose=require("mongoose");
var normalize = require("normalize-mongoose");

var bodyParser=require("body-parser");
app.use(bodyParser.json());

//for CORES POLICY
app.use((req,res,next) => {
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  
  if(req.method === 'OPTIONS'){
      res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
  }
  
  next()
  });


mongoose.connect("mongodb+srv://manomaya_p:a123@cluster0.q97yq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{useNewUrlParser: true,useUnifiedTopology:true })
mongoose.connection.on("error", function(error) {
    console.log(error)
  })
  mongoose.connection.on("open", function() {
    console.log("Connected to MongoDB database.")
  })

  var participantSchema = new mongoose.Schema({
    name: String,
    event: String
   });
   participantSchema.plugin(normalize);

var participantSchema=mongoose.model("participantSchema",participantSchema);



//Interception of all Requests

/*
app.use("*", async function(req, res, next){
  try{
    if (req.originalUrl == '/api/sign_in' || req.originalUrl == '/api/Sign_up' || req.originalUrl =='/api/counter' || req.originalUrl =='/api/registration/teachers' || req.originalUrl =='/api/login/teacher') {
      return next()
    }
    await logger_detail.loggerIn(req.body.db, req.connection.remoteAddress, req.originalUrl, req.method)
    dbData = await jwt_helper.verifyAccessToken(req)
    return next()
  } catch (e) {
      console.log(e)
      logger_detail.loggerErr(req.body.db, e)
      res.status(500).json({
        Error : ""+e
      });
  }
 })
 */

   app.post('/api', async function (req, res){

      try{
        var newEvent={
          name: req.body.name,
          event: req.body.event, 
      }
      const a1=await participantSchema(newEvent).save();
      res.json(a1);
      console.log("success");

      }catch (e) {
        console.log(e);
      }
    })


    app.get("/api",function(req,res){
      //res.render("landing",{Meme: Meme});
      participantSchema.find({}, function(err,allparticipantSchema){
          if(err){
              console.log(err);
          }
          else{
              res.send({participantSchema: allparticipantSchema});
          }
      
      });
      });

      app.get("/api/:id",async(req,res)=>{
        var id2=req.params.id;
        
        try{
            const qq=await participantSchema.findById(id2)
            res.json(qq)
        }catch(err){
            res.send('Error' +err)
        }
        })

        //edit request 
app.patch("/api/:id/",async(req,res)=>{
  try{      
     const change=await participantSchema.findById(req.params.id)
     change.event=req.body.event
    
     const a1=await change.save()
     res.json(a1)
 }catch(err){
     res.send(err)
 }
 })

app.listen(process.env.PORT,process.env.IP)

