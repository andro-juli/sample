import React, { useState, createRef, useEffect } from 'react';

const OtpInput = ({ length }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputsRef = useRef(new Array(length).fill().map(() => createRef()));

  useEffect(() => {
    inputsRef.current[0].current.focus();
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return; // Only allow numbers
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleBackspace = (element, index) => {
    if (index !== 0 && !element.value) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      element.previousSibling.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, length);
    if (pasteData.length === length && !isNaN(pasteData)) {
      setOtp([...pasteData]);
      inputsRef.current[length - 1].current.focus();
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
          onKeyDown={(e) => e.key === 'Backspace' && handleBackspace(e.target, index)}
          maxLength={1}
        />
      ))}
    </div>
  );
};

// Usage <OtpInput length={6} />

export default OtpInput;
