import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { updateTodoData } from '../../helpers/businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('UpdateTodos')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

    try {

      logger.info('Update todo item', {data: updatedTodo })
      const userId = getUserId(event)
      await updateTodoData(todoId, updatedTodo, userId) 

      return {
        statusCode: 201,
        body: ''
      }

    } catch (err) {

      logger.info('Update todo failed', {error: err })

      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'update failed'
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
