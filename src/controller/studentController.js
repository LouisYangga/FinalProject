const excelJS = require('exceljs');
const asyncHandler = require('express-async-handler')
const studentDb = require('../models/student')
const { register } = require('../controller/utils')
const fs = require('fs');
// const fetch = require('node-fetch');
//Export students
//GET /api/users/students/download
//res status 200
const exportStudents = asyncHandler(async(req, res) => {
    try {
        const workBook = new excelJS.Workbook();
        const workSheet = workBook.addWorksheet("Students");

        workSheet.columns = [
            { header: "Id", key: "id", width: 20 },
            { header: "First Name", key: "firstName", width: 20 },
            { header: "Last Name", key: "lastName", width: 20 },
            { header: "Gender", key: "gender", width: 20 },
            { header: "Email", key: "email", width: 20 },
            { header: "DOB", key: "DOB", width: 20 },
            { header: "Enrolled Subjects Id", key: "enrolledSubjectId", width: 20 }
        ];
        const students = await studentDb.find({}).select({ "_id": 0, "password": 0 });
        students.forEach((student) => {
            workSheet.addRow(student);
        })

        workSheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
        })
        res.setHeader("Content-Type", "application/vnd.openxmlormats-officedocument.spreadsheet.sheet");
        res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');
        workBook.xlsx.write(res).then(() => {
            res.status(200);
        })
    } catch (error) {
        throw new Error(error);
    }
})

const importStudents = asyncHandler(async(req, res) => {
    if (req.file == undefined) {
        return res.status(400).send("Please upload an excel file!");
    }
    let path =
        __basedir + "/resources/static/assets/uploads/" + req.file.filename;
    const workBook = new excelJS.Workbook();
    const datas = [];
    var errors = [];
    var registered = 0;
    var totalRow = 0;

    await workBook.xlsx.readFile(path).then(function() {
        var workSheet = workBook.worksheets[0];
        var firstName, lastName, email, password, DOB, gender;
        workSheet.eachRow({ includeEmpty: true }, async function(row, rowNumber) {
            if (rowNumber > 1) {
                role = 'student';
                firstName = row.getCell(1).value;
                lastName = row.getCell(2).value;
                gender = row.getCell(3).value;
                email = row.getCell(4).value;
                DOB = row.getCell(5).value.toLocaleDateString('en-GB');
                password = row.getCell(6).value
                parentId = row.getCell(7).value;
                var data = {
                    role,
                    firstName,
                    lastName,
                    gender,
                    DOB,
                    email,
                    password,
                    parentId
                };
                datas.push(data);
                totalRow++;
            }
        })
    })
    for (let data of datas) {
        try {
            var inserted = await register(data);
            if (inserted !== null) {
                registered++;
            }
        } catch (error) {
            errors.push(error + ", email: " + data.email);
        }
    }
    fs.unlinkSync(path);
    if (errors !== null) {
        res.status(400).json(errors);
        throw new Error((totalRow - registered) + " students are not registered from total: " + totalRow);
    } else {
        res.status(200).json('All students are inserted ' + registered);
    }
})
module.exports = { exportStudents, importStudents };