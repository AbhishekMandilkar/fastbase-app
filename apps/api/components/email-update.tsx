import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

const FastbaseUpdateEmail = () => {
  return (
    <Html>
      <Head />
      <Preview>Fastbase April Update: New features now available</Preview>
      <Tailwind>
        <Body className="bg-[#f7f7f8] font-sans py-[40px]">
          <Container className="mx-auto bg-white p-[32px] rounded-[12px] shadow-sm max-w-[500px]">
            {/* Header */}
            <Section>
              <Heading className="text-[24px] font-bold text-[#09090b] m-0">
                Fastbase Update
              </Heading>
              <Text className="text-[14px] text-[#71717a] mt-[8px] mb-[24px]">
                April 2025 Release
              </Text>
            </Section>

            <Hr className="border-t border-[#e4e4e7] my-[24px]" />

            {/* Main Content - Minimal */}
            <Section>
              <Text className="text-[16px] leading-[24px] text-[#18181b]">
                Hello,
              </Text>
              <Text className="text-[16px] leading-[24px] text-[#18181b]">
                We've just released several exciting new features for Fastbase, our modern PostgreSQL client. We've enhanced security, improved schema visualization, and added personalization options.
              </Text>
              
              <Text className="text-[16px] leading-[24px] text-[#18181b] mt-[24px]">
                We've created a detailed changelog page where you can explore all the new features and improvements.
              </Text>
            </Section>

            {/* CTA Button */}
            <Section className="mt-[32px] mb-[32px]">
              <Button
                className="bg-[#18181b] text-white font-medium py-[12px] px-[24px] rounded-[6px] no-underline text-[14px] text-center block box-border transition-colors hover:bg-[#27272a]"
                href="https://fastbase.in/apr-25"
              >
                View April Update Details
              </Button>
            </Section>

            <Text className="text-[14px] text-[#71717a]">
              Thank you for being part of our journey to create the most elegant PostgreSQL experience.
            </Text>
            
            <Text className="text-[14px] text-[#71717a] mb-[32px]">
              The Fastbase Team
            </Text>

            {/* Footer */}
            <Hr className="border-t border-[#e4e4e7] mb-[24px]" />
            <Section>
              <Text className="text-[12px] text-[#a1a1aa] text-center m-0">
                © 2025 Fastbase. All rights reserved.
              </Text>
              <Text className="text-[12px] text-[#a1a1aa] text-center m-0">
                <Link href="https://fastbase.in/unsubscribe" className="text-[#a1a1aa] underline">
                  Unsubscribe
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default FastbaseUpdateEmail;