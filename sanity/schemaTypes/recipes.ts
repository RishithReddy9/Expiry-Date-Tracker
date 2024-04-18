import { defineField, defineType } from 'sanity'

export const recipes = defineType({
    name: 'recipes',
    title: 'Recipes',
    type: 'document',
    fields: [
        defineField({
            name: 'image',
            type: 'image',
            title: 'Recipe Image',
            validation: (Rule) => Rule.required()
        }),
        defineField({
            name: 'description',
            type: 'string',
            title: 'Description',
            validation: (Rule) => Rule.required()
        }),
    ],
})