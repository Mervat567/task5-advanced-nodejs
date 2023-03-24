require("dotenv").config()
const express=require("express")
const paypal=require("@paypal/checkout-server-sdk")
const app=express()
// const path=require("path")
const Database=require("./db")
Database()

app.set("view engine","ejs")
// const publicDirectory =  path.join(__dirname , './public')
app.use(express.static("public"))
app.use(express.json())

const environment=process.env.ENV=="production"?
paypal.core.LiveEnvironment:paypal.core.SandboxEnvironment

const paypalClient=new paypal.core.PayPalHttpClient(
  new environment(
    process.env.CLIENT_ID,
    process.env.SECRET_ID
  )
)

// const Ecommerce=new Map([
//     [1,{price:100,name:"food"}],
//     [2,{price:600,name:"electronics"}]
// ])
const Ecommerce=require("./models/itemsSchema")

app.get("/",(req,res)=>{
  res.render("test.ejs")
})

app.post("/create-order",async(req,res)=>{
  const request=new paypal.orders.OrdersCreateRequest()

  const total=req.body.items.reduce((sum,item)=>{
    return sum+(Ecommerce.get(item.id).price * item.quantity)
  },0)
  // console.log(total)
  request.prefer("return=representation")
  request.requestBody({
    intent :"CAPTURE",
    purchase_units:[
      {
        amount:{
          currency_code:"USD",
          value:total,
          breakdown:{
            item_total:{
              currency_code:"USD",
              value:total,

            }
          }
        },
        items:req.body.items.map(item=>{
          const thing =Ecommerce.get(item.id)
          return{
            name:thing.name,
            unit_amount:{
              currency_code:"USD",
              value:thing.price
            },
            quantity:item.quantity
          }
        }),
      },
    ],
  })
  try{
  const order=await paypalClient.execute(request)
  res.json({id:order.result.id})
  // console.log(order)
  }catch(err){
    console.log(err)
  }
})


app.listen(3000,()=>{
   console.log("server is running on port 3000")
})