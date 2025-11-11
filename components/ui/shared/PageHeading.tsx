"use client";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import React, { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { motion } from "framer-motion";

// Yardımcı fonksiyon: Tailwind sınıflarını birleştirmek için
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// ----------------------------------------------------------------------
// TIP TANIMLARI (TypeScript Interfaces)
// ----------------------------------------------------------------------

interface DropdownItem {
  name: string;
  onClick: () => void;
}

interface ButtonConfig {
  show: boolean;
  label: string;
  onClick: () => void;
}

interface DropdownConfig {
  show: boolean;
  items: DropdownItem[];
  label?: string; // Dropdown'ın kendi etiketi
}

interface PageHeadingConfig {
  title: string;
  description: string;
  dropdown?: DropdownConfig;
  button1?: ButtonConfig; // Beyaz (Edit/Secondary) Buton
  button2?: ButtonConfig; // Mor (Primary) Buton
}

export default function PageHeading({ config }: { config: PageHeadingConfig }) {
  const {
    title,
    description,
    dropdown = { show: false, items: [] },
    button1 = { show: false, label: "", onClick: () => {} },
    button2 = { show: false, label: "", onClick: () => {} },
  } = config;

  return (
    <div className="md:flex md:items-center md:justify-between  pb-5">
      {/* BAŞLIK */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </motion.div>

      {/* KONTROL ELEMANLARI */}
      <div className="mt-4 flex md:mt-0 md:ml-4">
        {/* DROPDOWN */}
        {dropdown.show && (
          <Menu as="div" className="relative ml-3 mr-3 inline-block text-left">
            <Menu.Button className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              {dropdown.label}
              <ChevronDownIcon
                className="-mr-1 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {dropdown.items.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <button
                          onClick={item.onClick}
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block w-full px-4 py-2 text-left text-sm"
                          )}
                        >
                          {item.name}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        )}

        {/* BUTON 1 (BEYAZ/SECONDARY) */}
        {button2?.show && (
          <button
            type="button"
            onClick={button2?.onClick}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            {button2.label}
          </button>
        )}

        {/* BUTON 2 (MOR/PRIMARY) */}
        {button1.show && (
          <button
            type="button"
            onClick={button1.onClick}
            className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {button1.label}
          </button>
        )}
      </div>
    </div>
  );
}
