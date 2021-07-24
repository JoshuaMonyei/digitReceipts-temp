const formParser = (req, res, next) => {
    try {
        body = req.body
        
        let tempItems = []
        if( Object.prototype.toString.call( body.item ) === '[object Array]' ) {
    
            body.item.forEach( (ele, index) => {
                if (ele &&
                    body.quantity[index] &&
                    body.price[index]) {

                    tempItems.push([ele, 
                        body.quantity[index], 
                        body.price[index],
                        Number(body.quantity[index])*Number(body.price[index])
                    ])
                }
            })
        } else { tempItems.push([body.item, 
                body.quantity, 
                body.price, 
                Number(body.quantity)*Number(body.price)]) }
        
        req.body.tempItems = tempItems
        next()
    } catch(err) { "error: ", err.message }
            
}


module.exports.formParser = formParser
