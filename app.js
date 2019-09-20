const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

//View engine handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('contact');
});

app.post('/send', (req, res) => {
    const output = `
        <p>You have a new mail</p>
        <h5>Contact Information</h5>
        <ul>
            <li>${req.body.fullname}</li>
            <li>${req.body.email}</li>
            <li>${req.body.phone}</li>
        </ul>
        <h5>Message</h5>
        <p>${req.body.message}</p>
    `;

    let transporter = nodemailer.createTransport({
        host: 'tonashub.com',
        port: 587,
        secure: false,
        auth: {
            user: 'tona@tonashub.com',
            pass: 'Chht_2019'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    //setup email data
    let mailOptions = {
        from: '"Tonashub" <tona@tonashub.com>',
        to: 'crishhtona21@gmail.com',
        subject: 'New Request',
        text: 'Hello Buddy',
        html: output
    };
    
    transporter.sendMail( mailOptions, (err, info) => {
        if(err){
           res.render('contact', {
               msg: err
           });
        } else {
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            res.render('contact', {
                msg: 'Email has been sent!'
            });
        }
    });


});

app.listen(3000, () => console.log('Server started in port 3000'));