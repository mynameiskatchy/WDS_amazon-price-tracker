require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const nightmare = require('nightmare')()

const id = "priceblock_ourprice"
const URL = "https://www.amazon.com/Samsung-enhanced-tracking-analysis-coaching/dp/B07VQJDGX2"

const args = process.argv.slice(2)
const url = args[0]
const minPrice = args[1]

checkPrice()


async function checkPrice() {
    try {
        const priceString = await nightmare.goto(URL)
                                        .wait("#priceblock_ourprice")
                                        .evaluate(() => document.getElementById("priceblock_ourprice").innerText)
                                        .end()
        const priceNumber = parseFloat(priceString.replace('$', ''))
        if (priceNumber < minPrice) {
            await sendEmail(
                'Price Is Low',
                `The price on ${url} has dropped below ${minPrice}`
            )
        }
    } catch (e) {
        await sendEmail('Amazon Price Checker Error', e.message)
        console.error(error.response.body)
        throw e
    }
}

function sendEmail(subject, body) {
    const email = {
        to: 'wages14972@bombaya.com',
        from: 'wages14972@bombaya.com',
        subject: subject,
        text: body,
        html: body
    }

    return sgMail.send(email)
}