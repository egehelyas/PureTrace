import React from 'react';
import QRCode from 'qrcode.react';

const QRDisplay = ({ data }) => {
  return (
    <div>
      <h2>QR Code</h2>
      <QRCode value={data} size={256} />
    </div>
  );
};

export default QRDisplay; 