import { Body, Heading, Html, Tailwind, Text } from '@react-email/components';

import React from 'react';

interface InfoAboutAppointmentTemplateProps {
  textMessage: string;
}

export function InfoAboutAppointmentTemplate({
  textMessage,
}: InfoAboutAppointmentTemplateProps) {
  return (
    <Tailwind
      children={
        <Html>
          <Body className="text-black">
            <Heading>Інформація про прийом</Heading>
            <Text>{textMessage} </Text>
          </Body>
        </Html>
      }
    />
  );
}
