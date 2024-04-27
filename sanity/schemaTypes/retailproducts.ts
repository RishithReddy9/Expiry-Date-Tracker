import { defineField, defineType } from 'sanity'

export const retailproducts = defineType({
    name: 'retailproducts',
    title: 'RetailProducts',
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
            name: 'barcode',
            type: 'string',
            title: 'Barcode',
        }),
        defineField({
            name: 'category',
            type: 'string',
            title: 'Category',
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
            title: 'nutritionalInfo',
        }),
        defineField({
            name: 'quantity',
            type: 'number',
            title: 'Quantity',
        }),
        defineField({
            name: 'price',
            type: 'number',
            title: 'Price',
        }),
    ],
})