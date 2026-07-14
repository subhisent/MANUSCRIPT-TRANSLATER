import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { ScanRecord } from '../types';

interface ScanProps {
  onSave: (record: ScanRecord) => void;
  t: any;
}

const Scan: React.FC<ScanProps> = ({ onSave, t }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isScanning) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isScanning]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error('Camera access failed', err);
      setIsScanning(false);
      setCameraError('Unable to access camera. Please allow camera permissions or use Upload instead.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureFrame = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
        setIsScanning(false);
        processImage(dataUrl);
      }
    }
  };

  const processImage = async (dataUrl: string) => {
    setIsProcessing(true);
    try {
      const base64 = dataUrl.split(',')[1];
      const ocrResult = await geminiService.performOCR(base64, 'Field Scan');
      const text = ocrResult.extractedText || '';
      setExtractedText(text);
      onSave({
        id: `SCAN-${Date.now()}`,
        type: 'Field Scan',
        timestamp: new Date().toISOString(),
        originalText: text,
        language: ocrResult.detectedLanguage,
        imageUrl: dataUrl
      });
    } catch (error) {
      console.error("OCR processing failed during field scan", error);
      setExtractedText('OCR failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScan = () => {
    setCapturedImage(null);
    setExtractedText('');
    setCameraError(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in duration-500">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">{t.scan?.title || "Scan Document"}</h2>
        <p className="text-teal-800 mt-2 font-medium text-sm">{t.scan?.subtitle || "Capture manuscripts with your device camera"}</p>
      </div>

      {cameraError && (
        <div className="glass p-4 rounded-2xl border border-red-200 text-red-700 text-sm text-center font-medium">
          {cameraError}
        </div>
      )}

      {!isScanning && !capturedImage && !isProcessing && (
        <div className="glass p-12 md:p-20 rounded-[3rem] text-center border border-teal-700/20 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => setIsScanning(true)}
            className="bg-teal-700 hover:bg-teal-600 text-white px-10 md:px-12 py-5 rounded-[2rem] font-black transition-all shadow-xl text-base md:text-lg uppercase tracking-widest"
          >
            {t.scan?.initiate || t.scan?.useCamera || "Initiate Field Scan"}
          </button>
        </div>
      )}

      {isScanning && (
        <div className="relative glass rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-teal-700/30 aspect-video shadow-2xl bg-slate-900">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 px-4">
            <button
              type="button"
              onClick={captureFrame}
              className="bg-teal-700 hover:bg-teal-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg"
            >
              {t.scan?.snapshot || "Capture"}
            </button>
            <button
              type="button"
              onClick={() => setIsScanning(false)}
              className="bg-white text-slate-800 px-8 py-4 rounded-2xl font-black border border-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="text-center p-16 animate-pulse text-teal-800 font-bold uppercase tracking-widest text-sm">
          Analysing...
        </div>
      )}

      {extractedText && !isProcessing && (
        <div className="glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 space-y-6 border border-slate-200">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900">{t.scan?.result || "Scan Result"}</h3>
          {capturedImage && (
            <img src={capturedImage} alt="Captured document" className="w-full max-h-64 object-contain rounded-2xl border border-slate-200 bg-slate-50" />
          )}
          <div className="bg-slate-100 p-6 md:p-8 rounded-[2rem] font-mono text-sm text-slate-800 whitespace-pre-wrap">
            {extractedText}
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={resetScan}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-8 py-4 rounded-2xl font-black border border-slate-200"
            >
              Scan Again
            </button>
            <button
              type="button"
              onClick={resetScan}
              className="bg-teal-700 hover:bg-teal-600 text-white px-8 py-4 rounded-2xl font-black"
            >
              {t.scan?.save || "Done"}
            </button>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Scan;
