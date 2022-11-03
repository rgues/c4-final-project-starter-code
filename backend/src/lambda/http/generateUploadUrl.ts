import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createAttachmentPresignedUrl } from '../../helpers/todos';
import { createLogger } from '../../utils/logger'

const logger = createLogger('CreateTodos')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

    try {
      logger.info('Generate url')
      const url =  createAttachmentPresignedUrl(todoId)
      return {
        statusCode: 200,
        body: JSON.stringify({
          uploadUrl: url
        })
      };
    } catch (err) {
      logger.error('Failed to generate url')
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
