"use client";

import { Html5QrcodeResult, Html5Qrcode } from "html5-qrcode";
import { Button } from "../ui/button";

const handleQRScan = () => {
  // This method will trigger user permissions
  Html5Qrcode.getCameras()
    .then((devices) => {
      /**
       * devices would be an array of objects of type:
       * { id: "id", label: "label" }
       */
      if (devices && devices.length) {
        var cameraId = devices[0].id;
        // .. use this to start scanning.
        const html5QrCode = new Html5Qrcode(/* element id */ "reader");
        if (html5QrCode.isScanning) return html5QrCode.stop();
        html5QrCode
          .start(
            cameraId,
            {
              fps: 10, // Optional, frame per seconds for qr code scanning
              qrbox: { width: 250, height: 250 }, // Optional, if you want bounded box UI
            },
            (decodedText, decodedResult) => {
              // do something when code is read
              console.log(decodedText, decodedResult);
              console.log(html5QrCode.getState());
              html5QrCode.stop();
              console.log(html5QrCode.getState());
            },
            (errorMessage) => {
              // parse error, ignore it.
            }
          )
          .catch((err) => {
            // Start failed, handle it.
          });
      }
    })
    .catch((err) => {
      // handle err
    });
};

export const ScanQRButton = () => {
  return (
    <div>
      <Button onClick={handleQRScan} className='text-xl font-bold'>
        Scan QR Code
      </Button>
      <div id='reader'></div>
    </div>
  );
};
