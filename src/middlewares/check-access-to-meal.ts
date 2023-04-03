import { FastifyReply, FastifyRequest } from "fastify"
import { z } from 'zod'
import { knex } from "../database"

export async function checkAccessToMeal(
    req: FastifyRequest,
    rep: FastifyReply
) {
    const mealParamsSchema = z.object({
        id: z.string()
    })
    const { sessionId } = req.cookies
    const { id } = mealParamsSchema.parse(req.params)

    const meal = await knex('meals').where('id', id).select().first()

    if(!meal || meal.session_id !== sessionId) {
        return rep.status(404).send("Not found")
    }

}