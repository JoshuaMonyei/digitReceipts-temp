const https = require('https')

require('dotenv').config()
const FILE_STORAGE_TOKEN = process.env.FILE_STORAGE_TOKEN

// get shared link of uploaded pdf
const getFileLink = (userId, receiptId) => {
        
    console.log(`getting shareable link for receipt ${receiptId}`)
    const options = {
        hostname: 'api.dropboxapi.com',
        path: '/2/sharing/create_shared_link_with_settings',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${FILE_STORAGE_TOKEN}`,
            'Content-Type': 'application/json'
        }
    }

    return new Promise((resolve, reject) => {

        // make get request for shareable link
        const req = https.request(options, (res) => {

            let responseBody = ''
            res.on('data', function(d) {
                responseBody += d
            })

            res.on('end', () => {
                // return shareable link of uploaded pdf after request completion
                (`shareable link for receipt ${receiptId} successfully gotten \n`)
                resolve(JSON.parse(responseBody).url) 
            })
        })

        req.on('error', (err) => {
            reject(console.log(`request for shareable link for ${receiptId} failed: \n`, err.message))
        })
  
        let data = JSON.stringify({
            "path": `/pdfReceipts/${userId}/${receiptId}.pdf`,
            "settings": {
                "audience": "public",
                "access": "viewer"
            }
        })
        req.write(data)
        req.end()
    })
}



// upload pdf
const uploadFile = (pdf, userId, receiptId) => {

    const options = {
        hostname: 'content.dropboxapi.com',
        path: '/2/files/upload',
        method: 'POST',
        headers: {
			      'Authorization': `Bearer ${FILE_STORAGE_TOKEN}`,
			      'Dropbox-API-Arg': JSON.stringify({
				    'path': `/pdfReceipts/${userId}/${receiptId}.pdf`,
				    'mode': 'overwrite',
				    'autorename': true, 
				    'mute': false,
				    'strict_conflict': false,
            }),
            "Content-Type": "application/octet-stream"
        }
    }

    return new Promise((resolve, reject) => {

        // make post request to dropbox api with pdf buffer
        // storage path in drop box is /pdfReceipts/{user._id}/{receipt._id}.pdf 
        const req = https.request(options, (res) => {
            console.log(`uploading receipt with id ${receiptId}`)
            
            // accumulate response
            let responseBody = ''
            res.on('data', function(d) {
                responseBody += d
            })

            res.on('end', () => {
                resolve(console.log(`receipt id ${receiptId} upload successful`))
            })


        })
        req.on('error', (err) => {
            reject(console.log(`receipt id ${receiptId} upload unsuccessful: \n`, err.message ))
        })

        
        // write pdf file in request
        req.write(pdf)
        req.end()

    })
}


// upload logo
const uploadLogo = (logo, fileType, userId) => {

    const options = {
        hostname: 'content.dropboxapi.com',
        path: '/2/files/upload',
        method: 'POST',
        headers: {
			      'Authorization': `Bearer ${FILE_STORAGE_TOKEN}`,
			      'Dropbox-API-Arg': JSON.stringify({
				    'path': `/logoReceipts/${userId}.${fileType}`,
				    'mode': 'overwrite',
				    'autorename': true, 
				    'mute': false,
				    'strict_conflict': false,
            }),
            "Content-Type": "application/octet-stream"
        }
    }

    return new Promise((resolve, reject) => {

        // make post request to dropbox api with pdf buffer
        // storage path in drop box is /logoReceipts/{user._id}.png 
        const req = https.request(options, (res) => {
            console.log(`uploading user ${userId}'s logo`)
            
            // accumulate response
            let responseBody = ''
            res.on('data', function(d) {
                responseBody += d
            })

            res.on('end', () => {
                resolve(console.log(` user ${userId} logo upload successful`))
            })


        })
        req.on('error', (err) => {
            reject(console.log(`user ${userId} logo upload unsuccessful: \n`, err.message ))
        })

        
        // write logo file in request
        req.write(logo)
        req.end()

    })
}

// get uploaded logo link
const getLogoLink = (fileType, userId, receiptId) => {
        
    console.log(`getting logo link for receipt ${receiptId}`)
    const options = {
        hostname: 'api.dropboxapi.com',
        path: '/2/sharing/create_shared_link_with_settings',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${FILE_STORAGE_TOKEN}`,
            'Content-Type': 'application/json'
        }
    }

    return new Promise((resolve, reject) => {

        // make get request for shareable link
        const req = https.request(options, (res) => {

            let responseBody = ''
            res.on('data', function(d) {
                responseBody += d
            })

            res.on('end', () => {
                // return shareable link of uploaded pdf after request completion
                (`logo link for receipt ${receiptId} successfully gotten \n`)
                resolve(JSON.parse(responseBody).url) 
            })
        })

        req.on('error', (err) => {
            reject(console.log(`request for shareable link for ${receiptId} failed: \n`, err.message))
        })
  
        let data = JSON.stringify({
            "path": `/logoReceipts/${userId}.${fileType}`,
            "settings": {
                "audience": "public",
                "access": "viewer"
            }
        })
        req.write(data)
        req.end()
    })
}

module.exports.uploadFile = uploadFile
module.exports.getFileLink = getFileLink
module.exports.uploadLogo = uploadLogo
module.exports.getLogoLink = getLogoLink
