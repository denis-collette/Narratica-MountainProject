import { IoClose } from "react-icons/io5";
import { Tag } from "@/app/api/audio/getAllTags";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
    icon: React.ReactNode;
    label: string;
    placeholder: string;
    options: Tag[];
    selectedValues: string[];
    onSelect: (value: string) => void;
    onRemove: (value: string) => void;
}

export function MultiSelect({
    icon,
    label,
    placeholder,
    options,
    selectedValues,
    onSelect,
    onRemove
}: MultiSelectProps) {
    return (
        <section className="relative space-y-2">
            <label className="text-white text-lg block">{label}</label>
            <section className="relative">
                <section className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                    {icon}
                </section>
                <Select
                    value=""
                    onValueChange={onSelect}
                >
                    <SelectTrigger className="w-full bg-[#2b2b2b] text-white pl-10 pr-4 py-3 rounded-md focus:outline-none appearance-none cursor-pointer">
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2b2b2b] text-white border border-gray-600">
                        {options.map((option) => (
                            <SelectItem
                                key={option.id}
                                value={option.id.toString()}
                                className={cn(
                                    "hover:bg-[#3b3b3b]",
                                    selectedValues.includes(option.id.toString()) && "bg-[#3b3b3b]"
                                )}
                            >
                                {option.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </section>
            {selectedValues.length > 0 && (
                <section className="flex flex-wrap gap-2 mt-2">
                    {selectedValues.map(value => {
                        const option = options.find(o => o.id.toString() === value);
                        if (!option) return null;
                        return (
                            <span
                                key={value}
                                className="bg-gray-200 text-black px-3 py-1 rounded-full text-sm flex items-center gap-2"
                            >
                                {option.name}
                                <button
                                    type="button"
                                    onClick={() => onRemove(value)}
                                    className="hover:text-gray-200"
                                >
                                    <IoClose className="size-4" />
                                </button>
                            </span>
                        );
                    })}
                </section>
            )}
        </section>
    );
}