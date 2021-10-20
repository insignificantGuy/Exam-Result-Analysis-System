const express = require('express')
const app = express();
const path = require('path')
const data = require('./data/23.json')
const bodyParser = require('body-parser');
const fs = require("fs");

app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({
    extended: false
}))

// const pdf2excel = require('pdf-to-excel');

// try {
//   const options = {
//     // when current pdf page number changes call this function(optional)
//     onProcess: (e) => console.warn(`${e.numPage} / ${e.numPages}`),
//     // pdf start page number you want to convert (optional, default 1)
//     start: 96,
//     // pdf end page number you want to convert (optional, default )
//     end: 101,
//   }

//   pdf2excel.genXlsx('./data/exam.pdf', 'bar.xlsx', options);
// } catch (err) {
//   console.log(err);
// }

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
});

app.post("/analyzeResult",(req,res)=>{
    var yourData = data[req.body.yourRegNo];
    var friends = data[req.body.friendsRegNo];
    var subs = Object.keys(yourData);
    var yourSub = [];
    var friendsSub = [];
    for(var i=0;i<subs.length;i++){
        yourSub.push(yourData[subs[i]]);
        friendsSub.push(friends[subs[i]]);
    }
    var yourResult = [];
    var friendsResult = [];
    for(var i=0;i<yourSub.length;i++){
        var your = yourSub[i];
        var friends = friendsSub[i];
        if(your!=null){
            yourResult.push(yourSub[i].tot);
        }
        else{
            yourResult.push(0);
        }
        if(friends!=null){
            friendsResult.push(friendsSub[i].tot);
        }
        else{
            friendsResult.push(0);
        }
    }
    return res.status(200).json({yourResult,friendsResult});
})

app.listen(3000, console.log("Server running on 3000"))