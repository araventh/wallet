const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://Araventh:Dhanush@04@cluster0.yjgty.mongodb.net/walletdb",{ useUnifiedTopology: true, useNewUrlParser: true });
const app= express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
const walletschema = new mongoose.Schema({
    email: String,
    password: String,
    balance: Number,
    trans: [{date:Date,amount:Number,action:Number,message:String}]
});

const Wallet = new mongoose.model("Wallet",walletschema);
app.use(express.static("public"));
var f=1;
app.get("/",function(req,res){
    res.render("index",{i:1});
});
var user;
app.post("/",async(req,res)=>{
    f=2;
    var but = req.body.submitform;

    let uemail= req.body.user_email;
    let upass = req.body.user_password;
    console.log("hello");
    console.log(but);
    if(but==1){
        (async () => {
            await Wallet.findOne({email:uemail},function(err,a){
                if(err){
                    console.log(err);
                }
                else{
                    console.log(a);
                    user=a;
                }
            })
            if(user)
            res.render("index",{i:2});
            const account = new Wallet({
                email:uemail,
                password:upass,
                balance:0,
                trans:[]
            });
            await account.save(); 
            await Wallet.findOne({email:uemail,password:upass},function(err,a){
                if(err){
                    console.log(err);
                }
                else{
                    console.log(a);
                    user=a;
                }
            })
            console.log(user);
            res.render("wallet",{i:f,use:user});
        })();
    }
    else{
        (async () => {
            await Wallet.findOne({email:uemail,password:upass},function(err,a){
                if(err){
                    console.log(err);
                }
                else{
                    console.log(a);
                    user=a;
                }
            })
            if(!user)
                res.render("index",{i:3});
            console.log(user);
            res.render("wallet",{use:user});
        })();
    } 
});
app.post("/wallet",async(req,res)=>{
    console.log("Hai");
    var n=req.body.submitrans;
    var am=req.body.amount;
    var mes=req.body.mess;
    if(n==1){
        user.balance=Number(user.balance)+Number(am);
        var obj={date:new Date(),amount:am,action:1,message:mes};
        user.trans.push(obj);
        await Wallet.updateOne({email:user.email},{trans:user.trans,balance:user.balance},function(err){
            if(err){
                console.log(err);
            } else {
                console.log("sucessful updation");
            }
        });
    }
    else{
        user.balance=Number(user.balance)-Number(am);
        var obj={date:new Date(),amount:am,action:2,message:mes};
        user.trans.push(obj);
        await Wallet.updateOne({email:user.email},{trans:user.trans,balance:user.balance},function(err){
            if(err){
                console.log(err);
            } else {
                console.log("sucessful updation");
            }
        });
    }
    console.log(user);
    res.render("wallet",{use:user});
})
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port,function(){
    console.log("server started");
}
);