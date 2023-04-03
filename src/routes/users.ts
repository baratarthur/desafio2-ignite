import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { knex } from "../database"
import { randomUUID } from 'node:crypto'

export async function userRoutes(app: FastifyInstance) {

    app.post(
        '/create-user',
        async (request, reply) => {
            const createUserBodySchema = z.object({
                email: z.string(),
            })
            const { email } = createUserBodySchema.parse(request.body)
            const sessionId = randomUUID();
            reply.cookie('sessionId', sessionId, {
                maxAge: 7 * 24 * 60 * 60 * 1_000
            })
            await knex('users').insert({
                id: randomUUID(),
                email,
                session_id: sessionId,
            })
            return reply.status(201).send()
        }
    )

    app.post(
        '/login',
        async (request, reply) => {
            const loginUserBodySchema = z.object({
                email: z.string()
            })
            const { email } = loginUserBodySchema.parse(request.body)
            const user = await knex('users').where('email', email).first()
            const { session_id } = user
            if(session_id) {
                reply.setCookie('sessionId', session_id, {
                    maxAge: 7 * 24 * 60 * 60 * 1_000
                })
            } else {
                return reply.status(404).send()
            }
            return reply.status(200).send()
        }
    )

}
