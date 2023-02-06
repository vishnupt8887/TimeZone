const mongoose = require('mongoose')
const { address } = require('../controllers/userController')

const addressSchema = new mongoose.Schema({
  address: {
    type: [{
      name: {
        type: String
      },
      mob: {
        type: Number
      },
      house: {
        type: String
      },
      landmark: {
        type: String
      },
      city: {
        type: String
      },
      district: {
        type: String

      },
      state: {
        type: String  

      },
      pincode: {
        type: Number

      },
      status: {
        type: Boolean,
        default: false
      }
    }]

  },
  userId: {
    type: String,
    ref: 'User'
  }
})


addressSchema.methods.editAddr = async  function(newAdd,addId){

  const add = this.address
    const Existing = await add.findIndex(obj=>obj.id == addId)
    add[Existing] = newAdd
    return this.save() 
  
  
}

addressSchema.methods.delete = async function (addId) {
  const addr = this.address
  const Existing = await addr.findIndex(obj=>obj.id==addId)
  addr.splice(Existing,1)
  return this.save()
}

addressSchema.methods.finding = async function(aadId) {
  const addrs = this.address
  const ret = []
  console.log(aadId,'jiki');
  for(i=0;i<aadId.length;i++){

    const index = addrs.findIndex(obj =>obj._id == aadId[i].trim())
  console.log(index,'indddddd')
  if(index >= 0){
    ret.push(addrs[index])
  }console.log(ret,'rrrrrrrrrr')

}
return ret

}

module.exports = mongoose.model('Address', addressSchema)