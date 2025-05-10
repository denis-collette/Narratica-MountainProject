import React from 'react'

const SkeletonCard = () => {
    return (
        <section className='rounded-lg bg-neutral-800/50 w-3xs shadow-lg animate-pulse'>
            <section className='relative w-full aspect-square'>
                <section className='rounded-lg p-2 w-full h-full bg-neutral-700/50' />
            </section>
            <section className='p-2 space-y-2'>
                <section className='h-4 bg-neutral-700/50 rounded w-3/4' />
                <section className='h-3 bg-neutral-700/50 rounded w-1/2' />
                <section className='h-3 bg-neutral-700/50 rounded w-1/2' />
            </section>
        </section>
    )
}

export const SkeletonCarousel = () => {
    return (
        <section className="relative w-full">
            <section className="overflow-hidden">
                <section className="flex space-x-4 py-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <section key={index} className="flex-none">
                            <section className="px-4 py-1 rounded-full bg-neutral-800/50 animate-pulse w-20 h-7" />
                        </section>
                    ))}
                </section>
            </section>
            <button className="absolute top-1/2 -translate-y-1/2 -left-10 w-8 h-8 rounded-full bg-neutral-800/50 animate-pulse" />
            <button className="absolute top-1/2 -translate-y-1/2 -right-1 w-8 h-8 rounded-full bg-neutral-800/50 animate-pulse" />
        </section>
    )
}

export const SkeletonBookView = () => {
    return (
        <section className='relative min-h-screen overflow-x-hidden'>
            <section className="relative min-h-screen">
                <section className="absolute inset-0 z-0 bg-neutral-900" />
                <section className="relative flex justify-between z-0 h-screen w-screen">
                    <section className="w-full flex flex-col bg-gradient-to-b from-[#00000000] from-15% to-[#120e0c] to-45% rounded-[0.5%]">
                        <section className="pt-[3%] flex items-center m-auto w-[80%] pb-[3%]">
                            <section className="w-[20%] h-0 pb-[20%] mr-[5%]">
                                <section className="rounded-[5%] shadow-[0px_0px_25px] bg-neutral-800/50 animate-pulse h-full w-full" />
                            </section>
                            <section className="text-left self-end space-y-2">
                                <section className="h-4 w-4 bg-neutral-800/50 animate-pulse rounded mb-2" />
                                <section className="h-8 w-64 bg-neutral-800/50 animate-pulse rounded" />
                                <section className="h-4 w-48 bg-neutral-800/50 animate-pulse rounded" />
                            </section>
                        </section>

                        <section className='bg-gray-800/25 flex-1 h-full border-b-[80px] overflow-y-auto'>
                            <section className='text-white pt-[3%] flex-col items-center m-auto w-[80%] pb-[3%] space-y-2'>
                                <section className="h-4 w-32 bg-neutral-800/50 animate-pulse rounded" />
                                <section className="h-20 w-full bg-neutral-800/50 animate-pulse rounded" />
                            </section>

                            <section className='max-h-[60vh]'>
                                <section className="grid grid-cols-[0.1fr_0.8fr_0.4fr_0.5fr] grid-rows-1 mx-auto w-[80%] items-center justify-between h-full mb-4">
                                    <section className='h-4 w-4 bg-neutral-800/50 animate-pulse rounded' />
                                    <section className='h-4 w-16 bg-neutral-800/50 animate-pulse rounded' />
                                    <section className='h-4 w-16 bg-neutral-800/50 animate-pulse rounded justify-self-center' />
                                    <section className='h-4 w-16 bg-neutral-800/50 animate-pulse rounded justify-self-end' />
                                </section>

                                <ul className="w-[80%] mx-auto space-y-4">
                                    {[...Array(5)].map((_, index) => (
                                        <li key={index}>
                                            <section className='hover:bg-gray-400/20 cursor-pointer'>
                                                <section className="grid grid-cols-[0.1fr_0.8fr_0.4fr_0.5fr] grid-rows-1 mx-auto w-full items-center justify-between bg-neutral-800/20 rounded-lg p-4">
                                                    <section className="h-4 w-4 bg-neutral-800/50 animate-pulse rounded" />
                                                    <section className="h-4 w-3/4 bg-neutral-800/50 animate-pulse rounded" />
                                                    <section className="h-4 w-12 bg-neutral-800/50 animate-pulse rounded justify-self-center" />
                                                    <section className="h-4 w-16 bg-neutral-800/50 animate-pulse rounded justify-self-end" />
                                                </section>
                                            </section>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </section>
                    </section>
                </section>
            </section>
        </section>
    )
}

export default SkeletonCard