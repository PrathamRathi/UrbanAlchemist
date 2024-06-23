# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0
"""
Shows how to run a multimodal prompt with Anthropic Claude (on demand) and InvokeModel.
"""


import json
import logging
import base64
import boto3
import re

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
            # anthropic.claude-3-5-sonnet-20240620-v1:0
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": max_tokens,
            "messages": messages
        }
    )

    response = bedrock_runtime.invoke_model(
        body=body, modelId=model_id)
    response_body = json.loads(response.get('body').read())

    return response_body

def get_base64_encoded_image(image_path):
    with open(image_path, "rb") as image_file:
        binary_data = image_file.read()
        base_64_encoded_data = base64.b64encode(binary_data)
        base64_string = base_64_encoded_data.decode('utf-8')
        return base64_string


def claude_grade_report_prompt():
    """
    Entrypoint for Anthropic Claude multimodal prompt.
    """
    try:

        # boto3.setup_default_session(
        #     profile_name='AdministratorAccess-905418001332')

        bedrock_runtime = boto3.client(service_name='bedrock-runtime')


        model_id = 'anthropic.claude-3-5-sonnet-20240620-v1:0'
        max_tokens = 1000
        input_image = "traffic.jpeg"
        input_text = """Prompt: You are an environmental assessment expert specializing in urban fuel emissions. Your task is to assign a grade letter for the current fuel emissions in a specific area. Here are the details:
                    - Location: Center coordinates (lat, lng)
                    - Traffic score: {} out of 100 (where 0 is lowest traffic and 100 is highest)

                    Consider the following factors in your assessment:
                    1. The specific region and its characteristics
                    2. Population density of the area
                    3. Current traffic patterns
                    4. Local environmental regulations
                    5. Availability of public transportation
                    6. Green initiatives in place

                Based on these factors, assign a grade letter from the following options: A, B, C, D, or F, where A is excellent (low emissions) and F is poor (high emissions).

                Provide your grade in the following format exactly:
                ###{grade_letter}

                Then, present your reason for the grade in the <Reason> tags.

                For example:
                ###B
                <Reason>
                The area shows moderate traffic levels and has implemented some effective public transportation options. However, there's room for improvement in green initiatives and stricter environmental regulations.
                </Reason>

                Ensure your response contains the grade in the specified format, followed by the reasoning within the <Reason> tags."""

        message = {"role": "user",
                    "content": [
                           {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": get_base64_encoded_image(input_image)}},
                        {"type": "text", "text": input_text}
                    ]}

        messages = [message]

        response = run_multi_modal_prompt(
            bedrock_runtime, model_id, messages, max_tokens)

        grade_pattern = re.compile(r'###([A-F])')
        match = grade_pattern.search(response)

        if match:
            grade = match.group(1)
            print("Grade:", grade)
        else:
            print("No valid grade found in the output: ", response)

        # Extract the reasoning
        reason_pattern = re.compile(r'<Reason>(.*?)</Reason>', re.DOTALL)
        reason_match = reason_pattern.search(response)

        if reason_match:
            reason = reason_match.group(1).strip()
            print("Reason:", reason)
        else:
            print("No reasoning found in the output.")
        print(json.dumps(response, indent=4))

    except ClientError as err:
        message = err.response["Error"]["Message"]
        logger.error("A client error occurred: %s", message)
        print("A client error occured: " +
                format(message))
                
    return [grade, reason]

def claude_street_view_prompt():
    """
    Entrypoint for Anthropic Claude multimodal prompt.
    """
    try:

        # boto3.setup_default_session(
        #     profile_name='AdministratorAccess-905418001332')

        bedrock_runtime = boto3.client(service_name='bedrock-runtime')


        model_id = 'anthropic.claude-3-5-sonnet-20240620-v1:0'
        max_tokens = 1000
        input_image = ["traffic.jpeg", "street_view_img0", "street_view_img1", "street_view_img2"]
        input_text = """You are an expert in public transportation and green urban planning with a keen eye for detail. You've been tasked with analyzing traffic patterns and proposing infrastructure improvements to a government official. You will be provided with the following:
            1. A traffic map of the region (latitude: lat, longitude: lng) where red signifies higher traffic and green signifies lower traffic.
            2. Three street view images of areas with the highest fuel consumption.
            Analyze these images carefully. Before providing your answer, think through your analysis step-by-step in <thinking> tags. Then, present your pitch for infrastructure improvements in <answer> tags, focusing on where and how to enhance the area's transportation system.
            Your response should be concise yet compelling, tailored for a government official. Consider factors such as traffic flow, public transit options, and potential for green initiatives."""

        message = {"role": "user",
                    "content": [
                           {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": get_base64_encoded_image(input_image[0])}},
                           {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": get_base64_encoded_image(input_image[1])}},
                           {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": get_base64_encoded_image(input_image[2])}},
                           {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": get_base64_encoded_image(input_image[3])}},
                        {"type": "text", "text": input_text}
                    ]}

        messages = [message]

        response = run_multi_modal_prompt(
            bedrock_runtime, model_id, messages, max_tokens)

        answer_pattern = re.compile(r'<answer>(.*?)</answer>', re.DOTALL)
        match = answer_pattern.search(response)

        if match:
            answer_content = match.group(1)
            print(answer_content)
        else:
            print("No <answer> tags found in the output: ", answer_content)
        print(json.dumps(response, indent=4))

    except ClientError as err:
        message = err.response["Error"]["Message"]
        logger.error("A client error occurred: %s", message)
        print("A client error occured: " +
                format(message))
    return answer_content


def main():
    """
    Entrypoint for Anthropic Claude multimodal prompt example.
    """

    try:

        # boto3.setup_default_session(
        #     profile_name='AdministratorAccess-905418001332')

        bedrock_runtime = boto3.client(service_name='bedrock-runtime')


        model_id = 'anthropic.claude-3-5-sonnet-20240620-v1:0'
        max_tokens = 1000
        input_image = "traffic.jpeg"
        input_text = "how can you add public transport to reduce the traffic seen in this image? be specific with where you will add changes"


        # Read reference image from file and encode as base64 strings.
        #    with open(input_image, "rb") as image_file:
        #        content_image = base64.b64encode(image_file.read()).decode('utf8')

        message = {"role": "user",
                    "content": [
                        #    {"type": "image", "source": {"type": "base64",
                        #        "media_type": "image/jpeg", "data": content_image}},
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
    claude_street_view_prompt()
    claude_grade_report_prompt()
