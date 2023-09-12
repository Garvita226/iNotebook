const express = require('express')
const Notes = require('../models/Notes');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// ROUTE 1 : Fetch all notes using : GET "/api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);

    } catch (error) {
        console.error(error.message)
        res.status(500).send('Internal server error');
    }
})

// ROUTE 2 : Add a note using : POST "/api/notes/addnote". Login required
router.post('/addnote', fetchuser,

    // Validating fields
    [body('title', 'Title must be atleast 3 characters').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 })],

    // Callback function
    async (req, res) => {
        try {
            const {title, description, tag} = req.body;

            // If there are errors, return Bad request and errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Create a new note using details entered in the body of request
            const note = new Notes({
                user : req.user.id, title, description, tag
            })

            // Save the note in Notes collection
            const savedNote = await note.save();

            // Send the note as response
            res.json(savedNote);

        } catch (error) {
            console.error(error.message)
            res.status(500).send('Internal server error');
        }

    })

    // ROUTE 3 : Update an existing note using : PUT "/api/notes/updatenote". Login required
    router.put('/updatenote/:id', fetchuser, async (req, res) => {
        try {
            const {title, description, tag} = req.body;

            // Create a newNote object
            const newNote = {};
            if(title) {newNote.title = title}
            if(description) {newNote.description = description}
            if(tag) {newNote.tag = tag}

            // Find the note to be updated and update it
            let note = await Notes.findById(req.params.id);
            if(!note) {
                return res.status(404).send("Not Found")
            }

            // Allow the updation only if user owns the note
            if(note.user.toString() !== req.user.id) {
                return res.status(401).send('Not Allowed')
            }

            note = await Notes.findByIdAndUpdate(req.params.id, {$set : newNote}, {new : true})
            res.json({note});

        } catch (error) {
            console.error(error.message)
            res.status(500).send('Internal server error');
        }
    })

    // ROUTE 4 : Delete an existing note using : DELETE "/api/notes/deletenote". Login required
    router.delete('/deletenote/:id', fetchuser, async (req, res) => {
        try {

            // Find the note to be deleted and delete it
            let note = await Notes.findById(req.params.id);
            if(!note) {
                return res.status(404).send("Not Found")
            }

            // Allow the deletion only if user owns the note
            if(note.user.toString() !== req.user.id) {
                return res.status(401).send('Not Allowed')
            }

            note = await Notes.findByIdAndDelete(req.params.id)
            res.json({Success : "The note has been deleted", note});

        } catch (error) {
            console.error(error.message)
            res.status(500).send('Internal server error');
        }
    })

module.exports = router;