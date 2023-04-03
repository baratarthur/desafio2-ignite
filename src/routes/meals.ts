import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { knex } from "../database"
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from "../middlewares/check-session-id"
import { checkAccessToMeal } from "../middlewares/check-access-to-meal"

export async function mealRoutes(app: FastifyInstance) {
    app.addHook('preHandler', checkSessionIdExists)

    app.get(
        '/',
        async (request, reply) => {
            const { sessionId } = request.cookies
            const meals = await knex("meals").where('session_id', sessionId).select()
            return reply.status(200).send(meals)
        }
    )

    app.get(
        '/:id',
        {
            preHandler: [
                checkAccessToMeal
            ]
        },
        async (request, reply) => {
            const updateMealParamsSchema = z.object({
                id: z.string()
            })
            const { id } = updateMealParamsSchema.parse(request.params)
            const meal = await knex("meals").where('id', id).select().first()
            return reply.status(200).send(meal)
        }
    )

    app.post(
        '/',
        async (request, reply) => {
            const createMealBodySchema = z.object({
                name: z.string(),
                description: z.string(),
                meal_day: z.string(),
                meal_hour: z.string(),
                in_diet: z.boolean(),
            })
            const {
                name,
                description,
                meal_day,
                meal_hour,
                in_diet
            } = createMealBodySchema.parse(request.body)
            const { sessionId } = request.cookies
            await knex('meals').insert({
                id: randomUUID(),
                name,
                description,
                meal_day,
                meal_hour,
                in_diet,
                session_id: sessionId
            })
            return reply.status(201).send()
        }
    )

    app.put(
        '/:id',
        {
            preHandler: [
                checkAccessToMeal
            ]
        },
        async (request, reply) => {
            const updateMealBodySchema = z.object({
                name: z.string(),
                description: z.string(),
                meal_day: z.string(),
                meal_hour: z.string(),
                in_diet: z.boolean(),
            })
            const updateMealParamsSchema = z.object({
                id: z.string()
            })
            const { name, description, meal_day, meal_hour, in_diet } = updateMealBodySchema.parse(
                request.body
            )
            const { id } = updateMealParamsSchema.parse(request.params)
            await knex('meals')
                .where('id', id)
                .update({
                    name,
                    description,
                    meal_day,
                    meal_hour,
                    in_diet
                })
            return reply.status(200).send()
            
        }
    )

    app.delete(
        '/:id',
        {
            preHandler: [
                checkAccessToMeal
            ]
        },
        async (request, reply) => {
            const deleteMealParamsSchema = z.object({
                id: z.string()
            })
            const { id } = deleteMealParamsSchema.parse(request.params)
            await knex("meals")
                .where("id", id)
                .delete()
            return reply.status(200).send()
        }
    )

}
