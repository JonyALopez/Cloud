const { Router } = require('express');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const router = Router();
const { conectar, connector } = require('./dbConnection2');
const bcryt = require('bcryptjs');

var cedula1;
var name1;
var lastName1;
var email1;

dotenv.config();
    const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: 'us-east-2'
    });
let params = { Bucket: 'storage-app-notes', Key: 'file.csv' };

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {

    
    const { user, password } = req.body;

    function val(data) {
            cedula1=data[0];
            name1=data[1];
            lastName1=data[2];
            email1=data[3];

    }

    function asingValues(data) {
        for (i = 0; i <= data.length; i++) {
            if (data[i] != null) {
                return data[i];
            }
        }
        return null;
    }


    function readFile(data, ced) {
        // Obtenemos las lineas del texto
        let lines = data.replace(/\r/g, '').split('\n');
        return lines.map(line => {
            // Por cada linea obtenemos los valores
            let values = line.split(';');
            if (values[0] == ced) {
                return values;
            }
            return null;

        });

    }


    const s3download = function(params, cedula) {

        return new Promise((resolve, reject) => {
        
            s3.createBucket({
                Bucket: 'storage-app-notes' /* Put your bucket name */
            }, function() {
                s3.getObject(params, function(err, data) {
                    if (err) {
                        reject(err);
                    } else {

                        resolve(data);
                        val(asingValues(readFile(data.Body.toString(), cedula)));
                        
                    }
                });
            });
        });
    }
//************************************************************************************************ 

    const contact = () => {
        const sql = `SELECT * FROM registre`;

        connector.query(sql, (err, result, filed) => {
            finContact(result, user, password);
        });

    }


    function finContact(data, userr, passwordd) {
        const errors = [];


        if (userr == '' || passwordd == '') {
            errors.push({ text: 'Llene todos los campos' });


        } else {

            for (i = 0; i < data.length; i++) {
                const passwordDes = bcryt.compareSync(passwordd, data[i].password);
                const userDes = bcryt.compareSync(userr, data[i].user);
                var us;
                if (userDes) {
                    us = userDes;
                    if (passwordDes) {
                        const dat = data[i].cedula;
                        s3download(params,dat);
                        setTimeout(() => {
                            res.render('list',{
                                cedula1, name1, lastName1, email1,
                                userr,
                                passwordd
                            })
                            
                        }, 2000);;
                        
                    } else {
                        errors.push({ text: 'Contraseña invalida' });
                    }

                }



            }
            if (us != true) {
                errors.push({ text: 'Usuario invalido' });
            }

            

        }
        if (errors.length > 0) {

            res.render('login', {
                errors
            });
        }


    }

    contact();
});





module.exports = router;