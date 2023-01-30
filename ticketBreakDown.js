const mysql = require('mysql')
const pdf = require('html-pdf')

const dbCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ticket_breakdown'
})

dbCon.connect((error) => {
    if (error) throw error
    console.log('Database is connected')
})


const query = async (sql, values) => {
    return new Promise((resolve, reject) => {
        let result = dbCon.query(sql, values, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}

const getShiftsByFacility = async (facilityId) => {
    let result = await query(`
        SELECT shift.*, facility.*, agent.* 
        FROM shift 
        INNER JOIN facility ON facility.facility_id = shift.facility_id
        INNER JOIN agent ON agent.agent_id = shift.agent_id
        WHERE shift.facility_id = ?
    `, [facilityId])
    
    if (Array.isArray(result)) {
        generateReport(result)
    }
}

const generateReport = (shiftDetails) => {
    let reportHtml = '', tableRows = ''
    if (shiftDetails.length > 0) {
        for (let i = 0; i < shiftDetails.length; i++) {
            const shift = shiftDetails[i]
            tableRows += (`
                <tr>
                    <td>${i + 1}</td>
                    <td>${shift.facility_name}</td>
                    <td>${shift.start_date_time}</td>
                    <td>${shift.end_date_time}</td>
                    <td>${shift.agent_number}</td>
                    <td>${shift.name_of_agent}</td>
                    <td>${shift.clocked_in_time}</td>
                    <td>${shift.clocked_out_time}</td>
                    <td>${shift.activities}</td>
                </tr>
            `)
        }
    } else {
        tableRows = `<tr> <td colspan="9"> No data found </td> </tr>`
    }

    reportHtml = (`
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Shift Details</title>
            </head>
            <body>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>N0#</th>
                            <th>Name of Facility</th>
                            <th>Shift Start Date & Time</th>
                            <th>Shift End date & Time</th>
                            <th>Agent Number</th>
                            <th>Name of Agent</th>
                            <th>Clocked In Time</th>
                            <th>Clocked Out Time</th>
                            <th>Activities</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </body>
        </html>
    `)

    const options = {
        "format": "A4",
        "orientation": "landscape",
        "border": {
            "top": "0.1in",
        },
        "timeout": "120000"
    }

    pdf.create(reportHtml, options).toFile(__dirname+'./report.pdf', function(err, result) {
        if (err) return console.log(err)
        console.log("pdf create")
    })
}

getShiftsByFacility(1234)