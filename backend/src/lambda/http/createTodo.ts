import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../helpers/businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('CreateTodos')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item

    try {

      logger.info('Create todo item')
      
      const userId = getUserId(event)
      const newItem = await createTodo(newTodo, userId)
  
      return {
        statusCode: 201,
        body: JSON.stringify({
          item: newItem
        })
      }

    } catch(err) {

      logger.error('create error ', err)

      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Failed to create todo item'
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
