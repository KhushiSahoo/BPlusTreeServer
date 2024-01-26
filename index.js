import express from'express';
import bodyParser from'body-parser';
import  {BPlusTree}  from './bplus3.js';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

// Express setup
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
//app.use(express.json()); 

app.use(bodyParser.json());

// Create a new B+ tree with a specified order
const bPlusTree = new BPlusTree(3); // Adjust the order as needed

// Express endpoint to insert a key-value pair into the B+ tree
app.get('/', (req, res) => {
  res.send('Welcome to bplus server');
})
app.post('/insert', async(req, res) => {
  const { key, value } = req.body;

  // Validate input
  if (typeof key === 'undefined' || typeof value === 'undefined') {
    return res.status(400).json({ error: 'Both key and value are required.' });
  }
 // Insert into the B+ tree
  const start = performance.now();

  await bPlusTree.insert(key, value);
  
  const end = performance.now();
  //display tree
  bPlusTree.show();
  //display performance
  console.log(`Execution time insert: ${end - start} ms`);

  res.json({ success: true,
  time : end-start });
});


app.post('/search', async(req, res) => {
  console.log(req.body);
  const {key} = req.body;
  // Search in the B+ tree

  const start = performance.now();
  const result = await bPlusTree.retrieve(key);
  const end = performance.now();
  
  console.log(`Execution time search: ${end - start} ms`);
  console.log(result);

  if (result !== null) {
    res.json({ key, value: result , time: end-start});
  } else {
    res.status(404).json({ error: 'Key not found.' , time:end-start});
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
