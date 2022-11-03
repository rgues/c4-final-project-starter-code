import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getTodosForUser as getTodosForUser } from '../../helpers/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('CreateTodos')

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  try {
    logger.info('Get all todo informations')
    const userId = getUserId(event)
  
    // Write your code here
    const todos = await getTodosForUser(userId);
    const result = todos;
  
    if (result.length !== 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({items : result})
      }
    }
  
    return {
        statusCode: 200,
        body: JSON.stringify({items : []})
    }

  } catch (err) {
    logger.error('Failed to get information')

    return {
      statusCode: 400,
      body: JSON.stringify({
        message : 'Failed to get informations'
      })
    }

  }

})

handler
.use(httpErrorHandler())
.use(
  cors({
    credentials: true
  })
)
