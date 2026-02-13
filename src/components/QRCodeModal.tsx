import { useEffect, useRef, useState } from 'react';
import { Modal } from './ui/Modal';
import QRCodeLib from 'qrcode.js';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  username: string;
}

export function QRCodeModal({ isOpen, onClose, url, username }: QRCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Create trackable URL with analytics parameters
  const trackableUrl = `${url}?utm_source=qr&utm_medium=scan&utm_campaign=profile_share&utm_content=${username}`;

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      generateQRCode();
    }
  }, [isOpen, trackableUrl]);

  const generateQRCode = async () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 300;
    canvas.height = 300;

    // Generate QR code
    const qr = new QRCodeLib({
      text: trackableUrl,
      width: 300,
      height: 300,
      colorDark: '#33373B', // String dark color
      colorLight: '#FFFFFF',
      correctLevel: QRCodeLib.CorrectLevel.H, // High error correction for logo overlay
    });

    // Draw QR code
    qr.makeCode(trackableUrl);

    // Create QR code image
    const qrImage = new Image();
    qrImage.onload = () => {
      ctx.drawImage(qrImage, 0, 0, 300, 300);

      // Add String logo in the center
      addStringLogo(ctx);

      // Convert to data URL for download
      setQrDataUrl(canvas.toDataURL());
    };
    qrImage.src = qr.toDataURL();
  };

  const addStringLogo = (ctx: CanvasRenderingContext2D) => {
    // Create a white background circle for the logo
    const centerX = 150;
    const centerY = 150;
    const logoSize = 40;

    // White background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, logoSize / 2 + 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Draw String logo (simplified S shape)
    ctx.fillStyle = '#75F8CC'; // String mint color
    ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('S', centerX, centerY);
  };

  const downloadQRCode = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.download = `string-qr-${username}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const copyQRUrl = async () => {
    try {
      await navigator.clipboard.writeText(trackableUrl);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="QR Code">
      <div className="flex flex-col items-center space-y-6 p-4">
        {/* QR Code Display */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <canvas
            ref={canvasRef}
            className="block"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* URL Display */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trackable URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={trackableUrl}
              readOnly
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
            />
            <button
              onClick={copyQRUrl}
              className="p-2 text-gray-500 hover:text-string-mint hover:bg-string-mint/10 rounded-lg transition-colors"
              title="Copy URL"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={downloadQRCode}
            className="flex-1 bg-string-mint text-string-dark font-medium py-3 px-4 rounded-xl hover:bg-string-mint-light transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            Download QR Code
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-gray-500 text-center">
          QR code includes tracking parameters for analytics.
          <br />
          Scans will be attributed to QR code sharing.
        </p>
      </div>
    </Modal>
  );
}