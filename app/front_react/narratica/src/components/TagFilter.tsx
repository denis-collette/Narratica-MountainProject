import React from 'react'
import { Tag } from '@/app/api/audio/getTagById';

interface TagFilter {
    tags: Tag[];
    selectedTag: number | null;
    setSelectedTag: (tagId: number | null) => void;
}

const Filter: React.FC<TagFilter> = ({ tags, setSelectedTag }) => {
    return (
        <section className="py-4 overflow-x-auto">
            <section className="flex space-x-2 min-w-max">
                <button
                    className='text-xl text-white font-bold hover:underline'
                    onClick={() => setSelectedTag(null)}
                >
                    All Tags
                </button>
                {tags.map((tag) => (
                    <button
                        key={tag.id}
                        className='text-xl text-white font-bold hover:underline'
                        onClick={() => setSelectedTag(tag.id)}
                    >
                        {tag.name}
                    </button>
                ))}
            </section>
        </section>
    );
}

export default Filter