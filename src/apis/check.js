import request from "./https";

const api= {
  Login:{
    userLogin(formData) {
      return request.post("/login", formData)
    },
  //   loginIdentify(){
  //     return request.get('session/isAuthenticated')
  //   },
  },
  Logout: {
    logout() {
      return request.post("/logout")
    }
  },
  Commodity:{
  //   getSalesProduct(params){
  //     return request.get('/product/getSalesProduct/',{params})
  //   },
    getProductSalesByCode(data) {
      return request.post('/product/getProductSalesByCode', data)
    },
  //   getCommodityDetail(params){
  //     return request.get('/product/getProduct',{params})
  //   },
  },
  Inventory:{
    changeInventory(data){
      return request.put("/inventory/updateStock/",data);
    },
    getStockDetail(params){
      return request.get('inventory/getStock?', {params})
    },
    getInventoryLogList(data) {
      return request.post("/inventoryLog/list",data);
    },
  },
  Distribute:{
    getDistributeList(params){
      return request.get('deliveryOrder/orderList',{params})
    },
    getDistributeDetail(orderId){
      return request.get('/deliveryOrder/getDetail?orderId='+ orderId)
    },
    deleteOrderList(orderId) {
      return request.delete('/deliveryOrder/cancelOrder/'+ orderId);
    },
  //   addOrder(data){
  //     return request.post('/deliveryOrder/addOrder',data)
  //   },
  //   editOrder(data) {
  //     return request.put('/deliveryOrder/editOrder', data)
  //   },
    getOrderNo(params){
      return request.get('/deliveryOrder/getOrderSerialNo?',{params})
    },
  //   deleteCommodityDiscount(id){
  //     return request.delete('/deliveryOrderDetail/deleteDetail/'+id)
  //   },
  //   print(data){
  //     return request.post('/printTask',data)
  //   },
    tagPrint(data){
      return request.post('/deliveryOrder/print',data)
    },
  //   printOrder(id,type){
  //     return request.post('/deliveryOrder/printDeliveryOrder/'+id+'/'+type)
  //   }
  },
  Customer:{
    getClass() {
      return request.get("/class/classList");
    },
  //   onlyCustomerList() {
  //     return request.get('/client/clientList?searchKey=')
  //   },
    getClientList(id) {
      return request.get('/client/list/'+id)
    },
    add(data) {
      return request.post('/client/addClient', data)
    },
    update(data) {
      return request.put('/client/updateClient', data)
    },
  //   getClient(clientId) {
  //     return request.get('/client/'+clientId)
    }
}
export default api;
