import React from 'react';

export const Alert = ({ mode, children }) => (
     <div className={`alert--mode-${mode}`}>
     {children}
     </div>
);
