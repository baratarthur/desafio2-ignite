import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('meals', (table) => {
        table.uuid('id').primary()
        table.text('name').notNullable()
        table.text('description').notNullable()
        table.timestamp('meal_hour').notNullable()
        table.boolean('in_diet').notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('meals')
}

