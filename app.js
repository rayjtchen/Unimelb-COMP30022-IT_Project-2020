const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');

// import all schemas to be used
/* why this? - rationale found in 
 * https://stackoverflow.com/questions/19051041/cannot-overwrite-model-once-compiled-mongoose
 * particulary - "Avoid exporting/requiring models — if any have refs to other models this can
 * lead to a dependency nightmare. Use var User = mongoose.model('user') instead of require." */
const User = require('./models/Users');
const ItemBlock = require('./models/ItemBlocks');
const ProfileBlock = require('./models/ProfileBlocks');

// pass passport variable and insert into configuration function 
const passportConf = require('./config/passport');

const userRoute = require('./routes/api/users');
const itemBlockRoute = require('./routes/api/itemblocks');
const profBlockRoute = require('./routes/api/profileblocks');
const portfolioRoute = require('./routes/api/portfolio');
const fileRoute = require('./routes/api/files');

app.use(cors());
app.use(fileUpload());

//Bodyparser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use Routes. Whenever the specified route is required, enter userRoute to handle it
app.use('/api/users', userRoute);
app.use('/api/itemblocks', itemBlockRoute);
app.use('/api/profileblocks', profBlockRoute);
app.use('/api/portfolio', portfolioRoute);
app.use('/api/files', fileRoute);

// Serve Static assets (massive build file) if we are in production
if (process.env.NODE_ENV === 'production'){
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}


module.exports = app;