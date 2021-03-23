const nightmare = require('nightmare')() // use defaults

const args = process.argv.slice(2)
const url = args[0]
const minPrice = args[1]

const id = "priceblock_ourprice"
const URL = "https://www.amazon.com/Samsung-enhanced-tracking-analysis-coaching/dp/B07VQJDGX2"

checkPrice()

async function checkPrice() {
    try {
        const priceString = await nightmare
            .goto(url)      
            .wait("#priceblock_ourprice")       
            .evaluate(() => document.getElementById("priceblock_ourprice").innerText)        
            .end()
        console.log(priceString)
        const priceNumber = parseFloat(priceString.replace('$', ''))
        console.log(priceNumber)
        if (priceNumber < minPrice) {
            console.log("It is cheap")
        } else {
            console.log("It is expensive")
        }
    } catch (e) {
        console.log('Amazon price error')
        throw e
    }
}

