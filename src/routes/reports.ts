import { FastifyInstance } from "fastify"
import { z } from "zod"
import { knex } from "../database"
import { checkSessionIdExists } from "../middlewares/check-session-id"

export async function reportRoutes(app: FastifyInstance) {
    app.addHook('preHandler', checkSessionIdExists)

    app.get(
        '/',
        async (request, reply) => {
            const reportQuerySchema = z.object({
                maxDaysInDiet: z.number()
            })
            const { sessionId } = request.cookies
            const meals = await knex('meals').where('session_id', sessionId).select()
            const query = await knex('meals')
                .select()
                .from(
                    knex('meals')
                        .where('in_diet', true)
                        .groupBy('meal_day')
                        .count('*', {as: 'dias'})
                )
                .max('dias', { as: 'maxDaysInDiet' })
                .first()
            const { maxDaysInDiet } = reportQuerySchema.parse(query)
            const totalMeals = meals.length
            const totalMealsInDiet = meals.filter(m => m.in_diet).length
            const totalMealsOutDiet = totalMeals - totalMealsInDiet
            return reply.status(200).send({
                totalMeals,
                totalMealsInDiet,
                totalMealsOutDiet,
                maxDaysInDiet,
            })
        }
    )
}
