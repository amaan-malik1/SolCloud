interface SnippetParams {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  region: string;
}

export function getNodeSnippet(p: SnippetParams): string {
  return `import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({
  region: '${p.region}',
  endpoint: '${p.endpoint}',
  credentials: {
    accessKeyId: '${p.accessKeyId}',
    secretAccessKey: '${p.secretAccessKey}',
  },
})

// Upload a file
await s3.send(new PutObjectCommand({
  Bucket: '${p.bucketName}',
  Key: 'hello.txt',
  Body: 'Hello from SolStore!',
}))`;
}

export function getPythonSnippet(p: SnippetParams): string {
  return `import boto3

s3 = boto3.client(
    's3',
    region_name='${p.region}',
    endpoint_url='${p.endpoint}',
    aws_access_key_id='${p.accessKeyId}',
    aws_secret_access_key='${p.secretAccessKey}',
)

# Upload
s3.put_object(Bucket='${p.bucketName}', Key='hello.txt', Body=b'Hello!')`;
}

export function getCliSnippet(p: SnippetParams): string {
  return `export AWS_ACCESS_KEY_ID="${p.accessKeyId}"
export AWS_SECRET_ACCESS_KEY="${p.secretAccessKey}"
export AWS_DEFAULT_REGION="${p.region}"

# Upload
aws s3 cp ./file.txt s3://${p.bucketName}/file.txt \\
  --endpoint-url ${p.endpoint}

# List
aws s3 ls s3://${p.bucketName} --endpoint-url ${p.endpoint}`;
}

export function getEnvSnippet(p: SnippetParams): string {
  return `R2_ENDPOINT="${p.endpoint}"
R2_ACCESS_KEY_ID="${p.accessKeyId}"
R2_SECRET_ACCESS_KEY="${p.secretAccessKey}"
R2_BUCKET_NAME="${p.bucketName}"
R2_REGION="${p.region}"`;
}
