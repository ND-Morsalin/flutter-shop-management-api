import { Response } from "express";
import { ExtendedRequest } from "../../types/types";
import { SellingProduct } from "@prisma/client";
import prisma from "../../utility/prisma";


const createProductVoicer = async (req: ExtendedRequest, res: Response) => {
  try {
    const { sellingProducts, customerId, paidAmount, date, discountAmount,labourCost } =
      req.body as {
        sellingProducts: SellingProduct[];
        customerId?: string;
        paidAmount: number;
        date: Date;
        discountAmount: number | undefined;
        labourCost : number | undefined;
      };
    console.log({
      body: req.body,
    });
    let customer;
    if (customerId) {
      // find user by Customer id
      customer = await prisma.customer.findUnique({
        where: {
          id: customerId,
          shopOwnerId: req.shopOwner.id,
        },
      });
      console.log({
        customer,
        customerId,
      });

      if (!customer) {
        return res.status(404).json({
          success: false,
          errors: [
            {
              type: "validation error",
              value: "",
              msg: "Customer not found",
              path: "customerId",
              location: "createProductVoicer",
            },
          ],
        });
      }
    }

    const totalBill = sellingProducts.reduce((acc, product) => {
      return acc + product.totalPrice;
    }, 0);

    // create product voicer
    const newProductVoicer = await prisma.productVoicer.create({
      data: {
        customerId: customer?.id || null,
        shopOwnerId: req.shopOwner.id,
        totalBillAmount: totalBill,
        paidAmount,
        labourCost:labourCost || 0,
        remainingDue: customer?.id
          ? totalBill - paidAmount + customer.deuAmount - discountAmount
          : 0,
        discountAmount,
        sellingProducts: {
          create: sellingProducts.map((product) => {
            return {
              totalPrice: product.sellingPrice * product.quantity,
              shopOwnerId: req.shopOwner.id,
              productId: product.productId,
              quantity: product.quantity,
              productName: product.productName,
              sellingPrice: product.sellingPrice,
              unit: product.unit,
            };
          }),
        },
      },
      include:{
        sellingProducts:true
      }
    });

    // update product stoke amount
    for (let product of sellingProducts) {
      await prisma.product.update({
        where: {
          id: product.productId,
        },
        data: {
          stokeAmount: {
            decrement: product.quantity,
          },
        },
      });
    }

    // cash will get of date of today
    const startTime = new Date(date);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(date);
    endTime.setHours(23, 59, 59, 999);

    // update cash balance and cash in history

    // check if cash is available or not
    const cash = await prisma.cash.findUnique({
      where: {
        shopOwnerId: req.shopOwner.id,
        createdAt: {
          gte: startTime,
          lte: endTime,
        },
      },
    });

    if (!cash) {
      await prisma.cash.create({
        data: {
          shopOwnerId: req.shopOwner.id,
          cashBalance: paidAmount,
          cashInHistory: {
            create: {
              cashInAmount: paidAmount,
              cashInFor: `Product sell to ${customer?.customerName || "quick invoice"}`,
              shopOwnerId: req.shopOwner.id,
              cashInDate: new Date(date),
            },
          },
        },
      });
    } else {
      // if cash is available then update cash
      await prisma.cash.update({
        where: {
          shopOwnerId: req.shopOwner.id,
          createdAt: {
            gte: startTime,
            lte: endTime,
          },
        },
        data: {
          cashBalance: {
            increment: paidAmount,
          },
          cashInHistory: {
            create: {
              cashInAmount: paidAmount,
              cashInFor: "Product sell",
              shopOwnerId: req.shopOwner.id,
              cashInDate: new Date(date),
            },
          },
        },
      });
    }
    if (customerId) {
      // update customer due balance
      await prisma.customer.update({
        where: {
          id: customerId,
          shopOwnerId: req.shopOwner.id,
        },
        data: {
          deuAmount: {
            increment: totalBill - (paidAmount + discountAmount),
          },
          customerPaymentHistories: {
            create: {
              paymentAmount: paidAmount,
              paymentStatus: "SHOPOWNERGIVE",
              shopOwnerId: req.shopOwner.id,
              deuAmount: totalBill - (paidAmount + discountAmount),
            },
          },
        },
      });
    }

    // ... (previous code remains unchanged)
    const pdfProductData = newProductVoicer.sellingProducts.map((product) => ({
      ...product,
      totalProductPrice: product.sellingPrice * product.quantity,
    }));

    const data = {
      customerName: customer?.customerName || "anonymous",
      address: customer?.address || "anonymous",
      phone: customer?.phoneNumber || "anonymous",
      products: pdfProductData,
      totalPrice: totalBill,
      beforeDue: customer?.deuAmount || "anonymous",
      labourCost:labourCost || 0,
      nowPaying: paidAmount,
      remainingDue: customer?.id
        ? totalBill + customer?.deuAmount - (paidAmount + discountAmount)
        : "anonymous",
      shopOwnerName: req.shopOwner.shopName,
      shopOwnerPhone: req.shopOwner.mobile,
      date: newProductVoicer.createdAt.toDateString(),
      // invoiceId will be 6 digit
      invoiceId: newProductVoicer.id.toString().slice(0, 10),
      discountAmount: discountAmount || 0,
    };

    // send message to customer
    // purchaseConfirmBySms({
    //   mobile: customer.phoneNumber,
    //   totalAmount: totalBill,
    //   dueAmount: totalBill - paidAmount + customer.deuAmount,
    //   shopName: req.shopOwner.shopName,
    // });
    // send message to customer end

    // Register Handlebars helpers (this can be outside the function if reused across requests)
    /*  Handlebars.registerHelper("incrementedIndex", function (index) {
      return index + 1;
    });
    Handlebars.registerHelper("isBengali", function (text) {
      const bengaliRegex = /[\u0980-\u09FF]/;
      return bengaliRegex.test(text) ? "bengali" : "english";
    });

    // Compile Handlebars template
    const hbsFileName = path.join(
      __dirname,
      "../../utility/invoice_template.hbs"
    );
    const source = fs.readFileSync(hbsFileName, "utf8");
    const template = Handlebars.compile(source);
    const html = template(data);

    // Optimized Puppeteer launch and PDF generation
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    // Inside the createProductVoicer function
    const page = await browser.newPage();
    await page.setRequestInterception(true);

    page.on("request", (request) => {
      if (["image", "stylesheet", "font"].includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.setContent(html);

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await page.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");
    res.send(pdfBuffer); */
    return res.status(200).json({
      success: true,
      message: "Product voicer created successfully",
      voicer: data,
    });
  } catch (error) {
    console.log({
      error,
      line: 195,
    });
    return res.status(500).json({
      success: false,
      obj: error,
      errors: [
        {
          type: "server error",
          value: "",
          msg: "Internal server error",
          path: "server",
          location: "createProductVoicer",
        },
      ],
    });
  }
};

