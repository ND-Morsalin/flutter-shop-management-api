import { Request, Response } from "express";
import { LoginBodyType, shopOwnerBodyType } from "../../types/types";
import bcryptjs from "bcryptjs";
import prisma from "../../utility/prisma";
import setCookie from "../../utility/setCookie";

const CreateShopOwner = async (req: Request, res: Response) => {
  const { shopName, mobile, pincode, confirmPincode } =
    req.body as shopOwnerBodyType;

  // check pincode and confirm pin code
  if (!(pincode === confirmPincode)) {
   return res.status(403).json({
      success: false,
      errors: [
        {
          type: "pin error",
          value: "",
          msg: "pin is not same",
          path: "pinNotMatch",
          location: "CreateShopOwner function",
        },
      ],
    });
  }

  //   check unique mobile number
  const existShopOwner = await prisma.shopOwner.findUnique({
    where: {
      mobile,
    },
  });

  if (existShopOwner) {
    console.log({existShopOwner})
    return res.status(405).json({
      success: false,
      errors: [
        {
          type: "Check Shop owner",
          value: "",
          msg: "Shop Owner is already exist on this mobile number",
          path: "shopOwnerExist",
          location: "CreateShopOwner function",
        },
      ],
    });
  }

  // hash pin
  const salt = await bcryptjs.genSalt(10);

  const hashPin = await bcryptjs.hash(pincode, salt);

  const shopOwner = await prisma.shopOwner.create({
    data: {
      mobile,
      pincode: hashPin,
      shopName,
    },
  });

 return res.json({
    success: true,
    message: "Shop owner created",
    shopOwner: {
      id: shopOwner.id,
      mobile: shopOwner.mobile,
      shopName: shopOwner.shopName,
    },
  });
};

const logIn = async (req: Request, res: Response) => {
  const { mobile, pincode } = req.body as LoginBodyType;

  // find Shop owner
  const shopOwner = await prisma.shopOwner.findUnique({
    where: {
      mobile,
    },
  });

  if (!shopOwner) {
    return res.status(404).json({
      success: false,
      errors: [
        {
          type: "pin error",
          value: "",
          msg: "pin is not same",
          path: "pinNotMatch",
          location: "CreateShopOwner function",
        },
      ],
    });
  }

  // compare pincode
  const isMatch = await bcryptjs.compare(pincode, shopOwner.pincode);

  if (!isMatch) {
    return  res.status(404).json({
      success: false,
      errors: [
        {
          type: "pin error",
          value: "",
          msg: "pin is not same",
          path: "pinNotMatch",
          location: "CreateShopOwner function",
        },
      ],
    });
  }

  // set cookie
  const token = await setCookie(res, {
    mobile: shopOwner.mobile,
    id: shopOwner.id,
  });

  return  res.json({
    success: true,
    message: "Login successful",
    shopOwner: {
      id: shopOwner.id,
      mobile: shopOwner.mobile,
      shopName: shopOwner.shopName,
    },
    token,
  });
};

const ShowAllShopOwner = async (req: Request, res: Response) => {};

export { CreateShopOwner, ShowAllShopOwner, logIn };