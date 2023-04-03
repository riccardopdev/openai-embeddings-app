// Make sure you have your OpenAI API Key value for OPENAI_API_KEY environment variable in an .env file. Otherwise replace below line of process.env.OPENAI_API_KEY with your OpenAI API Key value

/* -------------- APP STEPS --------------------
1) Read input data.csv: startReadingInputCSV()
2) Create batches of API requests: createAPIBatchRequest()
3) Submit the batches to OpenAI Embedding API: submitAPIBatchesRequest()
4) Write output data to output/data.csv: writeOutputCSV()
5) Write output data to output/data.json: writeOutputJSON
*/

// IMPORT PACKAGES
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const path = require('path');
const { parse, stringify } = require('csv');

const EMBEDDING_MODEL = 'text-embedding-ada-002';
const INPUT_DATA_CSV_FILE = path.join(__dirname, '/data/input/data.csv');
const OUTPUT_DATA_CSV_FILE = path.join(__dirname, '/data/output/data.csv');
const OUTPUT_DATA_JSON_FILE = path.join(__dirname, '/data/output/data.json');

// ----------- NOTE: OpenAI API request limit is 60 / min ----------- 
// ########### Adjust below two constant based on OpenAI API request limits if these change  ########### 
const NUM_OF_API_REQUEST_LIMIT = 60; //The number of API request to be submitted in one batch
const TIME_LIMIT_FOR_API_REQUEST = 61000; //The time interval limit between batches API requests

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const rowContentFromCSV = []; //Array to hold the content from each row of the input/data.csv file
const APIRequestBatches = []; //Array to hold the batches of API requests to be submitted to OpenAI API
const embeddingsRequests = []; //Array to hold Promises for openai embeddings requests
const embeddingsResults = []; //Array to hold results of text + embedding for each .csv row

const startReadingInputCSV = () => {
    //Start reading the source .csv file
    fs.createReadStream(INPUT_DATA_CSV_FILE)
        .pipe(parse({delimiter: ',', from_line: 2})) //We skip the first line as this is reserved for the "title"
        .on('data', (row) => {
            rowContentFromCSV.push(row[0]); //For each row we only retrieve content from the first column [0] and store its value in an array
        })
        .on('error', (err) => {
            console.log('Error while reading source .csv file.');
            console.log(err);
        })
        .on('end', () => {
            console.log('Finished reading .csv file.');
        })
        .on('close', () => {
            console.log('File closed.\n');
            createAPIBatchRequest(); //Create batches of request based on the number limit of allowed API requests
        });
}

//This function will split the content read from the .csv file in batches based on the number of OpenAI API request limit
const createAPIBatchRequest = () => {
    for (let i = 0; i < rowContentFromCSV.length; i++) {
        if (i % NUM_OF_API_REQUEST_LIMIT === 0) {
            //Create a new array within APIRequestBatches array the first time and every time we reach the API num limit
            APIRequestBatches[APIRequestBatches.length] = new Array();
        }

        //Add the content from one row to the last batch
        APIRequestBatches[APIRequestBatches.length - 1].push(rowContentFromCSV[i]);
    }

    //Once we have divided the content into batches we can start submitting each batch to the OpenAI API
    submitAPIBatchesRequest();
}

const submitAPIBatchesRequest = () => {
    console.log(`There are a total of ${APIRequestBatches.length} batch(es).`);
    console.log(`This will take at least ${((APIRequestBatches.length * TIME_LIMIT_FOR_API_REQUEST)/60000).toFixed(2)} minutes.\n`);

    //Loop through each batch
    for (let i = 0; i < APIRequestBatches.length; i++) {
        //Set a time interval between batches
        setTimeout(() => {
            console.log(`Submitting batch #${i+1} to OpenAI Embedding API.`);
            //Loop through the items of each batch
            for (let j = 0; j < APIRequestBatches[i].length; j++) {
                embeddingsRequests.push(getEmbeddings(APIRequestBatches[i][j])); //For each item push a new embedding request (Promise) into the embeddingsRequests array. Later we'll check when all promises have been fulfilled with Promise.all()
            }

            //Check if we are at the last batch
            if(i === APIRequestBatches.length - 1) {
                //If we are at the last batch check when all Promises have been fulfilled
                Promise.all(embeddingsRequests)
                    .then(() => {
                        console.log('Fulfilled all embeddings requests.\n');
                        //Create a new .csv and .json file with the embedding data
                        writeOutputCSV();
                        writeOutputJSON();
                    })
                    .catch((err) => {
                        console.log('Error while implementing embedding request.');
                        console.log(err);
                    });
            }
        }, i * TIME_LIMIT_FOR_API_REQUEST);
        
    }
}

//This function creates one single request to the OpenAI Embedding API
const getEmbeddings = async (inputText) => {
    const response = await openai.createEmbedding({
        input: inputText,
        model: EMBEDDING_MODEL
    });

    const newEntry = {
        text: inputText,
        embedding: response.data.data[0].embedding
    };

    //Store the embedding resuslts and text, which we will later use to write the data into a .csv and .json file
    embeddingsResults.push(newEntry);
}

const writeOutputCSV = () => {
    console.log('Writing data to new .csv...');

    stringify(embeddingsResults, {header: true}, (err, output) => {
        try {
            fs.writeFileSync(OUTPUT_DATA_CSV_FILE, output);
        } catch (error) {
            console.log('Error while writing .csv file.');
            console.log(error);
        }
        
    });
    console.log('Data writing to .csv completed.\n');
}

const writeOutputJSON = () => {
    console.log('Writing data to new .json...');
    const stringifiedJSON = JSON.stringify(embeddingsResults);

    try {
        fs.writeFile(OUTPUT_DATA_JSON_FILE, stringifiedJSON, 'utf-8', () => {
            console.log('Data writing to .json completed.\n');
        });
    } catch (error) {
        console.log('Error while writing .json file.');
        console.log(error);
    }
}

startReadingInputCSV();