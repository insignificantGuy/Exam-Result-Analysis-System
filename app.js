const express = require('express')
const app = express();
const path = require('path')
const data = require('./data/23.json')
const bodyParser = require('body-parser');
const fs = require("fs");
var pdf2table = require('pdf2table');
// // const { json } = require('body-parser');
// const PDFParser = require("pdf2json");
// const pdf = require("pdf-parse");
// const pdf2excel = require('pdf-to-excel');


app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => res.render("index"))
app.get('/ResultGenerator', (req, res) => res.render('ResultGenerator'))
app.get('/ResultAnalysis', (req, res) => res.render('ResultAnalysis'))
var gpa = 0;
app.post('/generateResult', (req, res) => {
    const regNo = (req.body.regNo);
    const result = data[regNo];
    var subs = 0;
    let resultCard = ''
    if (result !== undefined) {
        const keys = Object.keys(result)
        let internal = 0
        let external = 0
        let total = 0
        let grade = ''
        let gpa = 0
        let subjectName = ''
        let credit = 0
        let subs = 0;
        keys.forEach((key) => {
            subjectName = result[key].sub
            internal = result[key].int
            external = result[key].ext
            total = result[key].tot
            grade = result[key].grade
            if (result[key].grade === 'S')
                gpa += 10;
            else if (result[key].grade === 'A')
                gpa += 9;
            else if (result[key].grade === 'B')
                gpa += 8;
            else if (result[key].grade === 'C')
                gpa += 7;
            else if (result[key].grade === 'D')
                gpa += 6;
            else if (result[key].grade === 'E')
                gpa += 5;
            else
                gpa += 0;
            subs++;
            credit = result[key].credit
            resultCard += `
            
            <div class="offset-md-3 col-md-6 col-sm-12 offset-sm-0">
            <div class="card shadow-sm">
              <div class="card-body">
                <table id="subject-table" class="table table-striped">
                  <tbody>
                    <tr>
                      <td>
                        <div class="subject-name">
                          ${subjectName}
                          <span
                            class="badge badge-secondary marks-badge int"
                          >INT: ${internal}</span>
                          <span
                            class="badge badge-secondary marks-badge ext"
                          >EXT: ${external}</span>
                          <span
                            class="badge badge-secondary marks-badge tot"
                          >TOT: ${total}</span>
                        </div>
                      </td>
                      <td>
                        <div class="subject-grade">
                          ${grade}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>`

        })
        gpa = gpa / subs.toFixed(3);
        res.render('ResultGenerator', {
            resultCard, gpa
        })
    } else
        res.render('ResultGenerator', {
            resultCard: "Not found"
        })
})

app.get("/getJsonData",async (req,res)=>{
    fs.readFile('./data/exam.pdf', function (err, buffer) {
        if (err) return console.log(err);
        pdf2table.parse(buffer, function (err, rows, rowsdebug) {
            if(err) return console.log(err);
            const data = rows;
            return res.json(data);
        });
    });
})

app.listen(3000, console.log("Server running on 3000"))