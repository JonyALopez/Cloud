const { redirect } = require('express/lib/response');
const res = require('express/lib/response');
const { existsSync } = require('fs');
const mysql = require('mysql');
const Connection = require('mysql/lib/Connection');

var envi;
const connector = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'registros'

});

const conectar = () => {
    connector.connect(err => {
        if (err) throw err
        console.log('conectado a mysql')
    });
}

/*const contact = (user, password) => {
    const sql = `SELECT * FROM registre`;

    connector.query(sql, (err, result, filed) => {
        console.log("resu1", result);
        resul = result;
        console.log("2", resul);
        //finContact(result, user, password);
    });

}*/








module.exports = { conectar, connector };