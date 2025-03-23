import * as React from 'react';

interface EmailTemplateProps {
  userName: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  userName,
  message
}) => (
  <div>
    <h1>Hi, {userName}!</h1>
    <p>{message}</p>
  </div>
);