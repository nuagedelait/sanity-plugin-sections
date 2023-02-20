import SectionsContent from "../components/SectionsContent";

export default {
    name: "sectionssettings",
    title: "Sections Settings",
    type: "document",
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            initialValue: 'Sections settings',
            hidden: true
        },
        {
            name: "enabletabs",
            title: "Enable Tabs",
            type: "boolean"
        },
        {
            name: "sections",
            title: "Sections",
            type: "array",
            of: [
                {
                    name: "Sections",
                    type: "object",
                    fields: [
                        {
                            name: "slug",
                            title: "Slug",
                            type: "slug",
                            options: {
                                source: (doc: any, options: any) => {
                                    const key = options.parent._key;
                                    return doc.sections.find((section: any) => section._key === key).title
                                },
                                maxLength: 200
                            }
                        },
                        {
                            name: "title",
                            title: "Title",
                            type: "string",
                        },
                        {
                            name: "type",
                            title: "Content type",
                            type: "string",
                            options: {
                                list: [
                                    { title: 'Simple Text', value: 'text' },
                                    { title: 'Rich Text', value: 'richText' }
                                ], 
                                layout: 'radio'
                            }
                        },
                    ],
                }
            ]
        }
    ]
};