const { Router } = require('express');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const router = Router();
const { conectar, connector } = require('./dbConnection2');
const bcryt = require('bcryptjs');

router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/list', (req, res) => {
    res.render('list');
});

router.post('/login', (req, res) => {
    const { user, password } = req.body;


    const contact = () => {
        const sql = `SELECT * FROM registre`;

        connector.query(sql, (err, result, filed) => {
            finContact(result, user, password);
        });

    }

    function finContact(data, userr, passwordd) {

        if (userr == '' || passwordd == '') {
            console.log("Llene todos los campos")
            res.redirect('/login')
        } else {

            for (i = 0; i < data.length; i++) {
                if (data[i].user == userr) {
                    if (data[i].password == passwordd) {
                        console.log("Bienvenido", data[i].name);
                        res.redirect('/list');
                    } else {
                        console.log("Usuario o contraseña invalida");
                        res.redirect('/login');
                    }

                }

            }

        }


    }

    contact();


});





module.exports = router;