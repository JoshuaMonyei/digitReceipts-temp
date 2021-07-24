const puppeteer = require('puppeteer')

const generatePdf = async (pageContent) => {
    try{
        const browser = await puppeteer.launch({ headless: true })
        const page = await browser.newPage()
        await page.setContent(pageContent)
        const pdf = await page.pdf({
            printBackground: true,
            format: 'Letter'
        })
        await browser.close()
        return pdf
    } catch(err) { "error: ", err.message }
}


module.exports.generatePdf = generatePdf
    
