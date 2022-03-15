const { Router } = require('express');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const router = Router();
const { conectar, addContact, connector } = require('./dbConection');
const bcryt = require('bcryptjs');




var datat

dotenv.config();
const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: 'us-east-2'
});

//-------------------------------------------------------------------------------------------------------

router.get('/registro', (req, res) => {
    res.render('registro');
});

router.post('/registro', (req, res) => {
    const { user, password } = req.body;
    const errors = [];
    if (user == '' || password == '') {
        errors.push({ text: 'Llene todos los campos' });
    } else {
        const contact = () => {
            const sql = `SELECT * FROM registre`;

            connector.query(sql, (err, result, filed) => {

                finContact(result, user);
            });

        }

        function finContact(data, userr) {
            const errors = [];

            for (i = 0; i < data.length; i++) {
                const userDes = bcryt.compareSync(userr, data[i].user);
                if (userDes) {
                    errors.push({ text: 'El usuario ya existe' });
                }
            }

            if (errors.length > 0) {

                res.render('registro', {
                    errors
                });
            } else {
                let cedula = datat[0];

                const salt = bcryt.genSaltSync();
                const passwordCryt = bcryt.hashSync(password, salt);
                const userCryt = bcryt.hashSync(user, salt);



                addContact(cedula, userCryt, passwordCryt);

                console.log("Info enviada");
                res.render('files');

            }

        }
        contact();



    }



    if (errors.length > 0) {

        res.render('registro', {
            errors
        });
    }


});



//----------------------------------------------------------------------------------------------------------------
router.get('/files', (req, res) => {
    res.render('files');
});

router.post('/file', (req, res) => {
    const { cedula } = req.body;
    let params = { Bucket: 'storage-app-notes', Key: 'file.csv' };
    const contact = () => {
        const sql = `SELECT * FROM registre`;

        connector.query(sql, (err, result, filed) => {
            finContactFile(result, cedula);
        });

    }

    function finContactFile(data, cedula) {
        const errors = [];
        console.log("Data",data);
        for (i = 0; i < data.length; i++) {
            if (data[i].cedula == cedula) {
                errors.push({ text: 'Al usuario ya se le realizo un registro' });
            }
        }
        if (errors.length > 0) {
            res.render('files', {
                errors
            });
        } else {
            res.render('registro');
        }


    }




    function val(data) {
        const errors = [];
        if (data != null && data != '') {
            contact();
            datat = data;


        } else {
            if (data == null) {
                errors.push({ text: 'El usuario no existe' });
            }
            if (data == '') {
                errors.push({ text: 'Llene los campos' });
            }




        }

        if (errors.length > 0) {
            res.render('files', {
                errors
            });

        }

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
    s3download(params, cedula);
});

module.exports = router;