
import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { TodoItem } from '../models/TodoItem'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const docClient = new AWS.DynamoDB.DocumentClient();
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})
const todosTable = process.env.TODOS_TABLE
const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

// check if todoItem exist
export async function todoExists(todoId: string, userId: string) {
    const result = await docClient
        .get({
            TableName: todosTable,
            Key: {
                todoId: todoId,
                userId: userId
            }
        })
        .promise()
    console.log('Get todo: ', result)
    return !!result.Item
}

// create attachment 
export async function createAttachment(todoId: string, userId: string, event: any): Promise<TodoItem> {
    const createdAt = new Date().toISOString()
    const newTodo = JSON.parse(event.body)
    const newItem = {
        todoId,
        userId,
        createdAt,
        ...newTodo,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
    }
    await docClient.put({
        TableName: todosTable,
        Item: newItem
    }).promise()

    return newItem
}

export async function getUploadUrl(todoId: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: parseInt(urlExpiration,10)
    })
}