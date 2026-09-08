import { Body, Heading, Html, Tailwind, Text } from '@react-email/components';

import React from 'react';
interface AppointmentReminderTemplateProps {
  doctorName: string;
  appointmentDate: string;
}

export function AppointmentReminderTemplate({
  doctorName,
  appointmentDate,
}: AppointmentReminderTemplateProps) {
  return (
    <Tailwind
      children={
        <Html>
          <Body className="text-black">
            <Heading>Нагадування про прийом</Heading>
            <Text>
              Привіт! Нагадуємо, що завтра у вас запланований прийом до лікаря{' '}
              <strong>{doctorName}</strong> о <strong>{appointmentDate}</strong>
              .
            </Text>
            <Text>
              Будь ласка, приходьте вчасно. Якщо ви не зможете бути присутні —
              повідомте клініку заздалегідь.
            </Text>
          </Body>
        </Html>
      }
    />
  );
}
