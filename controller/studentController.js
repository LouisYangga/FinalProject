const excelJS = require('exceljs');
const asyncHandler = require('express-async-handler')
const studentDb = require('../models/student')

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
module.exports = { exportStudents };