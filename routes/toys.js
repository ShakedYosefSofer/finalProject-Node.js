const express = require("express");
const { auth } = require("../middlewares/auth");
const { validateToy, ToyModel } = require("../models/toyModel");
const router = express.Router();





// localhost:3001/toys
router.get("/",async(req,res) => {
    const limit = Math.min(req.query.limit,10) || 10;
    const skip = req.query.skip || 1;
    const sort = req.query.sort || "_id";
    const reverse = req.query.reverse == "yes" ? 1 : -1; 
  
    try{
      const data = await ToyModel
      .find({})
      .limit(limit)
      .skip(limit * (skip - 1)) 
      .sort({[sort]:reverse})
      res.json(data); 

    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })

  
  


  // toys/search?s=

  router.get("/search",async(req,res) => {
    try{
      const searchQ = req.query.s;
      const searchExp = new RegExp(searchQ,"i")
      const data = await ToyModel.find({$or:[{name:searchExp},{category:searchExp}]})

      .skip(0)
      res.json(data);

    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })
 
 

  // http://localhost:3001/toys/category/doll

  router.get('/category/:catname', async (req, res) => {
    const limit = Math.min(req.query.limit,20) || 10;
    const skip = req.query.skip || 0;
    const sort = req.query.sort || "_id";
    const reverse = req.query.reverse == "yes" ? 1 : -1; 
    const catname = req.params.catname; 

    try{
        
        const data = await ToyModel.find({category:catname})
      .limit(limit)
      
      .skip(limit * skip ) 
      .sort({[sort]:reverse})
      res.json(data); 

    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })




  router.post("/",auth,async(req,res) => {
    const validBody = validateToy(req.body);
    if(validBody.error){
      return res.status(400).json(validBody.error.details)
    }
    try{
      //add token
      const toys = new ToyModel(req.body);
      toys.toy_id = req.tokenData._id;
      await toys.save();
      res.status(201).json(toys);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })
  




  router.put("/:id",auth,async(req,res) => {
    const validBody = validateToy(req.body);
    if(validBody.error){
      return res.status(400).json(validBody.error.details)
    }
    try{
      const id = req.params.id;
      const data = await ToyModel.updateOne({_id:id,user_id:req.tokenData._id},req.body);
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })
  
  


//delete list 

  router.delete("/:id",auth,async(req,res) => {

    try{
      const id = req.params.id;
      let data;
      if(req.tokenData.role == "admin" || req.tokenData.role == "superadmin"){
        data = await ToyModel.deleteOne({_id:id});
      }
      else{
      data = await ToyModel.deleteOne({_id:id,user_id:req.tokenData._id});
      }
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
  
    }
  })

  // http://localhost:3001/toys/price
  // all price
  // price?min=20
  // price?max=100
  router.get("/price",async(req,res) => {
    const min = req.query.min || 0;
    const max = req.query.max || Infinity;
    try{
      const data = await ToyModel.find({price:{$gte:min,$lte:max}}).limit(10);
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })

  // http://localhost:3001/toys/count
  // count: 55
  // page: 6
  router.get("/count",async(req,res) => {
    try{
      const limit = req.query.limit || 10;
      const count = await ToyModel.countDocuments({});
      res.json({count,pages:Math.ceil(count/limit)});
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })

  //show single toy from id 
router.get("/single/:id",async(req,res) => {
  try{
      const id = req.params.id;
      let data = await ToyModel.findOne({_id:id});
      res.json(data);
  }
  catch(err){
      console.log(err);
      res.status(502).json({err})
    }

  })


// export default
module.exports = router;


