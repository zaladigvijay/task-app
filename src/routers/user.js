const { response } = require('express');
const express = require('express')
const User = require('../models/user')
const router = new express.Router();
const auth=require('../middlewar/authentication')
const multer = require('multer')
const sharp=require('sharp')

const upload = multer({
  
    limits: {
        fieldSize:1000000
    },
    fileFilter(req, file, cb){
        if (!file.originalname.endsWith('.png')) {
            cb(new Error("please Upload Pdf file"))
        }
        cb(undefined,true)
        
    }
})

router.post('/user/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error:error.message})    
})

router.post('/user', (req, res) => {

    const newuser = new User(req.body)
    newuser.save().then(() => {
        res.status(201)
      newuser.generateAuthToken().then((token)=>{
            res.send({newuser,token});
        })

       
    }).catch((e) => {
        res.status(400)
        res.send(e)
    })

});

router.post('/user/login', async (req, res) => {
    try {        
        const user = await User.finByCredintial(req.body.email, req.body.password)
        const token = await user.generateAuthToken();
        res.send({ user, token });
        
    } catch (e) {
       
       res.status(400).send(e)
    }
    
})



router.post('/user/logout', auth, async (req, res) => {
    console.log("inside log")
    try {
        
        req.user.tokens = req.user.tokens.filter((value) => { return value.token !== req.token })
        await req.user.save();
        res.status(200).send();

    } catch (error) {
        res.status(500).send()
    }
})

router.post('/user/logoutall', auth, async (req, res) => {
    console.log("inside log")
    try {
        
        req.user.tokens =[]
        
        await req.user.save();
        res.status(200).send();

    } catch (error) {
        res.status(500).send()
    }
})





router.get('/user/me',auth, (req, res) => {
    res.send(req.user)
});

router.get('/user/:id',auth, (req,res) => {
    const _id = req.params.id 
    User.findById(_id).then((user) => {
        if(!user) {
            return res.status(404).send();
        }
        res.send(user);
    }).catch((e) => {
        res.status(500).send()
    })
})


router.patch('/user/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {

        const user = req.user    
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    
        if (!user) {
            return res.status(404).send()
        }
        updates.forEach((update) => user[update] = req.body[update])
        await user.save();
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
});

router.delete('/user/me',auth, async (req, res) => {
    try
    {
        // const deletedItem = await User.findByIdAndDelete(req.user._id);
        // if (!deletedItem) {
        //     return res.status(404).send();
        // }
        await req.user.remove()
        res.send(req.user)
    }
    catch (e) {
        res.status(500).send(e);
    }
})

module.exports = router;
