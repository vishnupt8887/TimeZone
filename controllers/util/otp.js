const serviceid = process.env.ServiceId
const sid = process.env.Sid
const token = process.env.Token 
const client = require('twilio')(sid,token)

function sendOtp(mobile){
    console.log('send otp start')

    client.verify.v2.services(serviceid)
                .verifications
                .create({to: `+91${mobile}`, channel: 'sms'})
                .then(verification => console.log(verification.status))
    console.log('ended')            
}

function verifyOtp(mobile,otp){
  console.log(mobile)
  console.log(otp)
    return new Promise((resolve,reject)=>{
        client.verify.v2.services(serviceid)
      .verificationChecks
      .create({to: `+91${mobile}`, code: otp })
      .then((verification_check) =>{
         console.log(verification_check.status)
        resolve(verification_check)
        })
      .catch((verification_check)=>{
        console.log(verification_check.status)
        reject(verification_check)
      })

    })
}


module.exports = {
    sendOtp,verifyOtp
}