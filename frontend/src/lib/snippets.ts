interface SnippetParams {
  endpoint: string
  accessKeyId: string
  secretAccessKey: string
  bucketName: string
  region: string
}

export function getNodeSnippet(p: SnippetParams): string {
  return `// Cloudflare R2 — S3-compatible storage
// ⚠️  Never commit credentials to Git
// Use environment variables in production

import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'

const r2 = new S3Client({
  region: '${p.region}',
  endpoint: '${p.endpoint}',
  credentials: {
    accessKeyId: '${p.accessKeyId}',
    secretAccessKey: '${p.secretAccessKey}',
  },
})

// Upload a file
await r2.send(new PutObjectCommand({
  Bucket: '${p.bucketName}',
  Key: 'hello.txt',
  Body: 'Hello from SolStore!',
  ContentType: 'text/plain',
}))

// List files
const list = await r2.send(new ListObjectsV2Command({
  Bucket: '${p.bucketName}',
}))
console.log(list.Contents?.map(f => f.Key))`
}

export function getPythonSnippet(p: SnippetParams): string {
  return `# Cloudflare R2 — S3-compatible storage
# ⚠️  Never commit credentials to Git

import boto3

r2 = boto3.client(
    's3',
    region_name='${p.region}',
    endpoint_url='${p.endpoint}',
    aws_access_key_id='${p.accessKeyId}',
    aws_secret_access_key='${p.secretAccessKey}',
)

# Upload
r2.put_object(
    Bucket='${p.bucketName}',
    Key='hello.txt',
    Body=b'Hello from SolStore!',
)

# List files
response = r2.list_objects_v2(Bucket='${p.bucketName}')
for obj in response.get('Contents', []):
    print(obj['Key'])`
}

export function getCliSnippet(p: SnippetParams): string {
  return `# Cloudflare R2 via AWS CLI (S3-compatible)
export AWS_ACCESS_KEY_ID="${p.accessKeyId}"
export AWS_SECRET_ACCESS_KEY="${p.secretAccessKey}"
export AWS_DEFAULT_REGION="${p.region}"

# Upload a file
aws s3 cp ./file.txt s3://${p.bucketName}/file.txt \\
  --endpoint-url ${p.endpoint}

# List files
aws s3 ls s3://${p.bucketName} \\
  --endpoint-url ${p.endpoint}

# Download a file
aws s3 cp s3://${p.bucketName}/file.txt ./file.txt \\
  --endpoint-url ${p.endpoint}

# Delete a file
aws s3 rm s3://${p.bucketName}/file.txt \\
  --endpoint-url ${p.endpoint}`
}

export function getEnvSnippet(p: SnippetParams): string {
  return `# Cloudflare R2 credentials — SolStore
# ⚠️  Add this file to .gitignore

R2_ENDPOINT="${p.endpoint}"
R2_ACCESS_KEY_ID="${p.accessKeyId}"
R2_SECRET_ACCESS_KEY="${p.secretAccessKey}"
R2_BUCKET_NAME="${p.bucketName}"
R2_REGION="${p.region}"

# Usage in Node.js:
# const r2 = new S3Client({
#   region: process.env.R2_REGION,
#   endpoint: process.env.R2_ENDPOINT,
#   credentials: {
#     accessKeyId: process.env.R2_ACCESS_KEY_ID,
#     secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
#   },
# })`
}