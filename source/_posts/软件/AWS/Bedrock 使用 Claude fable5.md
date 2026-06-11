---
title: Bedrock 使用 Claude fable5
description: 
tags: Bedrock
toc: true
categories: Bedrock
date: 2026-06-11 00:00:00
---
参考：https://aws.amazon.com/cn/blogs/aws/anthropic-claude-fable-5-on-aws-mythos-class-capabilities-with-built-in-safeguards-now-available/

开启数据保留：
```
import boto3, json
from botocore.auth import SigV4Auth
from botocore.awsrequest import AWSRequest
import requests as req

session = boto3.Session(region_name='us-east-1')
credentials = session.get_credentials().get_frozen_credentials()

url = 'https://bedrock.us-east-1.amazonaws.com/data-retention'
body = json.dumps({
    'mode': 'provider_data_share',
    'modelId': 'anthropic.claude-fable-5'
})

request = AWSRequest(method='PUT', url=url, data=body,
                     headers={'Content-Type': 'application/json'})
SigV4Auth(credentials, 'bedrock', 'us-east-1').add_auth(request)

r = req.put(url, headers=dict(request.headers), data=body)
print(r.status_code, r.json())
```
invoke代码：
```
import boto3

bedrock_runtime = boto3.client("bedrock-runtime", region_name="us-east-1")
response = bedrock_runtime.converse(
    modelId="global.anthropic.claude-fable-5",
    messages=[
        {"role": "user", "content": [{"text": "你和opus 4.8谁更厉害"}]}
    ],
    inferenceConfig={"maxTokens": 4096},
)
print(response["output"]["message"]["content"][0])
```
