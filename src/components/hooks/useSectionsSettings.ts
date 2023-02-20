import { useEffect, useState } from "react";
import useVersionedClient from './useVersionedClient';
import groq from 'groq';

export interface SectionType {
    title: string,
    type: string,
    slug: string,
    initialValue: {
        subtitle:string;
        value: string | undefined
    }
}

interface SettingsType {
    enabletabs: boolean,
    sections: Array<SectionType>
    title: string
}

export default (): SettingsType | null => {

    const client = useVersionedClient();

    const [settings, setSettings] = useState<SettingsType | null>(null)

    useEffect(() => {
        if (client) {
            client.fetch(groq`*[_type=="sectionssettings"]`).then((data: any) => {
                if (data && data.length > 0) {
                    const result: SettingsType = {
                        enabletabs: data[0].enabletabs,
                        sections: data[0].sections.map((section: any) => ({
                            title: section.title,
                            type: section.type,
                            slug: section.slug.current,
                            initialValue: {
                                subtitle: '',
                                value: section.type === 'text' ? "" : undefined
                            }
                        })),
                        title: data[0].title
                    }
                    setSettings(result)
                } else {
                    setSettings(null);
                }
            })
        }
    }
        , [client])

    return settings;
}