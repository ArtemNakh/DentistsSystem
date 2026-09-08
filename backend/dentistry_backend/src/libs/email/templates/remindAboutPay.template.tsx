import { Body, Heading, Html, Tailwind, Text } from '@react-email/components';
import React from 'react';

interface PaymentReminderTemplateProps {
  doctorName: string;
  appointmentDate: string;
}

export function PaymentReminderTemplate({
  doctorName,
  appointmentDate,
}: PaymentReminderTemplateProps) {
  return (
    <Tailwind
      children={
        <Html>
          <Body className="text-black">
            <Heading>Нагадування про оплату</Heading>
            <Text>
              Вітаємо! У вас залишився неоплачений візит до лікаря{" "}
              <strong>{doctorName}</strong>, який відбувся{" "}
              <strong>{appointmentDate}</strong>.
            </Text>
            <Text>
              Будь ласка, здійсніть оплату найближчим часом. Якщо виникли питання —
              зверніться до клініки.
            </Text>
          </Body>
        </Html>
      }
    />
  );
}
