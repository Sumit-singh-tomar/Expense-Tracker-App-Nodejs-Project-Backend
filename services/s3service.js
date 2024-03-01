const AWS = require('aws-sdk')

exports.uploadToS3 = (data, filename) => {

    let s3bucket = new AWS.S3({
        accessKeyId: process.env.IAm_USER_KEY,
        secretAccessKey: process.env.IAm_USER_SECRET,
    })

    var params = {
        Bucket: process.env.BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: "public-read"
    }
    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, data) => {
            if (err) {
                console.log('aws errr', err)
                reject(err)
            }
            else {
                console.log('aws success', data);
                resolve(data.Location)
            }
        })
    })
}