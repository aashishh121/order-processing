import {
  ListVerifiedEmailAddressesCommand,
  SESClient,
  SendEmailCommand,
  VerifyEmailIdentityCommand,
} from "@aws-sdk/client-ses";
import { envConfig } from "./envConfig";

export const sesClient = new SESClient({
  region: "eu-north-1",
  credentials: {
    accessKeyId: envConfig?.AWS_SES_ACCESS_KEY!,
    secretAccessKey: envConfig?.AWS_SES_SECRET_KEY!,
  },
  // endpoint: envConfig.AWS_ENDPOINT,
});

export const SES_EMAIL_ADDRESS = "aashishkumargh@gmail.com";

export const setupSES = async () => {
  try {
    const verifiedEmail = await sesClient.send(
      new ListVerifiedEmailAddressesCommand({})
    );

    if (verifiedEmail.VerifiedEmailAddresses?.includes(SES_EMAIL_ADDRESS!)) {
      console.log(`Email address is already verified: ${SES_EMAIL_ADDRESS}`);
      return;
    }

    await sesClient.send(
      new VerifyEmailIdentityCommand({
        EmailAddress: SES_EMAIL_ADDRESS,
      })
    );
    console.log(`SES email verification sent for: ${SES_EMAIL_ADDRESS}`);
  } catch (error: any) {
    console.error("Error setting up SES email identity:", error);
  }
};

export const sendEmail = async (
  toAddress: string,
  subject: string,
  body: any
) => {
  try {
    const sendEmailCommand = new SendEmailCommand({
      Source: SES_EMAIL_ADDRESS,
      Destination: {
        ToAddresses: [toAddress],
      },
      Message: {
        Subject: { Data: subject },
        Body: {
          Html: { Data: body },
          Text: { Data: body },
        },
      },
    });

    const sendEmailResponse = await sesClient.send(sendEmailCommand);
    console.log("Email sent successfully:", sendEmailResponse);
  } catch (error: any) {
    console.error("Error sending email:", error);
  }
};
