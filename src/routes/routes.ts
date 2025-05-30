import {
  CreateShopOwner,
  deleteShopOwner,
  logIn,
  updateShopOwner,
  getShopOwnerById,
} from "../controller/shopOwner/shopOwnerController";
import { Router } from "express";
import shopOwnerBodyChecker from "../middleware/shopOwner/shopOwnerValidator";
import handleValidationErrors from "../middleware/handelValidatorError";
import logInValidator from "../middleware/shopOwner/loginValidator";
import checkValidUser from "../middleware/checkValidUser";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getSellingProductByDate,
  getSingleProduct,
  updateProduct,
} from "../controller/products/productsController";
import {
  addCustomer,
  deleteCustomer,
  getAllCustomers,
  getSingleCustomer,
  getSingleCustomerByPhone,
  updateCustomer,
} from "../controller/customer/customerController";
import {
  createCustomerPaymentHistory,
  deleteCustomerPaymentHistory,
  getAllCustomerPaymentHistory,
  getSingleCustomerPaymentHistory,
  updateCustomerPaymentHistory,
} from "../controller/customer/CustomerPaymentHistory";
import {
  createLoneProvider,
  deleteLoneProvider,
  getAllLoneProviders,
  getSingleLoneProvider,
  updateLoneProvider,
} from "../controller/loneProvider/loneProviderController";
import {
  createProductVoicer,
  getAllProductVoicer,
  getProductVoicersWithoutCustomer,
  getSingleProductVoicer,
} from "../controller/productVoicer/productVoicerController";
import {
  createBusinessContactInfo,
  deleteBusinessContactInfo,
  getAllBusinessContactInfo,
  getSingleBusinessContactInfo,
  updateBusinessContactInfo,
} from "../controller/businessContactInfo/businessContactInfo";
import {
  crateCash,
  createManyCash,
  getAllCash,
  getTodayCash,
  getTodayCashInHistory,
  getTodayCashOutHistory,
} from "../controller/cash/cashController";
import forgetPassword from "../controller/shopOwner/forgetPass";
import resetPassword from "../controller/shopOwner/resetPassword";
import checkOtp from "../controller/shopOwner/checkOtp";
import { dailySellingReport } from "../controller/report/dailySellingReport";
import {
  monthlyCashReport,
  yearlyCashReport,
} from "../controller/report/cashReport";
import {
  deleteProductGive,
  deleteProductReceive,
  getProductGive,
  getProductReceive,
  getSingleProductGive,
  getSingleProductReceive,
  updateProductGive,
  updateProductReceive,
  createProductGive,
  createProductReceive,
} from "../controller/productGiveTake/productGiveTake";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
} from "../controller/category/categoryController";

import { sendMessageToAll } from "../controller/sms/smsController";
import dashboardReport, { totalInvestment } from "../controller/report/dashboardReport";
import {
  createNote,
  deleteAllNotes,
  deleteMeanyNotesByGivenId,
  getCompletedNotes,
  getNotes,
  getSingleNote,
  getUncompletedNotes,
  updateNote,
  deleteNote,
} from "../controller/note/noteController";
import {
  addRawProduct,
  deleteRawProduct,
  getAllRawProducts,
  getRawProductReport,
  getRawSingleProduct,
  updateRawProduct,
  useRawProductForProduction,
} from "../controller/rawProducts/rawProductController";
import {
  createRawCategory,
  deleteRawCategory,
  getAllRawCategory,
  getSingleRawCategory,
  updateRawCategory,
} from "../controller/rawCategory/rawCategoryController";
import {
  createSupplier,
  deleteSupplier,
  getAllSuppliers,
  getSingleSupplier,
  updateSupplier,
} from "../controller/supplier/supplierController";

const router = Router();

/**
 *  shop owner routes
 **/

// add shop owner
router.post(
  "/create-shop-owner",
  shopOwnerBodyChecker,
  handleValidationErrors,
  CreateShopOwner
);

// login route
router.post("/login", logInValidator, handleValidationErrors, logIn);

