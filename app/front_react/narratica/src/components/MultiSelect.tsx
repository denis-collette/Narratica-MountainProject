import { useState } from 'react';
import { IoClose } from "react-icons/io5";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Tag {
    id: number | string;
    name: string;
}

interface MultiSelectProps {
    icon: React.ReactNode;
    label: string;
    placeholder: string;
    options: Tag[];
    selectedValues: string[];
    onSelect: (value: string) => void;
    onRemove: (value: string) => void;
    onAddNewTag?: (name: string) => void;
}

export function MultiSelect({
    icon,
    label,
    placeholder,
    options,
    selectedValues,
    onSelect,
    onRemove,
    onAddNewTag
}: MultiSelectProps) {
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newTagName, setNewTagName] = useState("");

    const handleAddNewTag = () => {
        if (newTagName.trim() && onAddNewTag) {
            onAddNewTag(newTagName.trim());
            setNewTagName("");
            setIsAddingNew(false);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-white text-lg">{label}</label>
                <label className="flex items-center gap-2 text-sm text-gray-400">
                    <input
                        type="checkbox"
                        checked={isAddingNew}
                        onChange={(e) => setIsAddingNew(e.target.checked)}
                        className="rounded border-gray-400"
                    />
                    Ajouter nouveau
                </label>
            </div>

            {isAddingNew ? (
                <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {icon}
                    </span>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            className="flex-1 bg-[#2b2b2b] text-white pl-10 pr-4 py-3 rounded-md focus:outline-none"
                            placeholder={`Nouveau ${label.toLowerCase()}`}
                        />
                        <button
                            type="button"
                            onClick={handleAddNewTag}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 rounded-md"
                        >
                            Ajouter
                        </button>
                    </div>
                </div>
            ) : (
                <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                        {icon}
                    </span>
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
                                    className="hover:bg-[#3b3b3b]"
                                >
                                    {option.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {selectedValues.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedValues.map(value => {
                        const option = options.find(o => o.id.toString() === value);
                        if (!option) return null;
                        return (
                            <span
                                key={value}
                                className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
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
                </div>
            )}
        </div>
    );
}