const getProductVoicersWithoutCustomer = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    const productVoicersWithoutCustomer = await prisma.productVoicer.findMany({
      where: {
        customerId: null, // Filter for entries where customerId is null
        shopOwnerId:req.shopOwner.id
      },
      include:{
        sellingProducts:true
      }
    });

    return res.status(200).json({
      success: true,
      data: productVoicersWithoutCustomer,
    });
  } catch (error) {
    console.error("Error fetching product voicers without customer:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllProductVoicer = async (req: ExtendedRequest, res: Response) => {
  try {
    const { customerid } = req.query as { customerid: string };
    const productVoicers = await prisma.productVoicer.findMany({
      where: {
        shopOwnerId: req.shopOwner.id,
        customerId : customerid,
      },
      include:{
        sellingProducts:true
      }
    });

    return res.status(200).json({
      success: true,
      data: productVoicers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: [
        {
          type: "server error",
          value: "",
          msg: "Internal server error",
          path: "server",
          location: "getAllProductVoicer",
        },
      ],
    });
  }
};

const getSingleProductVoicer = async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const productVoicer = await prisma.productVoicer.findUnique({
      where: {
        id: id as string,
      },
      include:{
        sellingProducts:true
      }
    });

    if (!productVoicer) {
      return res.status(404).json({
        success: false,
        errors: [
          {
            type: "validation error",
            value: "",
            msg: "Product voicer not found",
          }
        ]
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: [
        {
          type: "server error",
          value: "",
          msg: "Internal server error",
          path: "server",
          location: "getSingleProductVoicer",
        },
      ],
    });
  }
};

const updateProductVoicer = async (req: ExtendedRequest, res: Response) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: [
        {
          type: "server error",
          value: "",
          msg: "Internal server error",
          path: "server",
          location: "updateProductVoicer",
        },
      ],
    });
  }
};

const deleteProductVoicer = async (req: ExtendedRequest, res: Response) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: [
        {
          type: "server error",
          value: "",
          msg: "Internal server error",
          path: "server",
          location: "deleteProductVoicer",
        },
      ],
    });
  }
};

export {
  createProductVoicer,
  getProductVoicersWithoutCustomer,
    getAllProductVoicer,
    getSingleProductVoicer,
  //   updateProductVoicer,
  //   deleteProductVoicer,
};
