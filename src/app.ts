import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { userRoutes } from './routes/users'
import { mealRoutes } from './routes/meals'
import { reportRoutes } from './routes/reports'

export const app = fastify()

app.register(cookie)

app.register(userRoutes, {
    prefix: '/auth'
})

app.register(mealRoutes, {
    prefix: '/meal'
})

app.register(reportRoutes, {
    prefix: '/report'
})
