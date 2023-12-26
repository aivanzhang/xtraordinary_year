import logging
import boto3
from botocore.exceptions import ClientError
import requests
from dotenv import load_dotenv

load_dotenv(override=True)


def create_presigned_url_expanded(
    client_method_name, method_parameters=None, expiration=3600, http_method=None
):
    """Generate a presigned URL to invoke an S3.Client method

    Not all the client methods provided in the AWS Python SDK are supported.

    :param client_method_name: Name of the S3.Client method, e.g., 'list_buckets'
    :param method_parameters: Dictionary of parameters to send to the method
    :param expiration: Time in seconds for the presigned URL to remain valid
    :param http_method: HTTP method to use (GET, etc.)
    :return: Presigned URL as string. If error, returns None.
    """
    s3_client = boto3.client("s3")

    try:
        response = s3_client.generate_presigned_url(
            ClientMethod=client_method_name,
            Params=method_parameters,
            ExpiresIn=expiration,
            HttpMethod=http_method,
        )
    except ClientError as e:
        logging.error(e)
        return None

    return response


def download_img(
    username,
    expiration=3600,
    bucket_name="xtradorinary-dalle-imgs",
):
    return create_presigned_url_expanded(
        "get_object",
        {
            "Bucket": bucket_name,
            "Key": username,
        },
        expiration,
    )


def upload_img(
    username,
    img_url,
    bucket_name="xtradorinary-dalle-imgs",
):
    s3_client = boto3.client("s3")
    try:
        img_response = requests.get(img_url, stream=True)
        response = s3_client.upload_fileobj(img_response.raw, bucket_name, username)
    except ClientError as e:
        logging.error(e)
        return None

    return response


def check_file_exists(file_uri, bucket_name="xtradorinary-dalle-imgs"):
    s3 = boto3.client("s3")
    try:
        s3.head_object(Bucket=bucket_name, Key=file_uri)
    except ClientError as e:
        if e.response["Error"]["Code"] == "404":
            return False
        else:
            raise
    return True