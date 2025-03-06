import { sendEmail } from "../config/aws-ses.config";
import { Inventory } from "../models/inventory.schema";
import { User } from "../models/user.schema";

export const createEmailTemplate = async (newOrder: any) => {
  try {
    const idList = newOrder.items.map((item: any) => {
      return item.productId;
    });
    const itemList = await Inventory.find(
      {
        productId: { $in: idList },
      },
      { productName: 1 }
    );

    const emailBody = `
   <html>
     <body>
       <h2>Order Confirmation</h2>
       <p><strong>Order ID:</strong> ${newOrder.orderId}</p>
       <h3>Items Purchased:</h3>
       <ul>
         ${itemList.map((item) => `<li>${item?.productName}</li>`).join("")}
       </ul>
       <p><strong>Order Status:</strong> ${newOrder.status}</p>
       <p>Thank you for shopping with us!</p>
     </body>
   </html>
 `;

    return emailBody;
  } catch (error) {
    console.log("Error creating email template:", error);
    return null;
  }
};

export const emailSend = async (newOrder: any) => {
  try {
    const user: any = await User.findOne({ userId: newOrder?.userId });
    const emailTemplate = await createEmailTemplate(newOrder);
    if (emailTemplate) {
      await sendEmail(user?.email, "Order Notification", emailTemplate);
    }
  } catch (error) {
    throw new Error("Error while processing email : " + error);
  }
};
