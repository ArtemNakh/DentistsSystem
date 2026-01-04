import {
  Body,
  Heading,
  Html,
  Link,
  Tailwind,
  Text,
} from '@react-email/components';

import React from 'react';

interface ResetPasswordTemplateProps {
  domain: string;
  token: string;
}

export function ResetPasswordTemplate({
  domain,
  token,
}: ResetPasswordTemplateProps) {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  return (
    <Tailwind
      children={
        <Html>
          <Body className="text-black">
            <Heading>Сброс пароля</Heading>
            <Text>
              Привіт! Ви запросили сброс пароля. Будь-ласка, перейдіть по
              наступному посиланню, щоб створити новий пароль
            </Text>
            <Link href={resetLink}>Створити новий пароль</Link>
          </Body>
        </Html>
      }
    />

    // </Tailwind>
  );
}
