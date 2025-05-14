import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Option {
    id: string | number;
    name: string;
}

interface SelectOrCreateProps {
    label: string;
    options: Option[];
    selectedValue: string;
    onSelect: (value: string) => void;
    isAddingNew: boolean;
    setIsAddingNew: (value: boolean) => void;
    newName: string;
    setNewName: (value: string) => void;
    icon: React.ReactNode;
    placeholder: string;
}

const SelectOrCreate = ({
    label,
    options,
    selectedValue,
    onSelect,
    isAddingNew,
    setIsAddingNew,
    newName,
    setNewName,
    icon,
    placeholder
}: SelectOrCreateProps) => {
    return (
        <section className="relative">
            <section className="flex items-center gap-2 mb-2">
                <label className="text-white text-lg">{label}</label>
                <label className="flex items-center gap-1 text-sm text-gray-400">
                    <input
                        type="checkbox"
                        checked={isAddingNew}
                        onChange={(e) => setIsAddingNew(e.target.checked)}
                        className="rounded border-gray-400"
                    />
                    Ajouter nouveau
                </label>
            </section>
            <section className="relative">
                {!isAddingNew ? (
                    <>
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                            {icon}
                        </span>
                        <Select value={selectedValue} onValueChange={onSelect}>
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
                    </>
                ) : (
                    <section className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            {icon}
                        </span>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full bg-[#2b2b2b] text-white pl-10 pr-4 py-3 rounded-md focus:outline-none"
                            placeholder={`Nouveau ${label.toLowerCase()}`}
                        />
                    </section>
                )}
            </section>
        </section>
    );
};

export default SelectOrCreate;