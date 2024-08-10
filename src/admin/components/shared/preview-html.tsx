import React, { useState } from 'react';
import { createPortal } from 'react-dom';

type PreviewHtmlProps = {
  html: string;
};

const IFrame = ({ children, ...props }) => {
  const [contentRef, setContentRef] = useState(null);
  const mountNode = contentRef?.contentWindow?.document?.body;

  return (
    <iframe className="w-[48vw] h-[56vh]" {...props} ref={setContentRef}>
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
};

const PreviewHtml: React.FC<PreviewHtmlProps> = ({ html }) => {
  return (
    <IFrame>
      <div
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      ></div>
    </IFrame>
  );
};

export default PreviewHtml;
