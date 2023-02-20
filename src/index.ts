import { definePlugin, isArraySchemaType } from 'sanity'
import schemas from './schemas';
import { additionnals } from './desk';

/** @public */
export interface SectionsConfig {
    targets: Array<string>
}

/** @public */
export const Sections = definePlugin<SectionsConfig | void>(
    (config: SectionsConfig = {
        targets: ["post"]
    }) => {
        // eslint-disable-next-line no-console
        console.log('sanity-plugin-section loaded');
        return {
            name: 'sanity-plugin-sections',
            schema: {
                types: (prev: Array<any>, context) => {
                    config.targets.forEach((targetType: string, index: number) => {
                        const target = prev.findIndex(type => type.name === targetType);
                        if (target > -1) {
                            const fieldIndex = prev[target].fields.findIndex((field:any) => field.name === 'body');
                            if(fieldIndex > -1){
                                const { of, ...rest} = prev[target].fields[fieldIndex];
                                prev[target].fields[fieldIndex] = {
                                    ...rest,
                                    type: 'sectionscontent'
                                }
                            }
                        }
                    });
                    return [...schemas, ...prev]
                }
            },
        }
    })

/** @public */
export const desk = {
    additionnals
}