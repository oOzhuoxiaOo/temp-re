import React from "react";
import { Group, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import toast from "react-hot-toast";
import { VscCircleSlash, VscFiles } from "react-icons/vsc";
import { FileFormat } from "../../enums/file.enum";
import useFile from "../../store/useFile";

export const FullscreenDropzone = () => {
  const setContents = useFile(state => state.setContents);

  return (
    <Dropzone.FullScreen
      maxFiles={1}
      accept={[]}
      onReject={files => toast.error(`Unable to load file ${files[0].file.name}`)}
      onDrop={async e => {
        if (e[0].type !== "model/gltf+json") {
          toast.error("Invalid file type. Please upload a GLTF file.");
          return;
        }
        const fileContent = await e[0].text();
        let fileExtension = e[0].name.split(".").pop() as FileFormat | undefined;
        if (!fileExtension) fileExtension = FileFormat.JSON;
        setContents({ contents: fileContent, format: fileExtension, hasChanges: false });
      }}
    >
      <Group
        justify="center"
        ta="center"
        align="center"
        gap="xl"
        h="100vh"
        style={{ pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <VscFiles size={100} />
          <Text fz="h1" fw={500} mt="lg">
            Upload to D_JSON
          </Text>
          <Text fz="lg" c="dimmed" mt="sm">
            {/* (Max file size: 300 KB) */}
          </Text>
        </Dropzone.Accept>
        <Dropzone.Reject>
          <VscCircleSlash size={100} />
          <Text fz="h1" fw={500} mt="lg">
            Invalid file
          </Text>
          <Text fz="lg" c="dimmed" mt="sm">
            Allowed formats are GLTF
          </Text>
        </Dropzone.Reject>
      </Group>
    </Dropzone.FullScreen>
  );
};
