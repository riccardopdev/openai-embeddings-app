# NodeJS app for openai API Embeddings
This is a NodeJS app that uses the openai API to implement embeddings by reading data from a local file (.csv), calling the openai embeddings API and writing the results to a new .csv file.  
  
Openai’s text embeddings measure the relatedness of text strings.  
An embedding is a vector (list) of floating point numbers. The distance between two vectors measures their relatedness.  
This is can then be used to compare text strings.  

The scope of this project is to read data from the rows of a one column .csv file, then call the openai embeddings endpoint and provide the text input from each row to get the embeddings vector values.  
The final data with both the text and embeddings values is then written into a new .csv file which can be used to provide the correct context when making requests to openai completion endpoints.  
  
## Resources
[Openai Documentaion](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings)  
[Openai API](https://platform.openai.com/docs/api-reference/embeddings)  
[Openai Cookbook](https://github.com/openai/openai-cookbook)  
[Openai Tutorial: QA from Website](https://platform.openai.com/docs/tutorials/web-qa-embeddings)  

## Setup
The original data for which we want to produce the embeddings values should be placed in a single column on the file located at /data/input/data.csv.  
The ouput data with text and embeddings values will be written in a file located at /data/output/data.csv.  

Run the project with below command and check console output:  
```npm install```  
Then  
```npm run start```