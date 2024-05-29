import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import { log } from 'console';
import { generateKey } from 'crypto';


const app = express();
app.use(cors())
app.use(bodyParser.json())

app.get("/test", (req, resp) => {
    resp.send(`<p>Hello server!</p>`);
})


app.get('/getTasks', (req, resp) =>{

  const data = JSON.parse(fs.readFileSync('./tasks.json').toString());

  resp.send(data)
  console.log('Data req fullfiled');
})

//generate unique task Id
function generateId(){
  const data = JSON.parse(fs.readFileSync('./tasks.json').toString());
  let id = 0;

for(let c = 0; c<data.length; c++){
  for(let i = 0; i< data.length; i++){
    if( id == data[i].id){
      id++;
    }


}
}
return id;
}



app.post("/taskDone", async (req, res) =>{
  
  try{
    
    const id = req.body;
    const tempID = id.id;
    console.log("task "+tempID +" completed");


    const data = JSON.parse(fs.readFileSync('./tasks.json').toString());
    
    for(let i = 0; i<data.length; i++){
      if(data[i].id == tempID){
        data[i].status = "finished";
      }
    }
    const formattedJson = JSON.stringify(data, null, 2);

    // await fs.writeFileSync('./tasks.json', JSON.stringify(data).toString());
    await fs.writeFileSync('./tasks.json', formattedJson);
// res.send instead of res.json test
    res.send('task status changed');


  }catch(error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

// taskDelete
app.post("/taskDelete", async (req, res) =>{
  
  try{
    
    const id = req.body;
    const tempID = id.id;



    const data = JSON.parse(fs.readFileSync('./tasks.json').toString());
    for(let i = 0; i<data.length; i++){
      if(data[i].id == tempID){
        data.splice(i, 1);
        console.log("task "+tempID +" deleted");
        break;
      }
    }

    await fs.writeFileSync('./tasks.json', JSON.stringify(data).toString());
   
// res.send instead of res.json test
    res.send('task status changed');


  }catch(error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})






app.post("/addTask", async (req, res) => {
    console.log('post received');
    try {
      const { descriere, from, to } = req.body;
        // console.log('aparte:'+descriere, from, to);
        const tempId = generateId();

        const data = JSON.parse(fs.readFileSync('./tasks.json').toString());

      // print old JSON
      // console.log('old data:');
      // console.log(data);
      console.log('Task added:');
      console.log(req.body);

      data.push({id: tempId, descriere: descriere, from: from, to: to, status:'unfinished'})
      const formattedJson = JSON.stringify(data, null, 2);
      


  // New JSON print
      // console.log('new JSON:');
      // console.log(data);
      

      // await fs.writeFileSync('./tasks.json', JSON.stringify(data).toString());
      await fs.writeFileSync('./tasks.json', formattedJson);



  
      res.json({ message: 'Task added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    
  });



app.listen(5000, ()=> console.log('App is running.'))