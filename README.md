# NodeJS app for openai API Embeddings
This is a NodeJS app that uses the openai API to implement embeddings of input data.
The source data is provided by a local file (.csv), and the results are written into new .csv and .json files.

## What's embeddings
Openai's embeddings produces a vector representation of a given input that can then be used by machine learning models to measure the relatedness of text strings.  
An embedding is a vector (list) of floating point numbers. The distance between two vectors measures their relatedness and can be used to compare text strings.  

The scope of this project is to read data from the rows of a one column .csv file, then call the openai embeddings endpoint by providing the text input from each row and get the embeddings vector values.  
The final data with both the text and embeddings values is then written into new .csv and .json files.  

Embeddings can be used together with Prompt Engineering to provide the correct context when making requests to openai completion endpoints.  
  

## Setup
This project uses the openai API and requires an openai API Key.  
Openai uses the API Key to charge customers for each request to the API.  
To create an openai account and Key visit the openai [website](https://platform.openai.com/overview)  

Once you have an openai API Key create a .env file in the root project folder and insert a line as below:  
```OPENAI_API_KEY=your_openai_api_key_here```  

Replace the *your_openai_api_key_here* with the actual value of your Key.  

The original data for which we want to produce the embeddings values should be placed in a single column on the file located at /data/input/data.csv.  
The first row of the .csv file is reserved for the title and is not submitted for embeddings.  
The ouput data with text and embeddings values will be written into two files located at /data/output/data.csv and /data/output/data.json.  

Run the project with below command and check console output:  
```npm install```  
Then  
```npm run start```

## Resources
[Openai Documentaion](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings)  
[Openai API](https://platform.openai.com/docs/api-reference/embeddings)  
[Openai Cookbook](https://github.com/openai/openai-cookbook)  
[Openai Tutorial: QA from Website](https://platform.openai.com/docs/tutorials/web-qa-embeddings)  