// forget password
router.post("/forget-password", forgetPassword);
router.post("/check-otp", checkOtp);
router.post("/reset-password", resetPassword);
router.put("/update-shop-owner/:id", checkValidUser, updateShopOwner);
router.get("/shop-owner/:id", checkValidUser, getShopOwnerById);
router.delete("/delete-shop-owner/:id", checkValidUser, deleteShopOwner);

/**
 * PRODUCT ROUTES start
 **/

// create product
router.post("/products", checkValidUser, addProduct);

// get all products
router.get("/products", checkValidUser, getAllProducts);

// get single product
router.get("/product/:id", checkValidUser, getSingleProduct);

// update product
router.put("/product/:id", checkValidUser, updateProduct);

// delete product
router.delete("/product/:id", checkValidUser, deleteProduct);
router.post(
  "/selling-product-by-date",
  checkValidUser,
  getSellingProductByDate
);

/**
 * PRODUCT ROUTES end
 **/

/**
 * Customer ROUTES start
 **/
// create customer
router.post("/customer", checkValidUser, addCustomer);

// get all customers
router.get("/customer", checkValidUser, getAllCustomers);

// get single customer
router.get("/customer/:id", checkValidUser, getSingleCustomer);
// get single customer phone number
router.get(
  "/customer-by-phone/:phone",
  checkValidUser,
  getSingleCustomerByPhone
);

// update customer
router.put("/customer/:id", checkValidUser, updateCustomer);

// delete customer
router.delete("/customer/:id", checkValidUser, deleteCustomer);

/**
 * Customer ROUTES end
 **/

/**
 * CustomerPaymentHistory ROUTES start
 **/

router.post(
  "/customer-payment-history",
  checkValidUser,
  createCustomerPaymentHistory
);

router.get(
  "/customer-payment-history",
  checkValidUser,
  getAllCustomerPaymentHistory
);

router.get(
  "/customer-payment-history/:id",
  checkValidUser,
  getSingleCustomerPaymentHistory
);

router.put(
  "/customer-payment-history/:id",
  checkValidUser,
  updateCustomerPaymentHistory
);

router.delete(
  "/customer-payment-history/:id",
  checkValidUser,
  deleteCustomerPaymentHistory
);

/**
 * CustomerPaymentHistory ROUTES end
 **/

/**
 * LoneProvider ROUTES start
 **/

// create lone provider
router.post("/lone-provider", checkValidUser, createLoneProvider);

// get all lone providers
router.get("/lone-provider", checkValidUser, getAllLoneProviders);

// get single lone provider
router.get("/lone-provider/:id", checkValidUser, getSingleLoneProvider);

// update lone provider
router.put("/lone-provider/:id", checkValidUser, updateLoneProvider);

// delete lone provider
router.delete("/lone-provider/:id", checkValidUser, deleteLoneProvider);

/**
 * LoneProvider ROUTES end
 **/

/**
 * createProductVoicer ROUTES end
 **/

router.post("/product-voicer", checkValidUser, createProductVoicer);
router.get(
  "/product-voicers-without-customer",
  checkValidUser,
  getProductVoicersWithoutCustomer
);

router.get("/product-voicer/:customerid", checkValidUser, getAllProductVoicer);
router.get(
  "/product-voicer/single/:id",
  checkValidUser,
  getSingleProductVoicer
);

/**
 * createProductVoicer ROUTES end
 **/

/**
 * Business ContactInfo ROUTES start
 **/

router.post(
  "/business-contact-info",
  checkValidUser,
  createBusinessContactInfo
);

router.get("/business-contact-info", checkValidUser, getAllBusinessContactInfo);

router.get(
  "/business-contact-info/:id",
  checkValidUser,
  getSingleBusinessContactInfo
);

router.put(
  "/business-contact-info/:id",
  checkValidUser,
  updateBusinessContactInfo
);

router.delete(
  "/business-contact-info/:id",
  checkValidUser,
  deleteBusinessContactInfo
);

/**
 * Business ContactInfo ROUTES end
 **/

