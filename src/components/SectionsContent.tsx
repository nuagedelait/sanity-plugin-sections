import { set, unset, BlockEditor as Editor } from "sanity";

import {
  Stack,
  Flex,
  Heading,
  Card,
  Badge,
  Text,
  Inline,
  Spinner,
} from "@sanity/ui";

import useSectionsSettings from "./hooks/useSectionsSettings";
import Sections, { InputValueType } from "./Sections";

export interface ValueType {
  subtitle: string;
  type: "text" | "richText";
  value: InputValueType;
  _key: string;
}

const SectionsContent = (props: any) => {
  const {
    elementProps,
    onChange,
    schemaType,
    value = "",
    onFocus,
    onBlur,
  } = props;

  const settings = useSectionsSettings();

  console.log("receivedValues :", value);

  //On change update state with new value
  const handleChange = (values: Array<ValueType>) => {
    console.log("newValues :", values);
    onChange(
      values.length > 0
        ? set({
            usetabs: settings ? settings.enabletabs : false,
            content: values,
          })
        : unset()
    );
  };

  if (!settings) {
    return (
      <Stack>
        <Card padding={2}>
          <Stack>
            <Spinner muted />
            <Text>Loading Settings</Text>
          </Stack>
        </Card>
      </Stack>
    );
  }

  if (settings && settings.sections.length === 0) {
    return (
      <Stack>
        <Card>
          <Flex>
            <Card padding={2}>
              <Badge tone="caution">caution</Badge>
            </Card>
            <Card padding={2}>
              <Heading as="h5" size={1}>
                Sections plugin
              </Heading>
            </Card>
          </Flex>
        </Card>
        <Card padding={2}>
          <Text>No section found, you should configure the module first</Text>
        </Card>
      </Stack>
    );
  }

  return (
    <>
      <Stack>
        <Card padding={2}>
          <Flex align="center">
            <Text
              size={2}
              style={{ paddingRight: "0.5em" }}
            >{`Tabs mode is `}</Text>
            <Badge tone={settings.enabletabs ? "positive" : "critical"}>
              {settings.enabletabs ? "enable" : "disable"}
            </Badge>
          </Flex>
        </Card>
        <Card padding={2}>
          <Sections
            settings={settings}
            {...props}
            onChange={handleChange}
            initialValue={value.content}
          ></Sections>
        </Card>
      </Stack>
    </>
  );
};

// Create the default export to import into our schema
export default SectionsContent;
