const { Router } = require('express');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const router = Router();
const { conectar, addContact } = require('./dbConection');
const bcryt = require('bcryptjs')




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
    let cedula = datat[0];
    let name = datat[1];;
    let lastName = datat[2];;
    let date = datat[3];;

    addContact(cedula, name, lastName, date, user, password);

    console.log("Info enviada");
    res.redirect('/files');

});



//----------------------------------------------------------------------------------------------------------------
router.get('/files', (req, res) => {
    res.render('files');
});

router.post('/file', (req, res) => {
    const { cedula } = req.body;
    let params = { Bucket: 'storage-app-notes', Key: 'file.csv' };


    function val(data) {
        if (data != null) {
            datat = data;
            res.redirect('/registro');

        } else {
            console.log("No user");
        }

    }

    function asingValues(data) {
        console.log("-----------------------------------")
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