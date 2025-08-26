import { ActionPanel, Action, Form, getPreferenceValues, showToast, Toast } from "@raycast/api";
import { execFile } from "child_process";
import fs from "fs";

type Preferences = { sharexPath: string };

export default function Command() {
  const { sharexPath } = getPreferenceValues<Preferences>();
  const { useRaycastForms } = getPreferenceValues<Preferences>();

if (useRaycastForms) {
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="View Metadata in ShareX"
            onSubmit={(values: { files?: string[] }) => {
              const file = values.files?.[0];

              if (!sharexPath) {
                showToast({ style: Toast.Style.Failure, title: "ShareX path not set" });
                return;
              }

              if (!file) {
                showToast({ style: Toast.Style.Failure, title: "No file selected" });
                return;
              }

              if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
                showToast({ style: Toast.Style.Failure, title: "Invalid file", message: "Please pick a valid file." });
                return;
              }

              showToast({ style: Toast.Style.Animated, title: "Opening metadata..." });
              execFile(sharexPath, ["-Metadata", file], (error) => {
                if (error) {
                  showToast({
                    style: Toast.Style.Failure,
                    title: "Error running ShareX",
                    message: error.message,
                  });
                } 
              });
            }}
          />
        </ActionPanel>  
      }
    >
      <Form.FilePicker id="files" title="Pick a File" allowMultipleSelection={false} />
    </Form>
  );
  } else {
    if (!sharexPath) {
      showToast({ style: Toast.Style.Failure, title: "ShareX path not set" });
      return;
    }
    showToast({ style: Toast.Style.Animated, title: "Opening metadata..." });
    execFile(sharexPath, ["-Metadata"], (error) => {
      if (error) {
        showToast({
          style: Toast.Style.Failure,
          title: "Error running ShareX",
          message: error.message,
        });
      } 
    });
  }
}