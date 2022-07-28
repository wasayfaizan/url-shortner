const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();

// mongoose connection
mongoose.connect('mongodb://localhost/urlshortner', {
    useNewUrlParser : true, 
    useUnifiedTopology : true
})



app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))


app.get('/', async (req,res) => {
    const shortUrls = await ShortUrl.find();
    res.render('index.ejs', {shortUrl : shortUrls})
})

app.post('/shortUrls', async (req,res) => {
    await ShortUrl.create({
        fullUrl : req.body.fullUrl
    })
    res.redirect('/')
})

app.get('/:shortUrl', async (req,res) => {
   const shortUrl = await ShortUrl.findOne({shortUrl : req.params.shortUrl}) ;
   if (shortUrl == null) {
       return res.sendStatus(404);
   } else {
       shortUrl.NoOfClicks++;
       shortUrl.save();
       res.redirect(shortUrl.fullUrl)
   }
})


app.listen(process.env.PORT || 3000);