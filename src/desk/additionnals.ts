
const baseLang = 'fr';

export default {
    settings: (S: any) => {

        return S.listItem()
            .title('Sections')
            .id('sections-settings')
            .child(
                S.document()
                    .schemaType('sectionssettings')
                    .documentId('sectionssettings')
                    .title('Sections settings')
            )
    }
}