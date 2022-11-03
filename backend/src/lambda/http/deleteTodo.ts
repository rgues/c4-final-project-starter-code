import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { deleteTodo } from '../../helpers/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('DeleteTodos')


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by 

    try {

      logger.info('Delete todo item')

      const userId = getUserId(event)
      deleteTodo(todoId, userId) 
  
      return  {
        statusCode: 200,
        body: ''
      }

    } catch(err) {

      logger.error('Delete error', err)

      return  {
        statusCode: 400,
        body: JSON.stringify({
          message: 'failed to delete item'
        })
      }

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
