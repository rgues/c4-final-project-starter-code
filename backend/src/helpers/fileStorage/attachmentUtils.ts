
import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'


// TODO: Implement the fileStogare logic
const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export async function getUploadUrl(todoId: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: parseInt(urlExpiration,10)
    })
}