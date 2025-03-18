import React from "react";
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";

export default function App() {
  const [value, setValue] = React.useState(`**Hello world!!!** <IFRAME SRC=\"javascript:javascript:alert(window.origin);\"></IFRAME>`);
  return (
    <div className="container">
      <MDEditor
        value={value}
        onChange={(val) => setValue(val || '')}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
      />
    </div>
  );
}