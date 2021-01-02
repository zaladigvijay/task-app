const express = require('express')
const Task = require('../models/task')
const auth=require('../middlewar/authentication')
const router = new express.Router();

router.post('/task',auth, (req, res) => {

    const newtask = new Task({ ...req.body, owner: req.user._id })
    newtask.save().then(() => {
        res.status(201).send(newtask);
    }).catch((e) => {
        res.status(400).send(e)
    })

});

router.get('/task',auth, (req, res) => {
    Task.find({owner:req.user._id}).then((task) => {
        res.send(task)
    }).catch((e) => {
        res.status(500).send(e)
    })
});

router.get('/task/:id',auth, async (req, res) => {
    const _id = req.params.id 
    try {
        // const task = await Task.findById(_id)?
        const task = await Task.findOne({ _id, owner: req.user._id })

        if(!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send()
    }   
})

router.patch('/task/:id', async (req, res) => {
    const keys = Object.keys(req.body);
    const updateallow = ['description', 'completed']
    
    const allowtoupdate = keys.every((key) => updateallow.includes(key))
    if (!allowtoupdate) {
        return res.status(400).send({error:"Invalid Update"})
    }

    try {

        const task = Task.findById(req.params.id);          
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!task) {
            res.status(400).send()
        }
        keys.forEach((key) => task[key = req, body[key]])
        await task.save();
        res.send(task)
    }
    catch (e) {
        res.status(400).send(e)
    }
});


router.delete('/task/:id', async (req, res) => {
    try
    {
        const deletedItem = await Task.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).send();
        }
        res.send(deletedItem)
    }
    catch (e) {
        res.status(500).send(e);
    }
})

module.exports=router