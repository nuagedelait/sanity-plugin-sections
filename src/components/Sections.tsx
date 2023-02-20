import {
  useRef,
  useState,
  MutableRefObject,
  useEffect,
  useCallback,
} from "react";

import {
  BlockEditor as Editor,
  PatchEvent,
  FormPatch,
  PortableTextBlock,
} from "sanity";

import { Card, TabList, Tab, TabPanel, TextArea } from "@sanity/ui";

import { nanoid } from "nanoid";

import { SectionType } from "./hooks/useSectionsSettings";
import { ValueType } from "./SectionsContent";

export type InputValueType =
  | string
  | PatchEvent
  | FormPatch
  | FormPatch[]
  | undefined;

const Sections = (props: any) => {
  const { onChange, schemaType, onFocus, onBlur, initialValue, settings } =
    props;

  const sectionsSchema = schemaType.fields.find(
    (field: any) => field.name === "content"
  );

  const editorSchema = sectionsSchema.type.of
    .find((field: any) => field.name === "SectionRichText")
    .fields.find((field: any) => field.name === "content");

  const getEditorProps = useCallback((index: number) => ({
      ...props,
      elementProps: {
        id: `PTE-${index}`,
        ref: currentPTE,
        onFocus,
        onBlur,
      },
      members: [],
      path: [],
      focusPath: [],
      onPathFocus: () => {},
      id: `PTE-${index}`,
      schemaType: editorSchema,
      onItemAppend: () => {},
      onItemPrepend: () => {},
      onItemRemove: () => {},
      onItemMove: () => {},
      onInsert: () => {},
      resolveInitialValue: async () => ({} as PortableTextBlock),
      resolveUploader: () => null,
      onUpload: () => {},
      onItemCollapse: () => {},
      onItemExpand: () => {},
      onItemOpen: () => {},
      onItemClose: () => {},
      renderField: () => <></>,
      renderInput: () => <></>,
      renderItem: () => <></>,
      renderPreview: () => <></>,
      renderDefault: () => <></>,
      level: 0,
      validation: () => {},
      changed: () => {},
    }), []);

  //Main State : Array of values
  const [values, setValues] = useState(
    Array.isArray(initialValue) ? initialValue : []
  );

  //TAB swtich handling
  const [currentTab, setCurrentTab] = useState(0);

  //Save action delayed for performance
  const time: MutableRefObject<NodeJS.Timeout | null> =
    useRef<NodeJS.Timeout | null>(null);

  const changeIndex = useRef(0);

  //On change update state with new value
  const handleChange = (
    target: ValueType,
    newValue: InputValueType,
    valueType: string,
    valueIndex: number
  ) => {
    if (settings) {
      const newValues: Array<ValueType> = [...values];

      settings.sections.forEach((section: SectionType, index: number) => {
        if (!newValues[index]) {
          newValues[index] = {
            type: section.type === "text" ? "text" : "richText",
            subtitle: section.initialValue.subtitle,
            value: section.initialValue.value,
            _key: nanoid(),
          };
        }
        if (!newValues[index]._key) {
          newValues[index]._key = nanoid();
        }
      });

      newValues[valueIndex] = {
        type: valueType === "text" ? "text" : "richText",
        subtitle: settings.sections[valueIndex].title,
        value: newValue,
        _key: (target && target._key) ? target._key : nanoid(),
      };

      setValues(newValues);

      changeIndex.current++;
    }
  };

  //Tab change handling, saving data on switch
  const handleTabChange = (tab: number) => {
    setCurrentTab(tab);
    onChange(values);
  };

  //Delay saving while typing for performance
  useEffect(() => {
    if (time.current) {
      clearTimeout(time.current);
    }
    if (changeIndex.current > 0) {
      time.current = setTimeout(() => {
        onChange(values);
      }, 1000);
    }

    return () => {
      if (time.current) {
        clearTimeout(time.current);
      }
    };
  }, [changeIndex.current]);

  const currentPTE = useRef<any | null>(null);

  return (
    <>
      <TabList space={2}>
        {settings.sections.map((sectionConfig: SectionType, index: number) => {
          return (
            <Tab
              key={index}
              aria-controls={`${sectionConfig.slug}-panel`}
              id={`${sectionConfig.slug}-tab`}
              label={sectionConfig.title}
              onClick={() => handleTabChange(index)}
              selected={currentTab === index}
            />
          );
        })}
      </TabList>

      {settings.sections.map((sectionConfig: SectionType, index: number) => {
        return (
          <TabPanel
            key={index}
            aria-labelledby={`${sectionConfig.slug}-tab`}
            hidden={currentTab !== index}
            id={`${sectionConfig.slug}-panel`}
          >
            <Card border marginTop={2} padding={4} radius={2}>
              {sectionConfig.type === "text" && (
                <TextArea
                  onChange={(event) => {
                    handleChange(
                      values[index],
                      event.currentTarget.value,
                      sectionConfig.type,
                      index
                    );
                  }}
                  type={sectionsSchema.type.of[index]}
                  value={values[index] ? values[index].value : ""}
                  rows={10}
                ></TextArea>
              )}
              {sectionConfig.type === "richText" && (
                <Editor
                  {...getEditorProps(index)}
                  onChange={(patchData) => {
                    handleChange(
                      values[index],
                      undefined,
                      sectionConfig.type,
                      index
                    );
                  }}
                  value={values[index].value ? values[index].value : undefined}
                />
              )}
            </Card>
          </TabPanel>
        );
      })}
      </>
  );
};

// Create the default export to import into our schema
export default Sections;
