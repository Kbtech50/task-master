const express = require('express');

const router = express.Router();
const auth = require('../middlewares/auth');
const Task = require('../models/task')

var tasks=[];





router.get('/addtask', auth,  (req, res) => {
    res.render('addtask');

});

router.get('/logout', auth, (req, res)=>  {
    res.cookie('jwtt', '', {maxAge: 1});
    res.redirect(`/`);
    
});

router.get('/priority-h', auth, async(req, res) => {
    
    try{
        const tasks = await Task.find(
            
                    {$and:[
                        {priority: {$regex: /high/, $options:'xi'}},
                        {owner: req.user._id}
                    ]},
                    
                ).sort({createdAt: -1});
                res.render('taskmanager',{tasks} );
       console.log({ count: tasks.length, message: "Tasks searched Successfully"});
     
    }
    catch(err){
        console.log(err);
    }
    
});
router.get('/priority-m', auth, async(req, res) => {
    
    try{
        const tasks = await Task.find(
            
                    {$and:[
                        {priority: {$regex: /medium/, $options:'xi'}},
                        {owner: req.user._id}
                    ]},
                    
                ).sort({createdAt: -1});
                res.render('taskmanager', {tasks} );
                console.log({ count: tasks.length, message: "Tasks searched Successfully"});
    }
    catch(err){
        console.log(err);
    }
    
    });
router.get('/priority-l', auth, async(req, res) => {
    
    try{
        const tasks = await Task.find(
            
                    {$and:[
                        {priority: {$regex: /low/, $options:'xi'}},
                        {owner: req.user._id}
                    ]},
                    
                 ).sort({createdAt: -1});
                 res.render('taskmanager', {tasks} );
                 console.log({ count: tasks.length, message: "Tasks searched Successfully"});
    }
    catch(err){
        console.log(err);
    }
    
    });

    router.get('/duedate', auth, async(req, res) => {
    
        try{
            const tasks = await Task.find(
                {$and:[
                    {
                        deadline:{
                            $lte: 
                                new Date().toISOString()
                            }
                    },
                    {owner: req.user._id}
                ]},
               
            ).sort({createdAt: -1});
            res.render('taskmanager',{tasks} );
            console.log({tasks});
        }
        catch(err){
            console.log(err);
        }
        
    });


router.get('/search/', auth, async(req, res) => {

    try{
        const tasks = await Task.aggregate([ 
            {
                $search: {
                  index: "search-text",
                  text: {
                    query: req.query.q,
                    path: {
                      wildcard: "*"
                    }
                  }
                }
              
            },  
       
           {
            $match: {
                owner: req.user._id
            }
           } ,
           {
            $sort:{createdAt: -1}
        }
           
    ])
        
        res.render('taskmanager', {tasks});
       
        console.log({ count: tasks.length, message: "Tasks searched Successfully"});
    }
    catch(err){
        console.log(err);
    }
});



router.get('/edit/:id', auth, async(req, res) => {
    const taskid = req.params.id;

    try{
        const task = await Task.findOne({
            _id: taskid,
            owner: req.user._id

            });
        if(!task){
            return res.status(404).json({message: "Task not found"});
        }
        res.render( 'taskedit', {task});
    
    }
    catch(err){
        res.status(500).send({error: err});
    }
    

});


// CRUD tasks for authenticated users


//create a task
router.post('/', auth, async (req, res) => {
   try{
    // description, completed from req.body
    // owner : req.user._id
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    await task.save();
    res.redirect('/tasks/');
    console.log("Task Created Successfully");
   }
   catch(err){
    console.log(err);
   }
});



// get user tasks
router.get('/', auth, async (req, res, next) => {
    
    try{
        const tasks = await Task.find({
            owner: req.user._id
        }).sort({createdAt: -1});

        res.render('taskmanager', {tasks} );
        console.log({ count: tasks.length, message: "Tasks Fetched Successfully"});
    }
    catch(err){
        console.log(err);
    }
});



//fetch a task by id

router.get('/:id', auth , async (req,res)=>{
    const taskid = req.params.id;

    try{
        const task = await Task.findOne({
            _id: taskid,
            owner: req.user._id

            


        });
        if(!task){
            return res.status(404).json({message: "Task not found"});
        }
        res.render( 'taskdetails', {task});
    }
    catch(err){
        res.status(500).send({error: err});
    }
})

// update a task by id   -   description , completed
router.patch('/:id', auth , async (req,res)=>{
    const taskid = req.params.id;
    const updates = Object.keys(req.body);
    // {
    //     description : "new description",
    //     completed: true,
    //     owner : "asfasfasfasfasf"
    // }
    const allowedUpdates = ['deadline', 'priority'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
//if(!isValidOperation){
   //     return res.status(400).json({error: "Invalid Updates"});
   // }

    try{
      const task = await Task.findOne({
            _id: taskid,
            owner: req.user._id
      });

        if(!task){
            return res.status(404).json({message: "Task not found"});
        }

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

        res.redirect(`/tasks/${task.id}`);
       console.log("Task Updated Successfully");
            
        
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
})


// delete a task by id
router.delete('/:id', auth , async (req,res)=>{
    const taskid = req.params.id;

    try{
        const task = await Task.findOneAndDelete({
            _id: taskid,
            owner: req.user._id
        });
        if(!task){
            return res.status(404).json({message: "Task not found"});
        }
        res.status(200).json({redirect: '/tasks'});
    }
    catch(err){
        res.status(500).send({error: err});
    }
})






module.exports = router;