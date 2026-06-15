import { useDebounce } from "@/app/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import qs from "query-string";

const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 500);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: "/",
        query: {
          search: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  }, [debouncedValue, router]);
  return (
    <div className="w-full relative">
      <Search className="absolute top-1/2 left-3 -translate-y-1/2 transform text-muted-foreground size-4" />
      <Input
        className="w-full max-w-129 pl-9"
        placeholder="Search Boards"
        onChange={handleChange}
        value={value}
      />
    </div>
  );
};

export default SearchInput;
