import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { paymentService } from './payment.service';
import config from '../../config';

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[
      c
    ] as string)
  );

const makePayment = catchAsync(async (req, res) => {
  const rawStatus =
    ((req.query.status as string) || (req.body && req.body.status) || '')
      .toString()
      .toLowerCase();
  const isSuccess = rawStatus !== 'failed' && rawStatus !== 'fail';

  const rawTxn = (req.query.transactionId || (req.body && req.body.mer_txnid) || '')
    .toString();
  const transactionId = escapeHtml(rawTxn);
  const clientUrl = config.client_base_url || 'http://localhost:3000';

  const accent = isSuccess ? '#10b981' : '#ef4444';
  const accentSoft = isSuccess ? '#d1fae5' : '#fee2e2';
  const heading = isSuccess ? 'Welcome to Premium 🌿' : 'Payment did not complete';
  const subline = isSuccess
    ? 'Thanks for supporting LeafLink. Your account is now Premium — your verified badge, exclusive tips, and priority AI Plant Doctor are unlocked.'
    : 'We were not able to confirm your payment. No charge was made. You can try again from the Premium page.';

  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${isSuccess ? 'Payment Successful' : 'Payment Failed'} · LeafLink</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #ecfdf5 0%, #ffffff 50%, #f0fdf4 100%);
      color: #111827;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .shell { width: 100%; max-width: 520px; }
    .brand {
      display: flex; align-items: center; justify-content: center;
      gap: 10px; margin-bottom: 24px;
    }
    .brand-mark {
      width: 36px; height: 36px; border-radius: 12px;
      background: linear-gradient(135deg, #10b981, #059669);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 20px rgba(16, 185, 129, 0.25);
    }
    .brand-mark svg { width: 20px; height: 20px; color: #fff; }
    .brand-name {
      font-weight: 800; font-size: 18px;
      background: linear-gradient(135deg, #059669, #047857);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .card {
      background: #ffffff;
      border-radius: 24px;
      border: 1px solid rgba(229, 231, 235, 0.8);
      box-shadow: 0 24px 60px -20px rgba(16, 185, 129, 0.18), 0 8px 20px rgba(0, 0, 0, 0.04);
      padding: 40px 32px;
      text-align: center;
      animation: rise 0.5s ease-out;
    }
    @keyframes rise {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .icon-ring {
      width: 88px; height: 88px;
      border-radius: 50%;
      background: ${accentSoft};
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
      animation: pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
    }
    @keyframes pop {
      from { transform: scale(0.5); opacity: 0; }
      to   { transform: scale(1); opacity: 1; }
    }
    .icon-ring svg { width: 44px; height: 44px; color: ${accent}; }

    h1 {
      font-size: 26px;
      font-weight: 800;
      margin: 0 0 10px;
      letter-spacing: -0.02em;
      color: #111827;
    }
    .sub {
      font-size: 15px;
      line-height: 1.6;
      color: #4b5563;
      margin: 0 0 24px;
      max-width: 380px;
      margin-left: auto;
      margin-right: auto;
    }

    .meta {
      background: #f9fafb;
      border: 1px solid #f3f4f6;
      border-radius: 14px;
      padding: 16px 18px;
      margin: 0 0 24px;
      text-align: left;
    }
    .meta-row {
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px;
    }
    .meta-row + .meta-row { margin-top: 10px; padding-top: 10px; border-top: 1px dashed #e5e7eb; }
    .meta-label {
      font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em;
      color: #6b7280; font-weight: 600;
    }
    .meta-value {
      font-size: 13px; font-family: 'SF Mono', Menlo, monospace;
      color: #111827; font-weight: 600;
      word-break: break-all;
    }
    .status-pill {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 4px 10px; border-radius: 999px;
      font-size: 12px; font-weight: 700;
      background: ${accentSoft}; color: ${accent};
    }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; background: ${accent}; }

    .actions { display: flex; flex-direction: column; gap: 10px; }
    .btn {
      display: inline-flex; align-items: center; justify-content: center;
      gap: 8px;
      padding: 13px 20px;
      border-radius: 999px;
      font-weight: 600; font-size: 14px;
      text-decoration: none;
      cursor: pointer; border: none;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .btn:hover { transform: translateY(-1px); }
    .btn-primary {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #fff;
      box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
    }
    .btn-primary:hover { box-shadow: 0 10px 24px rgba(16, 185, 129, 0.4); }
    .btn-ghost {
      background: transparent;
      color: #4b5563;
      border: 1px solid #e5e7eb;
    }
    .btn-ghost:hover { background: #f9fafb; }

    .foot {
      margin-top: 28px;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
    }
    .foot a { color: #059669; text-decoration: none; font-weight: 600; }

    @media (min-width: 480px) {
      .card { padding: 48px 40px; }
      .actions { flex-direction: row; justify-content: center; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <div class="brand">
      <div class="brand-mark">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
          <path d="M2 21c0-3 1.85-5.36 5.08-6"/>
        </svg>
      </div>
      <div class="brand-name">LeafLink</div>
    </div>

    <div class="card">
      <div class="icon-ring">
        ${
          isSuccess
            ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                 <polyline points="20 6 9 17 4 12"/>
               </svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                 <line x1="18" y1="6" x2="6" y2="18"/>
                 <line x1="6" y1="6" x2="18" y2="18"/>
               </svg>`
        }
      </div>

      <h1>${heading}</h1>
      <p class="sub">${subline}</p>

      <div class="meta">
        <div class="meta-row">
          <span class="meta-label">Status</span>
          <span class="status-pill">
            <span class="status-dot"></span>
            ${isSuccess ? 'Completed' : 'Failed'}
          </span>
        </div>
        ${
          transactionId
            ? `<div class="meta-row">
                 <span class="meta-label">Transaction</span>
                 <span class="meta-value">${transactionId}</span>
               </div>`
            : ''
        }
        <div class="meta-row">
          <span class="meta-label">Date</span>
          <span class="meta-value">${new Date().toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}</span>
        </div>
      </div>

      <div class="actions">
        <a class="btn btn-primary" href="${clientUrl}/">
          ${
            isSuccess
              ? `Open LeafLink
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                   <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                 </svg>`
              : `Back to LeafLink`
          }
        </a>
        ${
          isSuccess
            ? `<a class="btn btn-ghost" href="${clientUrl}/profile/premiumContent">Browse premium content</a>`
            : `<a class="btn btn-ghost" href="${clientUrl}/profile/verify-profile">Try again</a>`
        }
      </div>
    </div>

    <div class="foot">
      &copy; ${new Date().getFullYear()} <a href="${clientUrl}/">LeafLink</a> · Need help? Contact support.
    </div>
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
