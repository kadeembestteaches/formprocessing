const express  = require("express");
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');


const app= express();

//This loads all of the static files inside of the public folder. I.e, my css folder, my img folder and my js folder 
app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));


//middleware 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');



const PORT = 5000;


app.get("/",(req,res)=>{

    res.render("index");

})

app.get("/message",(req,res)=>{

    res.render("message",{});
    
});


app.post("/message",(req,res)=>{

    
    const messages=[];

    if(req.body.fullName =="")
    {
        messages.push("Please enter name");
    }

    
    if(req.body.email =="")
    {
        messages.push("Please enter your email");
    }

    
    if(req.body.phoneNo =="")
    {
        messages.push("Please enter phone number");
    }

    if(req.body.message =="")
    {
        messages.push("Please enter your message");
    }


    if(messages.length > 0 )
    {
        console.log(messages);

        res.render("message",{
            errors: messages
        })
    }

    else
    {
    
        const accountSid = 'AC3ef52cfe70d5e7964be1e3626621d018';
        const authToken = '93ae5dbb765e80437b05e0ba8ea08c70';
        const client = require('twilio')(accountSid, authToken);

        client.messages
        .create({
            body: `From:${req.body.fullName} Message:${req.body.message}`,
            from: '+12048139985',
            to: `${req.body.phoneNo}`
        })
        .then(message => console.log(message.sid))
        .catch(err=> console.log(`Error :${err}`));


        var nodemailer = require('nodemailer');
        var sgTransport = require('nodemailer-sendgrid-transport');

        const API_KEY="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";

        // api key https://sendgrid.com/docs/Classroom/Send/api_keys.html
        const options = {
            auth: {
                api_key: API_KEY
            }
        }

        const mailer = nodemailer.createTransport(sgTransport(options));

        const email = {
            to: `${req.body.email}`,
            from: 'kadeembestteaches@gmail.com',
            subject: 'Message',
            text: `${req.body.message}`,
            html: '<b>Taste</b>'
        };
         
        mailer.sendMail(email, (err, res)=> {
            if (err) { 
                console.log(err) 
            }
            console.log(res);
        })
 
// or

        res.redirect("/dashboard");
        
    }
})


app.get('/dashboard',(req,res)=>
{
    res.render("dashboard");
})



app.listen(PORT, ()=>{
    console.log(`Web server is connected @ ${PORT}`);
})

