import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('meals', (table) => {
        table.string('meal_day').after('description')
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('meals', (table) => {
        table.dropColumn('meal_day')
    })
}

