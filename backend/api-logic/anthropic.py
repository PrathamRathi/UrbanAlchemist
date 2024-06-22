# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0
"""
Shows how to run a multimodal prompt with Anthropic Claude (on demand) and InvokeModel.
"""


import json
import logging
import base64
import boto3


from botocore.exceptions import ClientError




logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)




def run_multi_modal_prompt(bedrock_runtime, model_id, messages, max_tokens):
   """
   Invokes a model with a multimodal prompt.
   Args:
       bedrock_runtime: The Amazon Bedrock boto3 client.
       model_id (str): The model ID to use.
       messages (JSON) : The messages to send to the model.
       max_tokens (int) : The maximum  number of tokens to generate.
   Returns:
       None.
   """






   body = json.dumps(
       {
           "anthropic_version": "bedrock-2023-05-31", #anthropic.claude-3-5-sonnet-20240620-v1:0
           "max_tokens": max_tokens,
            "messages": messages
       }
   )


   response = bedrock_runtime.invoke_model(
       body=body, modelId=model_id)
   response_body = json.loads(response.get('body').read())


   return response_body




def main():
   """
   Entrypoint for Anthropic Claude multimodal prompt example.
   """


   try:


       bedrock_runtime = boto3.client(service_name='bedrock-runtime')


       model_id = 'anthropic.claude-3-5-sonnet-20240620-v1:0'
       max_tokens = 1000
       input_image = "traffic.jpeg"
       input_text = "What's in this image?"


       # Read reference image from file and encode as base64 strings.
       with open(input_image, "rb") as image_file:
           content_image = base64.b64encode(image_file.read()).decode('utf8')


       message = {"role": "user",
            "content": [
               {"type": "image", "source": {"type": "base64",
                   "media_type": "image/jpeg", "data": content_image}},
               {"type": "text", "text": input_text}
               ]}


  
       messages = [message]


       response = run_multi_modal_prompt(
           bedrock_runtime, model_id, messages, max_tokens)
       print(json.dumps(response, indent=4))


   except ClientError as err:
       message = err.response["Error"]["Message"]
       logger.error("A client error occurred: %s", message)
       print("A client error occured: " +
             format(message))




if __name__ == "__main__":
   main()