/**
 * Cash ROUTES start
 **/

router.post("/cash", checkValidUser, crateCash);
router.post("/create-many-cash", checkValidUser, createManyCash);

router.get("/cash", checkValidUser, getAllCash);
router.get("/today-cash/:today", checkValidUser, getTodayCash);

router.get("/daily-sell", checkValidUser, dailySellingReport);

router.get("/today-cash-in/:today", checkValidUser, getTodayCashInHistory);
router.get("/today-cash-out/:today", checkValidUser, getTodayCashOutHistory);

/**
 * Cash ROUTES end
 **/

/**
 * Cash Report ROUTES start
 **/
router.get("/cash-report/:year", checkValidUser, yearlyCashReport);
router.get(
  "/monthly-cash-report/:year/:month",
  checkValidUser,
  monthlyCashReport
);

router.post("/dashboard-report", checkValidUser, dashboardReport);
router.get(
  "/dashboard-report-products",
  checkValidUser,
  totalInvestment
);

/**
 * Cash Report ROUTES end
 **/

router.get("/product-receive", checkValidUser, getProductReceive);
router.get("/product-give", checkValidUser, getProductGive);
router.get("/product-receive/:id", checkValidUser, getSingleProductReceive);
router.get("/product-give/:id", checkValidUser, getSingleProductGive);

router.put("/product-receive/:id", checkValidUser, updateProductReceive);
router.put("/product-give/:id", checkValidUser, updateProductGive);

router.delete("/product-receive/:id", checkValidUser, deleteProductReceive);
router.delete("/product-give/:id", checkValidUser, deleteProductGive);
router.post("/product-receive", checkValidUser, createProductReceive);
router.post("/product-give", checkValidUser, createProductGive);

// Category routes
router.post("/category", checkValidUser, createCategory);
router.get("/category", checkValidUser, getAllCategory);
router.delete("/category/:id", checkValidUser, deleteCategory);

// Send sms to all users
router.post("/send-message-to-all", checkValidUser, sendMessageToAll);

// note routes start
router.post("/notes", checkValidUser, createNote);
router.get("/notes", checkValidUser, getNotes);
router.get("/notes/:id", checkValidUser, getSingleNote);
router.put("/notes/:id", checkValidUser, updateNote);
router.patch("/notes/complete-many", checkValidUser, updateNote);
router.delete("/notes/:id", checkValidUser, deleteNote);
router.get("/notes/uncompleted", checkValidUser, getUncompletedNotes);
router.get("/notes/completed", checkValidUser, getCompletedNotes);
router.delete("/notes/delete-many", checkValidUser, deleteMeanyNotesByGivenId);
router.delete("/notes/delete-all", checkValidUser, deleteAllNotes);

// note routes end

// raw product
router.post("/raw-product", checkValidUser, addRawProduct);
router.get("/raw-product", checkValidUser, getAllRawProducts);
router.get("/raw-product/:id", checkValidUser, getRawSingleProduct);
router.put("/raw-product/:id", checkValidUser, updateRawProduct);
router.delete("/raw-product/:id", checkValidUser, deleteRawProduct);

//  Raw Category
router.post("/raw-category", checkValidUser, createRawCategory);
router.get("/raw-category", checkValidUser, getAllRawCategory);
router.delete("/raw-category/:id", checkValidUser, deleteRawCategory);
router.put("/raw-category/:id", checkValidUser, updateRawCategory);
router.get("/raw-category/:id", checkValidUser, getSingleRawCategory);
router.put(
  "/raw-to-production/:id",
  checkValidUser,
  useRawProductForProduction
);
router.get("/raw-product-history/report", checkValidUser, getRawProductReport);

// Supplier
router.post("/supplier", checkValidUser, createSupplier);
router.get("/supplier", checkValidUser, getAllSuppliers);
router.get("/supplier/:id", checkValidUser, getSingleSupplier);
router.put("/supplier/:id", checkValidUser, updateSupplier);
router.delete("/supplier/:id", checkValidUser, deleteSupplier);

export default router;
