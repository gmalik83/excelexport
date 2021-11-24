var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var multer = require('multer');
var path = require('path');
var userModel = require('./models/userModel');
var excelToJson = require('convert-excel-to-json');
var bodyParser = require('body-parser');
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
var uploads = multer({ storage: storage });
//connect to db
mongoose
  .connect('mongodb://localhost:27017/exceldemo', { useNewUrlParser: true })
  .then(() => console.log('connected to db'))
  .catch((err) => console.log(err));
//init app
var app = express();
//set the template engine
app.set('view engine', 'ejs');
//fetch data from the request
app.use(bodyParser.urlencoded({ extended: false }));
//static folder
// Virtual Path Prefix '/static'
app.use('/static', express.static('public'));
// Serve Static Assets
app.use(express.static('public'));
app.use(express.static(path.resolve(__dirname, 'public')));
//route for Home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Import Excel File to MongoDB database
var excelData;
function importExcelData2MongoDB(filePath) {
  // -> Read Excel File to Json Data
  excelData = excelToJson({
    sourceFile: filePath,
    sheets: [
      {
        // Excel Sheet Name
        name: 'Sheet1',
        // Header Row -> be skipped and will not be present at our result object.
        header: {
          rows: 1,
        },
        // Mapping columns to keys
        columnToKey: {
          A: 'Name of the Candidate',
          B: 'Email',
          C: 'Mobile No.',
          D: 'Date of Birth',
          E: 'Work Experience',
          F: 'Resume Title',
          G: 'Current Location',
          H: 'Postal Address',
          I: 'Current Employer',
          J: 'Current Designation',
        },
      },
    ],
  });
  // -> Log Excel Data to Console
  console.log(excelData);

  // Insert Json-Object to MongoDB
}
// Upload excel file and import to mongodb
app.post('/uploadfile', uploads.single('uploadfile'), (req, res) => {
  importExcelData2MongoDB(__dirname + '/uploads/' + req.file.filename);
  userModel.insertMany(excelData, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
  // res.send('File Uploaded Successfully');
  //console.log(res);
});

//assign port
var port = process.env.PORT || 3001;
app.listen(port, () => console.log('server run at port ' + port));
module.exports = app;
