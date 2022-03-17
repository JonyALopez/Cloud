const mysql = require('mysql');
const Connection = require('mysql/lib/Connection');


const connector = mysql.createConnection({
    host: '0.tcp.ngrok.io',
    user: 'root',
    password: '1234',
    database: 'registros',
    port: '14917',
});

const conectar = () => {
    connector.connect(err => {
        if (err) throw err
        console.log('conectado a mysql')
    });
}
const addContact = (cedula, user, password) => {
    const sql = `INSERT INTO registre (cedula, user, password) VALUES ("${cedula}","${user}","${password}")`
    connector.query(sql, (err, result, filed) => {
        if (err) throw err
        console.log(result);

    });

}
module.exports = { conectar, addContact, connector };