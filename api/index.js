var Express = require('express');
var MongoClient = require('mongodb').MongoClient;
var cors = require('cors');
const multer = require('multer');

const upload = multer(); 
var app = Express();
app.use(cors());
app.use(Express.json());

var CONNECTION_URL = "mongodb+srv://linkeshwaran:linkeshwaran@cluster0.yheq5.mongodb.net/linkeshwaran";

var DATABASE_NAME = "todoapp";
var database, collection;

app.listen(5038, () => {
    MongoClient.connect(CONNECTION_URL, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        console.log("Connected to Database");
    });
});

app.get('/api/todoapp/GetNotes', (request, response) => {
    database.collection("todoappcollection").find({}).toArray((error, result) => {
        if(error) {
            return response.status
        }
        response.send(result);
    }
    );
});


app.post('/api/todoapp/AddNotes', upload.none(), (request, response) => {
    console.log("Incoming request body:", request.body);
    console.log("AddNotes" + request.body.newNotesStatus);
    
    collection = database.collection("todoappcollection");

    // Find the document with the highest `id`
    collection.find().sort({id: -1}).limit(1).toArray((error, docs) => {
        if (error) {
            return response.status(500).send("Error occurred while fetching highest ID.");
        }

        // Determine the new ID based on the highest existing ID
        let newId;
        if (docs.length > 0) {
            newId = (parseInt(docs[0].id) + 1).toString();
            console.log("New ID: " + newId);
        } else {
            newId = "1";  // Start with 1 if there are no documents
        }
        console.log("New ID-: " + newId);
        // Insert new note with the new ID
        collection.insertOne({
            id: newId,
            description: request.body.newNotes,
            status: request.body.newNotesStatus
        }, (err, result) => {
            if (err) {
                return response.status(500).send("Error occurred while adding note.");
            }
            response.send("Added Successfully with new ID.");
        });
    });
});

app.post('/api/todoapp/DeleteNotes', (request, response) => {
    collection = database.collection("todoappcollection");
    collection.deleteOne({id:request.query.id});
    response.send("Deleted Successfully");
});

app.post('/api/todoapp/UpdateNoteStatus', (request, response) => {
    collection = database.collection("todoappcollection");

    // Find the document with the highest `id`
    collection.find().sort({id: -1}).limit(1).toArray((error, docs) => {
        if (error) {
            return response.status(500).send("Error occurred while fetching highest ID.");
        }

        // Determine the new ID based on the highest existing ID
        let newId;
        if (docs.length > 0) {
            newId = (parseInt(docs[0].id) + 1).toString();
        } else {
            newId = "1";  // Start with 1 if there are no documents
        }

        // Update the note's ID and status
        collection.updateOne(
            { id: request.query.id },
            {
                $set: {
                    id: newId, // Assign the new ID
                    status: request.body.status // Update the status
                }
            },
            (err, result) => {
                if (err) {
                    return response.status(500).send("Error occurred during update.");
                }
                response.send("Updated Successfully with new ID.");
            }
        );
    });
});




