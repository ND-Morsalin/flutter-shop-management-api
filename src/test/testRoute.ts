import { Request, Response } from "express";
import prisma from "../utility/prisma";

const testRoute = async (req: Request, res: Response) => {
  const { year,month } = req.params;
  /* 
  * its working fine
  const report = await prisma.cash.aggregateRaw({
        pipeline: [
          
          // Project the required fields along with all other fields you want to include
          { 
            $project: { 
              year: { $year: "$updatedAt" }, 
              month: { $month: "$updatedAt" }, 
              week: { $week: "$updatedAt" }, 
              day: { $dayOfMonth: "$updatedAt" },
              allData: "$$ROOT" // Project all fields in the document for full day data
            } 
          },
          // Group by year
          { 
            $group: { 
              _id: "$year", 
              months: { 
                $push: { 
                  month: "$month", 
                  week: "$week", 
                  day: "$day", 
                  data: "$allData" 
                } 
              } 
            } 
          },
          // Sort years in descending order
          { $sort: { _id: -1 } },
          // Unwind months array to process each month individually
          { $unwind: "$months" },
          // Group by month within each year
          { 
            $group: { 
              _id: { year: "$_id", month: "$months.month" }, 
              weeks: { 
                $push: { 
                  week: "$months.week", 
                  day: "$months.day", 
                  data: "$months.data" 
                } 
              } 
            } 
          },
          // Sort months within each year
          { $sort: { "_id.year": -1, "_id.month": -1 } },
          // Unwind weeks array to process each week individually
          { $unwind: "$weeks" },
          // Group by week within each month
          { 
            $group: { 
              _id: { year: "$_id.year", month: "$_id.month", week: "$weeks.week" }, 
              days: { 
                $push: { 
                  day: "$weeks.day", 
                  data: "$weeks.data" 
                } 
              } 
            } 
          },
          // Sort weeks within each month
          { $sort: { "_id.year": -1, "_id.month": -1, "_id.week": -1 } },
          // Project the final result
          {
            $project: {
              year: "$_id.year",
              month: "$_id.month",
              week: "$_id.week",
              days: "$days"
            }
          }
        ],
      });
      
  console.log(report);
  return res.json({ success: true, message: "test successful", report }); */
 
  const months = Array.from({ length: 12 }, (_, i) => i + 1); // [1, 2, ..., 12]
  
console.log({
  month,
  year,
})
  /* const pipeline = [
     
      
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          totalCashBalance: { $sum: "$cashBalance" }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          cashBalance: "$totalCashBalance"
        }
      },
      {
        $sort: { month: 1 }
      }
    ]; */

 /*  const report = await prisma.cash.findMany({
    where: {
      createdAt: {
        gte: startYear,
        lte: endYear,
      },
    },
  }); do same things by aggregate */
  //! this is working fine
  const cashYearlyReport = await prisma.cash.aggregateRaw({
    options:{
      toJSON: true
    },
    pipeline: [
      {
        $match: {
          $expr: {
            $eq: [{ $year: "$createdAt" }, year]
          }
        }
      },

     
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          totalCashBalance: { $sum: "$cashBalance" }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          cashBalance: "$totalCashBalance"
        }
      },
      {
        $sort: { month: 1 , year: 1}
      },
     
    ],
  })

  //! this is working fine
  const monthlyReport = await prisma.cash.aggregateRaw({
    options: {
      toJSON: true,
    },
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $year: "$createdAt" }, parseInt(year)] },
              { $eq: [{ $month: "$createdAt" }, parseInt(month)] },
              // { $eq: ["$shopOwnerId", req.shopOwner.id] }
            ]
          }
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalCashBalance: { $sum: "$cashBalance" },
        },
      },
      {
        $project: {
          _id: 0,
          day: "$_id.day",
          month: "$_id.month",
          year: "$_id.year",
          cashBalance: "$totalCashBalance",
        },
      },
      {
        $sort: { day: 1 },
      },
    ],
  });

  return res
    .status(200)
    .json({
      monthlyReport,
      success: true,
      message: "Monthly report generated successfully",
    });

};

export default testRoute;
