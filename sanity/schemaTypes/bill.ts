import { defineField, defineType } from 'sanity'

export const bill = defineType({
    name: 'bill',
    title: 'Bill',
    type: 'document',
    fields: [
        defineField({
            name: 'products',
            title: 'Products',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'name',
                            type: 'string',
                            validation: (Rule) => Rule.required()
                        },
                        {
                            name: 'date',
                            type: 'date',
                            title: 'Expiry Date',
                            validation: (Rule) => Rule.required()
                        },
                        {
                            name: 'image',
                            type: 'image',
                            title: 'Product Image',
                        },
                        {
                            name: 'description',
                            type: 'string',
                            title: 'Description',
                        },
                        {
                            name: 'brand',
                            type: 'string',
                            title: 'Brand',
                        },
                        {
                            name: 'barcode',
                            type: 'string',
                            title: 'Barcode',
                        },
                        {
                            name: 'category',
                            type: 'string',
                            title: 'Category',
                        },
                        {
                            name: 'ingredients',
                            type: 'array',
                            of: [{ type: 'string' }],
                            title: 'Ingredients',
                        },
                        {
                            name: 'nutritionalInfo',
                            type: 'array',
                            of: [{ type: 'string' }],
                            title: 'nutrionalInfo',
                        },
                        {
                            name: 'price',
                            type: 'number',
                            title: 'Price',
                        }
                    ],
                },
            ],
        }),
        defineField({
            name: 'mobilenumber',
            title: 'Mobile Number',
            type: 'string',
            description: 'The mobile number of the customer',
        }),
    ],
})