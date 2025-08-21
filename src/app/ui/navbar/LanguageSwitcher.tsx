'use client';

import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';


export default function LanguageSwitcher({ locale }: { locale: string }) {
    const Pathname = usePathname();
    const Router = useRouter();


    const handleLanguageChange = (newLocale: string) => {
        const path = Pathname.split("/").slice(2).join("/");
        Router.push(`/${newLocale}${path}`);
    }

    const options = [
        {
            value: 'en',
            label: 'En',
            icon: '/svg/flag-us-svgrepo-com.svg',
        },
        {
            value: 'es',
            label: 'Es',
            icon: '/svg/flag-mx-svgrepo-com.svg',
        },
    ];

    const selectedOption = options.find(option => option.value === locale);

    return (
        <Menu as="div" className="relative inline-block text-left ">
            <div>
                <Menu.Button className="inline-flex w-full justify-center rounded-md border border-green-300 bg-opacity-10 px-1 py-1 text-sm font-medium text-black hover:bg-opacity-50  ">
                    {selectedOption && (
                        <Image
                            src={selectedOption.icon}
                            alt={selectedOption.label}
                            width={20}
                            height={20}
                            className="mr-2"
                        />
                    )}
                    {selectedOption?.label}
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1 ">
                        {options.map((option) => (
                            <Menu.Item key={option.value}>
                                {({ active }) => (
                                    <button
                                        onClick={() => handleLanguageChange(option.value)}
                                        className={`${active ? 'bg-emerald-400 text-white' : 'text-gray-900'
                                            } group flex grow w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                        <Image
                                            src={option.icon}
                                            alt={option.label}
                                            width={20}
                                            height={20}
                                            className="mr-2"
                                        />
                                        {option.label}
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}