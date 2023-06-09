# NodeJS app for OpenAI API Embeddings
This is a NodeJS app that uses the OpenAI API to implement embedding of input data. The source data is provided by a local file (.csv), and the results are written into new .csv and .json files.  

## What are embeddings?
OpenAI's embeddings produce a vector representation of a given input text that can then be used by machine learning models to measure the similarity between text strings. An embedding is a vector (list) of floating-point numbers. The distance between two vectors measures their similarity and can be used to compare text strings.  

The scope of this project is to read data from the rows of a one-column .csv file, then call the OpenAI embeddings endpoint by providing the text input from each row and get the embeddings vector values. The final data with both the text and embeddings values is then written into new .csv and .json files.  

**Note:** OpenAI currently has a limit of 60 API requests per minute.  
This node application creates batches of API requests to be submitted at different interval of time.  
The number of API requests for each batch is set with the constant: ```NUM_OF_API_REQUEST_LIMIT```  
The time interval between each submitted batch is set with the constant: ```TIME_LIMIT_FOR_API_REQUEST```  

**Embeddings** can be used together with **Prompt Engineering** to provide the appropriate context when making requests to the OpenAI completion endpoints.  
For more information about Prompt Engineering read this [article](https://github.com/openai/openai-cookbook/blob/main/examples/Question_answering_using_embeddings.ipynb?utm_source=frontendfresh&utm_medium=email&utm_campaign=customizing-an-openai-chatbot-with-embeddings) from the openai-cookbook.  

## Setup
This project uses the OpenAI API and requires an **OpenAI API Key**. OpenAI uses the API Key to charge customers for each request to the API. To create an OpenAI account and Key, visit the OpenAI [website](https://platform.openai.com/overview).  

Once you have an OpenAI API Key, create a **.env** file in the project's root folder and insert a line as below example:

```OPENAI_API_KEY=your_openai_api_key_here```  

Replace the **your_openai_api_key_here** with the actual value of your Key.  

The original data for which we want to produce the embeddings values should be placed in a single column on the file located at **/data/input/data.csv**. The first row of the .csv file is reserved for the title and is not submitted for embeddings. The output data with text and embeddings values will be written into two files located at **/data/output/data.csv** and **/data/output/data.json**.  

Run the project with below command and check the console output:  

```npm install```  
```npm run start```  

## Resources
[OpenAI Documentaion](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings)  
[OpenAI API](https://platform.openai.com/docs/api-reference/embeddings)  
[OpenAI Cookbook](https://github.com/openai/openai-cookbook)  
[OpenAI Tutorial: QA from Website](https://platform.openai.com/docs/tutorials/web-qa-embeddings)  