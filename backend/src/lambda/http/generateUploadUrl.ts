import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createAttachmentPresignedUrl } from '../../helpers/businessLogic/todos';
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUrl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

    try {
      
      const userId = getUserId(event)
      const url = await createAttachmentPresignedUrl(todoId,userId)
      logger.info('Generate url',{url:url})
      return {
        statusCode: 200,
        body: JSON.stringify({
          uploadUrl: url
        })
      };
    } catch (err) {
      logger.error('Failed to generate url',err)
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Failed to generate upload url'
        })
      };
    }

  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
