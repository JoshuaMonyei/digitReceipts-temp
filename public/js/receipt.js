const updateForm = (e) => {
   //get fields
    const subTotalEle = document.querySelector('#subTotal')
    const totalEle = document.querySelector('#total')
    const eles = document.querySelectorAll('.form-control')
    
    let salesTax = document.querySelector('#salesTax').value
    let subTotal = 0
    let total = 0

    eles.forEach( (ele, index) => {
        if (ele.name === "item" && 
            eles[index+1].value &&
            eles[index+2].value) {

            const item = ele.value
            const quantity = Number(eles[index+1].value)
            const price = Number(eles[index+2].value)
            const itemSubTotal = quantity*price
            subTotal += itemSubTotal
        }
    })

    subTotalEle.value = subTotal
    
    salesTax = (Number(salesTax)/100) * Number(subTotal)
    total = Number(subTotal) + Number(salesTax)
    totalEle.value = total
}


const addItem = (e) => {
    updateForm()

    const itemEleRaw = ` 
                  <div class="row my-3">
                    <div class="col-lg-5 my-2">
                      <input type="text" name="item" id="" class="form-control" placeholder="Item bought">
                    </div>

                    <div class="col-lg-6 my-2">
                      <div class="inner-right row d-flex justify-content-between">
                        <div class="col">
                          <input type="text" name="quantity" id="" class="form-control" placeholder="Quantity" oninput="updateForm()">
                        </div>
                        <div class="col">
                          <input type="text" name="price" id="" class="form-control" placeholder="Price" oninput="updateForm()">
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-1 my-2">
                      <button type="button" class="btn btn-danger btn-sm" onclick="removeItem()">remove</div>
                    </div>
                  </div>
                 `
    const parser = new DOMParser()
    const itemEle = parser.parseFromString(itemEleRaw, 'text/html').querySelector('.row')
      
    let itemsHolder = document.querySelector('#items-holder')
    itemsHolder.append(itemEle)
}


const removeItem = (e) => {
    e = e || window.event
    const button = e.target || e.srcElement
    button.parentNode.parentNode.remove()
    updateForm()
}

updateForm()
