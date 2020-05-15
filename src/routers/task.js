const express = require('express');
const Task = require('../modal/task')
const auth = require('../middleware/auth')
const router = new express.Router();

router.post('/task', auth, async (req, res) => {

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        const result = await task.save();
        res.status(201).send(result);
    } catch (e) {
        res.status(400).send(e);
    }


})

// Get  /tasks?completed=false
// Get /tasks?limit=10&skip=0
// Get /tasks?sortBy=createdAt:asc    -----   asc for ascending or desc for deacending
router.get('/task', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }


    try {
        // const result = await Task.find({ owner: req.user._id });
        // res.send(result);
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e);
    }

})

router.get('/task/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const result = await Task.findOne({ _id, owner: req.user._id });
        if (!result) {
            return res.status(404).send("Task Not Found");
        }
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }

})

router.patch('/task/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const isAllowedtoUpdate = ["description", "completed"];
    const isValidation = updates.every(update => isAllowedtoUpdate.includes(update));

    if (!isValidation) {
        return res.status(400).send({ error: "Invalid Operator" });
    }
    try {

        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!task) {
            return res.status(404).send("Task Not Found");
        }
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
})

router.delete('/task/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).send("Task Not Found")
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
})


module.exports = router;