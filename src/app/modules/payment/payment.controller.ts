import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { paymentService } from './payment.service';

const makePayment = catchAsync(async (req, res) => {
  // const { transactionId, status } = req.query;
  // const result = await paymentService.makePayment(
  //   transactionId as string,
  //   status as string
  // );
  // res.send(result);
  res.send(`
   <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Success</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #eae3f0; /* Light purple background */
        margin: 0;
      }
      .card {
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        width: 420px;
        padding: 30px;
        text-align: center;
        animation: fadeIn 0.8s ease-in-out;
      }
      @keyframes fadeIn {
        0% { opacity: 0; transform: scale(0.95); }
        100% { opacity: 1; transform: scale(1); }
      }
      .card h1 {
        color: #6f42c1; /* Purple color for the heading */
        font-size: 28px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .card h1 svg {
        margin-right: 10px;
        width: 32px;
        height: 32px;
      }
      .card p {
        color: #444;
        font-size: 18px;
        margin-bottom: 25px;
      }
      .card .highlight {
        color: #6f42c1; /* Highlight color */
        font-weight: bold;
      }
      .card .info {
        background-color: #f9f9f9;
        border: 1px solid #ddd;
        padding: 20px;
        margin-top: 20px;
        border-radius: 8px;
      }
      .card .info p {
        margin: 0;
        font-size: 15px;
        color: #666;
        line-height: 1.6;
      }
      .card footer {
        margin-top: 30px;
        font-size: 13px;
        color: #aaa;
      }
      footer a {
        color: #6f42c1; /* Purple color for footer links */
        text-decoration: none;
      }
      .card .icon {
        color: #28a745; /* Green color for the success icon */
        font-size: 48px;
        margin-bottom: 15px;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 12l2 2 4-4M5 13l4 4L19 7" />
        </svg>
        Payment Success!
      </h1>
      <p>Thank you for your payment! Your booking request has been received.</p>
      <div class="info">
        <p>
         You can now aceess the <span class="highlight">LeafLink</span> premium content. <br/>
          Enjoy the premium content & share more tips to make this platform bigger.
        </p>
      </div>
      <footer>
        <p>&copy; 2024 <a href="#">LeafLink</a></p>
      </footer>
    </div>
  </body>
</html>

  `);
});

const getAllPayment = catchAsync(async (req, res) => {
  const result = await paymentService.getAllPayment();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment history retrieved  successfully',
    data: result,
  });
});

export const paymentController = {
  makePayment,
  getAllPayment,
};
