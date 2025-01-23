var Express = require('express');
var MongoClient = require('mongodb').MongoClient;
var cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

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

app.get('/api/todoapp/GetNotes/:userId', (request, response) => {
    const userId = request.params.userId; // Get user ID from request parameters
    database.collection("todoappcollection").find({ userId }).toArray((error, result) => {
        if (error) {
            return response.status(500).send("Error fetching notes.");
        }
        response.send(result);
    });
});

app.post('/api/todoapp/AddNotes', upload.none(), (request, response) => {
    console.log("Incoming request body:", request.body);
    console.log("AddNotes" + request.body.newNotesStatus);
    
    collection = database.collection("todoappcollection");
    const userId = request.body.userId
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
            status: request.body.newNotesStatus,
            userId: userId
        }, (err, result) => {
            if (err) {
                return response.status(500).send("Error occurred while adding note.");
            }
            response.send("Added Successfully with new ID.");
        });
    });
});

app.post('/api/todoapp/DeleteNotes', (request, response) => {
    const { id, userId } = request.query; // Get ID and user ID from query
    collection = database.collection("todoappcollection");

    // Ensure you are matching by userId as well to avoid deleting other users' notes
    collection.deleteOne({ id: id, userId: userId }, (err, result) => {
        if (err) {
            return response.status(500).send("Error occurred while deleting note.");
        }
        
        if (result.deletedCount === 0) {
            return response.status(404).send("Note not found or does not belong to the user.");
        }
        
        response.send("Deleted Successfully");
    });
});

app.post('/api/todoapp/UpdateNoteStatus', (request, response) => {
    const { id } = request.query; // Get ID and user ID from query
    const { userId } = request.body;
    collection = database.collection("todoappcollection");
console.log("UpdateNoteStatus" + request.query.id+ request.body.userId+ request.body.status);
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
    collection.updateOne(
        { id, userId }, // Ensure the userId matches
        {
            $set: {
                id: newId,
                status: request.body.status // Update the status
            }
        },
        (err, result) => {
            if (err) {
                return response.status(500).send("Error occurred during update.");
            }
            response.send("Updated Successfully.");
        }
    );
});
});



app.post('/api/users', async (request, response) => {
    const email = request.body.email;
    collection = database.collection("users");

    try {
        // Try to find the user by email
        let user = await collection.findOne({ email });

        if (!user) {
            // If user does not exist, insert it with a unique ID
            const uniqueId = uuidv4(); // Generate a new UUID
            const result = await collection.insertOne({ email, userId: uniqueId });

            // The user object now needs to be constructed, as result.ops is no longer available
            user = {
                _id: result.insertedId,
                email,
                userId: uniqueId,
            };
            console.log("User added with custom ID:", user);
        }

        response.json({ userId: user.userId });
    } catch (error) {
        console.error("Error while checking/creating user:", error);
        response.status(500).send("Internal Server Error");
    }
});




