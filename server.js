const Joi=require('joi');
const express=require('express');
const app=express();
const bcrypt= require('bcrypt')

app.use(express.json());

const users=[];


app.get('/users', (req,res)=>{
    res.json(users);
});

const trips=[];
app.get('/users/trips', (req,res)=>{
    res.json(trips);
});

app.post('/users/trips', (req,res)=>{
    if(!req.body.tplace){
        res.status(400).send('invalid trip place');
    }
     const trip={id:trips.length +1,tplace:req.body.tplace};
     trips.push(trip);
     res.send(trip)
});



app.post('/users', async(req, res)=>{
    try{
        const salt = await bcrypt.genSalt();
        const hashedPassword= await bcrypt.hash(req.body.password, salt);
        const user= {name:req.body.name, password:hashedPassword};
        users.push(user);
        res.status(201).send();
    } 
    catch{
        res.status(500).send();
    }
});

app.post('/users/login', async (req,res)=>{
    const user=users.find(user=>user.name=req.body.name);
    if(user==null){
        return res.status(400).send('can not find user');
    }try{
        if( await bcrypt.compare(req.body.password, user.password)){
            res.send('you have successful logged in');
        }else{
            res.send('Incorrect username or password'); 
        }
    }catch{
        res.status(500).send();
    }

});

function validateTrip(trip){
    const schema={
    tplace: Joi.string().min.required()
    };
    return Joi.validate(tplace,schema);
    }

const port=process.env.port || 3000
app.listen(port,()=>{console.log(`server starting on port: ${port}...`)});