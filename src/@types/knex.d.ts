import { knex } from 'knex'

declare module 'knex/types/table' {
    export interface Tables {
        users: {
            id: string
            email: string
            session_id: string
        }
        meals: {
            id: string
            name: string
            description: string
            meal_day: string
            meal_hour: string
            in_diet: boolean
        }
    }
}