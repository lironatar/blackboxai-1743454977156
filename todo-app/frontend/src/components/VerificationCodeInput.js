import { useState, useRef } from 'react';

export default function VerificationCodeInput({ onComplete }) {
  const [code, setCode] = useState(['', '', '', '']);
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value && !/^[0-9]$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      inputs.current[index + 1].focus();
    }

    // Check if all fields are filled
    if (newCode.every(digit => digit !== '')) {
      onComplete(newCode.join(''));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex justify-center space-x-4">
      {code.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputs.current[index] = el)}
          className="w-16 h-16 text-3xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          inputMode="numeric"
          pattern="[0-9]*"
        />
      ))}
    </div>
  );
}