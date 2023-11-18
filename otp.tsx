import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';

interface OtpInputProps {
  length: number;
}

const OtpInput: React.FC<OtpInputProps> = ({ length }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputsRef = useRef<HTMLInputElement[]>(new Array(length).fill(null).map(() => React.createRef<HTMLInputElement>()));

  useEffect(() => {
    inputsRef.current[0].current?.focus();
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return; // Only allow numbers
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next input
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleBackspace = (element: HTMLInputElement, index: number) => {
    if (index !== 0 && !element.value) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputsRef.current[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, length);
    if (pasteData.length === length && !isNaN(Number(pasteData))) {
      setOtp([...pasteData.split('')]);
      inputsRef.current[length - 1].current?.focus();
    }
  };

  return (
    <div onPaste={handlePaste}>
      {otp.map((data, index) => (
        <input
          key={index}
          ref={inputsRef.current[index]}
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Backspace' && handleBackspace(e.currentTarget, index)}
          maxLength={1}
        />
      ))}
    </div>
  );
};

export default OtpInput;
