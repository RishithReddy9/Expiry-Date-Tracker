import { defineField, defineType } from 'sanity'

export const users = defineType({
    name: 'users',
    title: 'Users',
    type: 'document',
    fields: [
        defineField({
            name: 'mobilenumber',
            type: 'string',
            title: 'Mobile number',
            validation: (Rule) => Rule.required()
        }),
        defineField({
            name: 'uid',
            type: 'string',
            title: 'UID',
            validation: (Rule) => Rule.required()
        }),
    ],
})