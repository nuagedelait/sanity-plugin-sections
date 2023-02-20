import SectionsContent from "../../components/SectionsContent";

export default {
  name: "sectionscontent",
  title: "Sections Content",
  type: 'object',
  fields: [
    {
      name: 'usetabs',
      title: 'Use tabs',
      type: 'boolean',
      hidden: true
    },
    {
      name: 'content',
      title: 'Content',
      type: "array",
      of: [
        {
          name: "SectionString",
          type: "object",
          fields: [
            {
              name: "type",
              title: "Type",
              type: "string",
            },
            {
              name: "subtitle",
              title: "Subtitle",
              type: "string",
            },
            {
              name: "content",
              title: "Content",
              type: "string",
            },
          ],
        },
        {
          name: "SectionRichText",
          type: "object",
          fields: [
            {
              name: "type",
              title: "Type",
              type: "string",
            },
            {
              name: "subtitle",
              title: "Subtitle",
              type: "string",
            },
            {
              name: "content",
              title: "Content",
              type: 'array',
              of: [
                {
                  type: 'block'
                }
              ]
            }
          ]
        }
      ],
    }
  ],
  components: {
    input: SectionsContent,
  }
};