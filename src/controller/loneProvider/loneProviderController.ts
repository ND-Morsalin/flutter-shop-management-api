import { Response } from "express";
import { ExtendedRequest } from "../../types/types";
import prisma from "../../utility/prisma";
import { LoneProvider } from "@prisma/client";

const createLoneProvider = async (req: ExtendedRequest, res: Response) => {
  try {
    const {
      phoneNumber,
      address,
      loneProviderName,
      loneTakenDate,
      totalLoneTaken,
    } = req.body as LoneProvider;

    const newLoneProvider = await prisma.loneProvider.create({
      data: {
        address,
        loneDeuAmount: totalLoneTaken,
        lonePaidAmount: 0,
        loneProviderName,
        phoneNumber,
        totalLoneTaken,
        shopOwnerId: req.shopOwner.id,
        loneTakenDate: loneTakenDate || new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Lone provider created successfully",
      loneProvider: newLoneProvider,
    });
  } catch (error) {
    console.log({
      error,
    });
    return res.status(500).json({
      success: false,
      errors: [
        {
          type: "server error",
          value: "",
          msg: "Internal server error",
          path: "server",
          location: "createLoneProvider",
        },
      ],
    });
  }
};

const getAllLoneProviders = async (req: ExtendedRequest, res: Response) => {
  try {
    const loneProviders = await prisma.loneProvider.findMany({
      where: {
        shopOwnerId: req.shopOwner.id,
      },
    });

    // if no lone provider found
    if (!loneProviders.length) {
      return res.status(404).json({
        success: false,
        errors: [
          {
            type: "not found",
            value: "",
            msg: "No lone provider found",
            path: "loneProvider",
            location: "getAllLoneProviders",
          },
        ],
      });
    }

    return res.status(200).json({
      success: true,
      message: "All lone providers",
      loneProviders,
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
          location: "getAllLoneProviders",
        },
      ],
    });
  }
};

const getSingleLoneProvider = async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    const loneProvider = await prisma.loneProvider.findUnique({
      where: {
        id: id as string,
      },
    });

    if (!loneProvider) {
      return res.status(404).json({
        success: false,
        errors: [
          {
            type: "not found",
            value: id,
            msg: "Lone provider not found",
            path: "loneProvider",
            location: "getSingleLoneProvider",
          },
        ],
      });
    }

    return res.status(200).json({
      success: true,
      loneProvider,
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
          location: "getSingleLoneProvider",
        },
      ],
    });
  }
};

const updateLoneProvider = async (req: ExtendedRequest, res: Response) => {
  try {
    const { id: loneProviderId } = req.params;
    const { givingLoneDeuAmount, receivingNewLoneAmount, lonePaymentStatus } =
      req.body as {
        givingLoneDeuAmount: string;
        receivingNewLoneAmount: string;
        lonePaymentStatus: "SHOPOWNERGIVE" | "SHOPOWNERRECIVED";
      };
    let updatedLoneProvider;

    if (givingLoneDeuAmount && lonePaymentStatus === "SHOPOWNERGIVE") {
      updatedLoneProvider = await prisma.loneProvider.update({
        where: {
          id: loneProviderId as string,
          shopOwnerId: req.shopOwner.id,
        },
        data: {
          loneDeuAmount: {
            decrement: parseInt(givingLoneDeuAmount),
          },
          lonePaidAmount: {
            increment: parseInt(givingLoneDeuAmount),
          },
        },
      });
      // create lone provider history
      await prisma.lonePaymentHistory.create({
        data: {
          lonePaymentStatus,
          givingAmount: parseInt(givingLoneDeuAmount),
          loneProviderId: updatedLoneProvider.id,
          shopOwnerId: req.shopOwner.id,
        },
      });
    }

    if (receivingNewLoneAmount && lonePaymentStatus === "SHOPOWNERRECIVED") {
      updatedLoneProvider = await prisma.loneProvider.update({
        where: {
          id: loneProviderId as string,
          shopOwnerId: req.shopOwner.id,
        },
        data: {
          loneDeuAmount: {
            increment: parseInt(receivingNewLoneAmount),
          },
          totalLoneTaken: {
            increment: parseInt(receivingNewLoneAmount),
          },
        },
      });
      // create lone provider history
      await prisma.lonePaymentHistory.create({
        data: {
          lonePaymentStatus,
          givingAmount: parseInt(receivingNewLoneAmount),
          loneProviderId: updatedLoneProvider.id,
          shopOwnerId: req.shopOwner.id,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lone provider updated successfully",
      loneProvider: updatedLoneProvider,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: loneProviderController.ts ~ line 203 ~ updateLoneProvider ~ error",
      error
    );
    return res.status(500).json({
      success: false,
      errors: [
        {
          type: "server error",
          value: "",
          msg: "Internal server error",
          path: "server",
          location: "updateLoneProvider",
        },
      ],
    });
  }
};

const deleteLoneProvider = async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string }; 
    const loneProviderDeleted = await prisma.loneProvider.delete({
      where: {
        id: id as string,
      },
    });
    
    return res.status(200).json({
      success: true,
      message: "Lone provider deleted successfully",
      loneProvider: loneProviderDeleted,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      success: false,
      errors: [
        {
          type: "server error",
          value: "",
          msg: "Internal server error",
          path: "server",
          location: "deleteLoneProvider",
        },
      ],
    });
  }
};

export {
  createLoneProvider,
  getAllLoneProviders,
  getSingleLoneProvider,
  updateLoneProvider,
  deleteLoneProvider,
};
