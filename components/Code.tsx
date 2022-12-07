import { useState } from "react";

interface CodeProps {
  placeholder: string;
  initialValue?: string;
}

export default function Code({ placeholder, initialValue }: CodeProps) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  console.log(value);

  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      rows={30}
      className="w-1/2 resize-none"
    />
  );
}
