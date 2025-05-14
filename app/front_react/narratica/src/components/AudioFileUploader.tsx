import React, { useState, useEffect } from "react";
import { FaRegImage } from "react-icons/fa";

interface AudioFileUploaderProps {
  onFilesSelected: (files: File[]) => void;
}

const AudioFileUploader: React.FC<AudioFileUploaderProps> = ({ onFilesSelected }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...selectedFiles, ...newFiles];
      setSelectedFiles(updatedFiles);
      onFilesSelected(updatedFiles); // send updated files to parent
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    onFilesSelected(updatedFiles); // send updated files to parent
  };

  return (
    <section className="relative">
      <label className="text-white text-lg mb-2 block">Sélectionner chapitres</label>
      <div className="relative">
        <label
          htmlFor="fileUpload"
          className="cursor-pointer flex items-center bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
        >
          <FaRegImage className="mr-2" />
          Choisir chapitres
        </label>
        <input
          id="fileUpload"
          type="file"
          name="audio_files"
          accept="audio/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {selectedFiles.length > 0 && (
        <ul className="mt-4 space-y-2">
          {selectedFiles.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-[#1e1e1e] text-white p-2 rounded"
            >
              <span className="truncate max-w-[70%]">{file.name}</span>
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                onClick={() => removeFile(index)}
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default AudioFileUploader;
