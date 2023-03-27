// Make sure you have your OpenAI API Key value for OPENAI_API_KEY environment variable in an .env file. Otherwise replace below line of process.env.OPENAI_API_KEY with your OpenAI API Key value

// IMPORT PACKAGES
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const { parse, stringify } = require('csv');

const INPUT_DATA_CSV_FILE = __dirname + '/data/input/data.csv';
const OUTPUT_DATA_CSV_FILE = __dirname + '/data/output/data.csv';
const OUTPUT_DATA_JSON_FILE = __dirname + '/data/output/data.json';
const EMBEDDING_MODEL = 'text-embedding-ada-002';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const embeddingsResults = []; //Array to hold results of text + embedding for each .csv row
const embeddingsRequests = []; //Array to hold Promises for openai embeddings requests

//Start reading the source .csv file
fs.createReadStream(INPUT_DATA_CSV_FILE)
    .pipe(parse({delimiter: ',', from_line: 2}))
    .on('data', (row) => {
        //console.log('Reading one row.');
        embeddingsRequests.push(getEmbeddings(row[0])); //For each .csv row we push a new embedding request (Promise) into the array. Later we'll load all requests with Promise.all()
    })
    .on('error', (err) => {
        console.log(err);
    })
    .on('end', () => {
        console.log('Finished reading file.');
    })
    .on('close', () => {
        console.log('File closed.');

        //Start all embedding requests to openai API
        Promise.all(embeddingsRequests)
            .then(() => {
                console.log('Fulfilled all embeddings requests');
                //Create a new .csv and .json file with the embedding data
                writeOutputCSV();
                writeOutputJSON();
            })
            .catch((err) => {
                console.log('Error while implementing embedding request.');
                console.log(err);
            });
    });

const getEmbeddings = async (inputText) => {
    const response = await openai.createEmbedding({
        input: inputText,
        model: EMBEDDING_MODEL
    });

    const newEntry = {
        text: inputText,
        embedding: response.data.data[0].embedding
    };

    embeddingsResults.push(newEntry);
}

const writeOutputCSV = () => {
    console.log('Writing data to new csv...');
    stringify(embeddingsResults, {header: true}, (err, output) => {
        try {
            fs.writeFileSync(OUTPUT_DATA_CSV_FILE, output);
        } catch (error) {
            console.log(error);
        }
        
    });
    console.log('Data writing to CSV completed.');
}

const writeOutputJSON = () => {
    console.log('Writing data to new JSON...');
    const stringifiedJSON = JSON.stringify(embeddingsResults);

    fs.writeFile(OUTPUT_DATA_JSON_FILE, stringifiedJSON, 'utf-8', () => {
        console.log('Data writing to JSON completed.');
    });
}