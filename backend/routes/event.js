import Event from "../models/Event.js";
import auth from "../middleware/auth.js";

import express from "express";

const router = express.Router();



router.post('/' , auth,async(req , res )=>{
    try{
        const{title ,description,dateTime,imageUrl,notifyBeforeMins} = req.body;
        const event = await Event.create({
            user:req.userId,
            title,
            description, 
            dateTime,
            imageUrl,
            notifyBeforeMins,
        });
        res.status(201).json(event);

    }catch(err){
        res.status(500).json({message:'Failed to create event',error:err.message})
    }
} )


router.get('/',auth,async(req,res)=>{
    try{
        const event = await Event.find({user:req.userId}).sort({dateTime:1})
        res.json(event);
        }catch(err){
            res.status(500).json({message:'Failed to fetch events',error:err.message})
        }
})



router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true , runValidators: true}
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});


router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedEvent = await Event.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!deletedEvent)
      return res.status(404).json({ message: "Event not found or not yours" });

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;