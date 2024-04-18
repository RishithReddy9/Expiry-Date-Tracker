import { defineField, defineType } from 'sanity'

export const items = defineType({
    name: 'items',
    title: 'Items',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            type: 'string',
            validation: (Rule) => Rule.required()
        }),
        defineField({
            name: 'date',
            type: 'date',
            title: 'Expiry Date',
            validation: (Rule) => Rule.required()
        }),
        defineField({
            name: 'image',
            type: 'image',
            title: 'Product Image',
        }),
        defineField({
            name: 'description',
            type: 'string',
            title: 'Description',
        }),
        defineField({
            name: 'brand',
            type: 'string',
            title: 'Brand',
        }),
        defineField({
            name: 'category',
            type: 'string',
            title: 'Category',
        }),
        defineField({
            name: 'uid',
            type: 'string',
            title: 'UID',
        }),
        defineField({
            name: 'ingredients',
            type: 'array',
            of: [{ type: 'string' }],
            title: 'Ingredients',
        }),
        defineField({
            name: 'nutritionalInfo',
            type: 'array',
            of: [{ type: 'string' }],
            title: 'nutrionalInfo',
        })
    ],
})